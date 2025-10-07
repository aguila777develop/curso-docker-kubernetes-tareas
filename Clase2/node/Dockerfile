# --- Stage 1: Build / Compilation ---
FROM node:alpine3.22 AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para instalar las dependencias
COPY package.json package-lock.json ./

# Instalar dependencias de desarrollo (devDependencies)
RUN npm install --production=false

# Copiar el resto del código de la aplicación
COPY . .


# --- Stage 2: Production / Runtime ---
FROM node:alpine3.22 AS production

# Crear usuario no-root para mayor seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo package.json y package-lock.json
COPY package*.json ./

# Instalar solo las dependencias de producción (no devDependencies)
RUN npm install --production=true && \   
    npm cache clean --force

# Copiar el archivo de dependencias de producción desde el stage de build
COPY --from=build /app/app.js ./


# Copiar solo los archivos necesarios para la ejecución (evitar copiar el código fuente innecesario)
COPY --from=build /app/ /app/

# Cambiar ownership de los archivos al usuario nodejs
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Configurar el puerto en el que la aplicación escuchará
EXPOSE 8083

# Definir las variables de entorno necesarias
ENV NODE_ENV=production
ENV PORT=8083

# Agregar etiquetas (metadata) para identificación
LABEL maintainer="porfirioramosfernandez@gmail.com"
LABEL version="1.0"
LABEL description="Aplicación Node.js con Docker optimizada"


# Comando para iniciar la aplicación
CMD ["node", "app.js"]


# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8083/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
