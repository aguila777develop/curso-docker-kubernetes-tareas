# Establece la imagen base
FROM node:16

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias dentro del contenedor
RUN npm install

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Expone el puerto que usará la aplicación
EXPOSE 3000

# Define el comando para ejecutar la app
CMD ["npm", "start"]
