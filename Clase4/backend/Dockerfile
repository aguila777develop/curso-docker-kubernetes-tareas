# Usar la imagen de node:18-alpine como base
FROM node:18

# Opcional: Configurar timezone (descomenta si necesitas zona horaria específica)
# RUN apk add --no-cache tzdata
# ENV TZ=America/La_Paz
# RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \
#     echo $TZ > /etc/timezone

# Crear usuario no-root para mayor seguridad


# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (genera package-lock.json si no existe)
RUN npm install

# Instalar Redis explícitamente
RUN npm install redis

# Copiar el código de la aplicación
COPY . .

# Instalar las dependencias de producción


# Instalar solo dependencias de producción usando npm ci (más rápido y determinístico)


# Cambiar ownership de los archivos al usuario nodejs
# RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
# USER nodejs

# Exponer el puerto
EXPOSE 5000

# Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
