# Usamos una imagen de Java 21 (según tu log usas la 24, pero la 21 es LTS y más compatible)
# Si tienes problemas, cambia 21 por 17
FROM eclipse-temurin:21-jdk

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el archivo JAR generado (asegúrate de hacer mvn clean package antes)
COPY target/*.jar app.jar

# Exponemos el puerto 8080
EXPOSE 8080

# Comando para iniciar
ENTRYPOINT ["java", "-jar", "app.jar"]