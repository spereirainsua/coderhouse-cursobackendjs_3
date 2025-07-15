# 🐾 API de Adopciones de Mascotas

Este proyecto es una API RESTful desarrollada con Node.js y Express para la gestión de adopciones de mascotas. Forma parte del curso de Backend en JavaScript de Coderhouse.

Incluye soporte para autenticación, manejo de usuarios, mascotas y adopciones, así como documentación Swagger.

---

## 🐳 Link al repositorio DockerHub

[Ver en Docker Hub](https://hub.docker.com/repository/docker/spereira17/adoptme-coderhouse-bk3)

## 📁 Estructura del Proyecto

```plaintext
src/
├── app.js # Configuración principal de la app
├── controllers/ # Lógica de controladores para cada recurso
├── dao/ # Acceso a datos y modelos Mongoose
│ └── models/ # Esquemas Mongoose para User, Pet y Adoption
├── dto/ # Data Transfer Objects para sanitización de datos
├── middlewares/ # Middlewares personalizados
├── routes/ # Definición de rutas de la API
├── services/ # Lógica de negocio por recurso
├── utils/ # Utilidades varias (logger, helpers, etc.)
├── docs/ # Documentación Swagger (YAML)
├── logs/ # Archivos de logs
```
## 🛠️ Instalación

```bash
git clone https://github.com/spereirainsua/coderhouse-cursobackendjs_3.git
cd coderhouse-cursobackendjs_3
npm install
```
## ✅ Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- Swagger (YAML)
- JWT (autenticación)
- DTO pattern
- Logger con Winston o similar

## 🧑‍💻 Autor
Desarrollado por Santiago Pereira como parte del curso de Backend JS - Coderhouse.


## 📄 Licencia

Este proyecto está bajo la licencia MIT.
