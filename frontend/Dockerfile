# Usamos Node para construir
FROM node:22-alpine

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Ejecutamos en modo host para que sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]