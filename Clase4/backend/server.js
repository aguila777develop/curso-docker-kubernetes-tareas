const express = require("express");
const { Pool } = require("pg"); // Importar Pool de pg
const { createClient } = require("redis"); // Importar Redis
const app = express();
const PORT = 5000;

app.use(express.json());

// Conexión a la base de datos PostgreSQL utilizando variables de entorno
// const pool = new Pool({
//   user: "postgres",
//   host: "postgres-db", // Nombre del servicio PostgreSQL en Docker
//   database: "my_database",
//   password: "postgres",
//   port: 5432
// });
const pool = new Pool({
  user: process.env.DB_USER || "postgres", // Valor por defecto si no se encuentra la variable
  host: process.env.DB_HOST || "postgres-db", // Nombre del servicio de PostgreSQL en Docker
  database: process.env.DB_NAME || "my_database",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432 // Asegúrate de que se está utilizando el puerto correcto dentro del contenedor
});
pool
  .connect() // Conectar a la base de datos
  .then(() => console.log("Conectado a la base de datos PostgreSQL"))
  .catch(err => console.error("Error al conectar con PostgreSQL:", err));

// Middleware para parsear JSON
app.use(express.json());

// Conexión a Redis
const redisClient = createClient({
  socket: {
    host: "redis", // Nombre del servicio Redis en Docker
    port: 6379
  }
});
redisClient.on("error", err => console.log("Redis error:", err));
redisClient.on("connect", () => console.log("Conectado a Redis"));

redisClient.connect();
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
// GET /users
// Ruta para obtener todos los usuarios
app.get("/users", cacheMiddleware("users"), async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users"); // Consulta a la tabla 'users'
    const users = result.rows; // Obtiene los usuarios desde la consulta

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontraron usuarios" });
    }
    // Guardar en cache
    await redisClient.setEx(req.cacheKey, 60, JSON.stringify(users));
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener usuarios" });
  }
});

// GET /users/:id
app.get("/users/:id", cacheMiddleware("user"), async (req, res) => {
  const userId = parseInt(req.params.id);

  // Realizar la consulta a la base de datos
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId
    ]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    const user = result.rows[0]; // Tomamos el primer usuario encontrado
    // Guardar en cache
    await redisClient.setEx(req.cacheKey, 60, JSON.stringify(user));
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
});
// Variable para contar el número de usuarios creados
let userCount = 1;

// POST /users - Crear usuario dinámicamente
app.post("/users", async (req, res) => {
  // Generamos el nombre y el email dinámicamente
  const name = `nombre${userCount}`;
  const email = `nombre${userCount}@test.com`;

  // Incrementamos el contador para el siguiente usuario
  userCount++;

  const query = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
  try {
    const result = await pool.query(query, [name, email]);
    const newUser = result.rows[0]; // Obtener el usuario insertado
    // Invalidar cache de usuarios
    await redisClient.del("users:all");
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ success: false, error: "Error al crear usuario" });
  }
});
// PUT /users/:id - Actualizar usuario dinámicamente
app.put("/users/:id", async (req, res) => {
  const userId = req.params.id; // Obtener el ID del usuario a actualizar

  let { name, email } = req.body; // Obtener el ID del usuario a actualizar
  // Generamos el nuevo nombre y correo dinámicamente
  if (!name) name = `nombre${userId}`;
  if (!email) email = `nombre${userId}@test.com`;
  console.log(name);
  console.log(email);
  const query =
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *";
  try {
    const result = await pool.query(query, [name, email, userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    const updatedUser = result.rows[0]; // Obtener el usuario actualizado
    // Invalidar cache
    await redisClient.del(`user:${userId}`);
    await redisClient.del("users:all");
    console.log("users:all");
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar el usuario" });
  }
});
// POST /users
// app.post("/users", async (req, res) => {
//   const { name, email } = req.body;
//   const query = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
//   try {
//     const result = await pool.query(query, [name, email]);
//     const newUser = result.rows[0]; // Obtener el usuario insertado
//     res.status(201).json({ success: true, data: newUser });
//   } catch (error) {
//     console.error("Error al crear el usuario:", error);
//     res.status(500).json({ success: false, error: "Error al crear usuario" });
//   }
// });

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "backend" });
});

// Info del servicio
app.get("/info", (req, res) => {
  res.json({
    service: "Backend API",
    version: "1.0.0",
    endpoints: ["/users", "/users/:id", "/health", "/info"]
  });
});

app.listen(PORT, () => {
  console.log(`Backend API escuchando en puerto ${PORT}`);
});
