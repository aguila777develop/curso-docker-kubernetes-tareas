// server.js en /products
const express = require("express");
const mongoose = require("mongoose"); // Importar mongoose para MongoDB
const { createClient } = require("redis"); // Importar Redis
const app = express();
const PORT = 5001; // Puerto para el servicio de productos

// configuracion de redis
// const PORT = 4000;
const MONGO_URL = "mongodb://mongo-db:27017";
const DB_NAME = "products";
const CACHE_TTL = 60; // 60 segundos

app.use(express.json());
let db;
let redisClient;
mongoose.set("strictQuery", true);
// Conexión a MongoDB usando el nombre del servicio de Docker
mongoose
  .connect("mongodb://mongo-db:27017/productsdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(client => {
    console.log("Conectado a MongoDB");
    // db = client.db(DB_NAME);
  })
  .catch(err => console.error("Error al conectar con MongoDB:", err));

// Conectar a Redis
(async () => {
  redisClient = createClient({
    socket: {
      host: "redis",
      port: 6379
    }
  });

  redisClient.on("error", err => console.error("Redis error:", err));
  redisClient.on("connect", () => console.log("Conectado a Redis"));

  await redisClient.connect();
})();

// Middleware de cache
const cacheMiddleware = keyPrefix => {
  return async (req, res, next) => {
    const cacheKey = `${keyPrefix}:${req.params.id || "all"}`;

    try {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`Cache HIT: ${cacheKey}`);
        return res.json({
          source: "cache",
          data: JSON.parse(cachedData)
        });
      }

      console.log(`Cache MISS: ${cacheKey}`);
      req.cacheKey = cacheKey;
      next();
    } catch (error) {
      console.error("Error en cache:", error);
      next();
    }
  };
};
// Definir el esquema de los productos
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Crear el modelo de Producto basado en el esquema
const Product = mongoose.model("Product", productSchema);
// GET /products
app.get("/api/products", cacheMiddleware("products"), async (req, res) => {
  try {
    const products = await Product.find(); // Obtener todos los productos desde MongoDB
    // const products = await db.collection("products").find().toArray();
    // Guardar en cache
    await redisClient.setEx(req.cacheKey, CACHE_TTL, JSON.stringify(products));

    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontraron productos" });
    }
    res.status(200).json({ success: true, source: "database", data: products });
    // res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener productos" + error });
  }
});

// GET /productos/:id
app.get("/api/products/:id", cacheMiddleware("product"), async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Guardar en cache
    await redisClient.setEx(req.cacheKey, CACHE_TTL, JSON.stringify(product));

    res.status(200).json({ success: true, source: "database", data: product });
    // res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error al consultar el producto:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor" + error.message
    });
  }
});
// POST /api/products
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const result = await Product.create({
      name,
      price: parseFloat(price),
      stock: parseInt(stock)
    });

    // Invalidar cache de lista de productos
    await redisClient.del("products:all");

    res.status(201).json({
      _id: result.insertedId,
      name,
      price,
      stock
    });
    // res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({
      success: false,
      error: "Error al crear el producto" + error.message
    });
  }
});

// PUT /products/:id - Actualizar producto (invalida cache)
app.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const { name, price, stock } = req.body;

  try {
    // Actualizar producto por ID usando Mongoose
    const result = await Product.updateOne(
      { _id: productId },
      {
        $set: {
          name,
          price: parseFloat(price),
          stock: parseInt(stock),
          updatedAt: new Date()
        }
      }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado o sin cambios" });
    }

    // Invalidar cache de producto y lista
    await redisClient.del(`product:${productId}`);
    await redisClient.del("products:all");

    res.json({ message: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// DELETE /products/:id - Eliminar producto (invalida cache)
app.delete("/api/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    // Eliminar producto por ID usando Mongoose
    const result = await Product.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Invalidar cache de producto y lista
    await redisClient.del(`product:${productId}`);
    await redisClient.del("products:all");

    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar el producto" + error.message
    });
  }
});
// GET /cache/stats - Estadísticas de cache
app.get("/cache/stats", async (req, res) => {
  try {
    const keys = await redisClient.keys("*");
    const stats = {
      totalKeys: keys.length,
      keys: keys
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /cache/clear - Limpiar todo el cache
app.delete("/cache/clear", async (req, res) => {
  try {
    await redisClient.flushAll();
    res.json({ message: "Cache limpiado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Health check
app.get("/health", async (req, res) => {
  try {
    const redisPing = await redisClient.ping();
    res.json({
      status: "ok",
      mongodb: db ? "connected" : "disconnected",
      redis: redisPing === "PONG" ? "connected" : "disconnected"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Products API escuchando en puerto ${PORT}`);
});
