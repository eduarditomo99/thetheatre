# 🎬 The Theatre - Plataforma de Gestión de Cine

**The Theatre** es una aplicación web full-stack diseñada para la gestión integral de perfil de cinefilos. Este proyecto combina un backend robusto y seguro en Java con una interfaz moderna y rápida en React, todo orquestado mediante contenedores Docker para facilitar su despliegue en cualquier máquina.

---

## Tabla de Contenidos
1. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
2. [Funcionalidades Actuales](#-funcionalidades-actuales)
3. [Arquitectura y Funcionamiento Interno](#-arquitectura-y-funcionamiento-interno)
4. [Guía de Instalación y Ejecución](#-guía-de-instalación-y-ejecución)
5. [Solución de Problemas Comunes](#-solución-de-problemas-comunes)

---

## 🛠 Tecnologías Utilizadas

* **Backend:** Java 21 (Eclipse Temurin), Spring Boot 3, Spring Security, JWT, Maven.
* **Frontend:** React, Vite, JavaScript, Node.js 22 (Alpine).
* **Base de Datos:** PostgreSQL 15.
* **Infraestructura:** Docker & Docker Compose.

---

## Funcionalidades Actuales

A fecha de Enero de 2026, el proyecto cuenta con el núcleo del sistema operativo:

1.  **Sistema de Registro Seguro**: Permite crear nuevas cuentas de usuario. Las contraseñas se almacenan encriptadas (hashing) en la base de datos para máxima seguridad.
2.  **Autenticación JWT (Login)**: Al iniciar sesión, el sistema genera un *JSON Web Token*. Este "token" permite al usuario navegar por la aplicación sin tener que introducir su contraseña en cada petición.
3.  **Persistencia de Datos**: Gracias a los volúmenes de Docker y PostgreSQL, los usuarios y datos creados se guardan permanentemente, incluso si se apaga el servidor.
4.  **Acceso Remoto y Móvil (CORS)**: El servidor está configurado para aceptar conexiones desde dispositivos externos (móviles, otros PCs en la red), no solo desde `localhost`.

> **Nota:** Este proyecto está en desarrollo activo. Próximamente se añadirán funcionalidades como gestión de películas, reserva de butacas y panel de administración.

---

## Arquitectura y Funcionamiento Interno

El proyecto utiliza una arquitectura de **microservicios contenerizados**. Imagina el sistema como tres cajas independientes que trabajan juntas:

### 1. La Base de Datos (PostgreSQL)
Es la memoria del sistema. Se ejecuta en un contenedor aislado y utiliza un "Volumen de Docker" para guardar los datos en el disco duro real. Así, aunque reinicies Docker, los usuarios no se pierden.

### 2. El Backend (Spring Boot / Java)
Es el cerebro y el guardián de la seguridad.
* **Seguridad:** Utiliza un filtro de seguridad (Security Filter Chain). Cuando llega una petición, comprueba si tiene permiso.
* **CORS:** Hemos configurado el backend para que acepte peticiones (`Origin Patterns: *`) desde cualquier lugar, permitiendo que tu móvil o el PC de un amigo se conecten.
* **Compilación:** El código Java se compila en un archivo `.jar` antes de meterse en el contenedor Docker.

### 3. El Frontend (React / Vite)
Es la interfaz visual que ve el usuario.
* Se ejecuta sobre un servidor ligero (Node 22 Alpine).
* Se comunica con el Backend a través de peticiones HTTP (Fetch/Axios).
* **Configuración dinámica:** Utiliza un archivo `api.js` para saber a qué dirección IP debe enviar los datos del login.

---

## Guía de Instalación y Ejecución

Sigue estos pasos si eres nuevo en el proyecto y quieres arrancarlo desde cero.

### Requisitos Previos
* Tener **Docker Desktop** instalado y abierto.
* Tener **Java JDK 21** instalado.

### PASO 1: Configurar la IP (Para acceso desde móvil/externo)
Para que otros dispositivos puedan entrar, el frontend necesita saber tu IP.

1.  Abre el archivo `frontend/src/services/api.js`.
2.  Modifica la `baseURL` con tu IP local o pública:
    ```javascript
    // Si solo lo vas a usar tú en tu PC:
    const baseURL = 'http://localhost:8080';

    // Si quieres entrar desde el móvil o compartirlo con amigos:
    const baseURL = 'http://TU_IP_PUBLICA:8080'; 
    ```

### PASO 2: Generar el Ejecutable del Backend (.jar)
⚠️ **Importante:** Docker no compila el código Java automáticamente. Si haces cambios en el código del backend, debes ejecutar este paso antes de iniciar Docker.

1.  Abre una terminal en la carpeta `/backend`.
2.  Ejecuta el siguiente comando para crear el archivo `.jar` (saltando los tests para evitar errores de conexión):
    ```bash
    mvn clean package -DskipTests
    ```
    *(Si usas el wrapper incluido: `.\mvnw clean package -DskipTests`)*.
3.  Espera a ver el mensaje **BUILD SUCCESS**.

### PASO 3: Arrancar con Docker
1.  Ve a la carpeta raíz del proyecto (donde está el archivo `docker-compose.yml`).
2.  Ejecuta:
    ```bash
    docker-compose up --build
    ```
3.  Espera a que termine la descarga y configuración. Cuando veas los logs de colores y los iconos en verde en Docker Desktop, el sistema está listo.

### PASO 4: Acceder a la Web
* **Desde tu ordenador:** [http://localhost:5173](http://localhost:5173)
* **Desde otros dispositivos:** `http://TU_IP:5173`

---

## Solución de Problemas Comunes

### Error: "Network Error" o no hace nada al dar Login
* **Causa:** El frontend no encuentra al backend.
* **Solución:** Revisa que la IP en `api.js` sea correcta. Si accedes desde fuera, revisa que el **Firewall de Windows** tenga abiertos los puertos `8080` y `5173`.

### Error: "403 Forbidden" al registrarse
* **Causa:** El backend está bloqueando la conexión por seguridad (CORS).
* **Solución:** Probablemente el código Java ha cambiado pero Docker sigue usando una versión vieja. Repite el **PASO 2** (`mvn clean package`) y reinicia Docker.

### El contenedor "cine-frontend" se queda en gris/apagado
* **Causa:** Versión antigua de Node.js.
* **Solución:** Asegúrate de que en `frontend/Dockerfile` la primera línea sea `FROM node:22-alpine`.
