# 🎮 PokeAPI Teams

API REST para gestionar equipos de Pokémon, construida con Node.js, Express y SQLite. Integra la [PokéAPI](https://pokeapi.co/) para obtener información detallada de cada Pokémon.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Testing con Thunder Client](#testing-con-thunder-client)
- [Testing con Jest](#testing-con-jest)

## Características

- ✅ Crear equipos de Pokémon
- ✅ Consultar equipos con información enriquecida de PokéAPI
- ✅ Actualizar equipos existentes
- ✅ Eliminar equipos
- ✅ Paginación en listado de equipos
- ✅ Integración con PokéAPI para datos detallados
- ✅ Base de datos SQLite
- ✅ Validación de datos con express-validator

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **SQLite** (better-sqlite3) - Base de datos
- **Axios** - Cliente HTTP para PokéAPI
- **Express Validator** - Validación de datos
- **Helmet** - Seguridad HTTP
- **Express Rate Limit** - Limitación de peticiones

## 📦 Instalación

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn

### Pasos

1. Clona el repositorio:
```bash
git clone <url-repositorio>
cd pokeAPI
```

2. Instala las dependencias:
```bash
cd api
npm install
```

3. Inicia el servidor:
```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## ⚙️ Configuración

El servidor funciona con configuración por defecto, no requiere variables de entorno.

### Configuración Predeterminada

- **Puerto**: `3000`
- **Base de datos**: `./pokemon.db` (se crea automáticamente)
- **PokéAPI**: `https://pokeapi.co/api/v2`

Si deseas cambiar el puerto, puedes usar la variable de entorno `PORT`:

```bash
PORT=4000 npm start
```

### Base de Datos

La base de datos SQLite se crea automáticamente al iniciar la aplicación. Estructura de la tabla `teams`:

```sql
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    members TEXT NOT NULL
);
```

## 🚀 Uso

### Ejemplo rápido

```javascript
// Crear un equipo
POST http://localhost:3000/teams
Content-Type: application/json

{
  "name": "Mi Equipo Inicial",
  "members": ["pikachu", "charizard", "blastoise"]
}

// Respuesta
{
  "id": 1,
  "name": "Mi Equipo Inicial",
  "members": ["pikachu", "charizard", "blastoise"]
}
```

## 📡 Endpoints

**Base URL:** `http://localhost:3000/teams`

### 1. Crear Equipo

**POST** `/teams`

Crea un nuevo equipo de Pokémon.

**Request Body:**
```json
{
  "name": "Equipo Fuego",
  "members": ["charizard", "arcanine", "flareon"]
}
```

**Validaciones:**
- `name`: Requerido, string, mínimo 3 caracteres
- `members`: Requerido, array de strings, mínimo 1 Pokémon, máximo 6

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Equipo Fuego",
  "members": ["charizard", "arcanine", "flareon"]
}
```

---

### 2. Obtener Todos los Equipos

**GET** `/teams?page=1&limit=10`

Lista todos los equipos con paginación.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 10)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "name": "Equipo Fuego",
      "members": ["charizard", "arcanine", "flareon"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3. Obtener Equipo por ID

**GET** `/teams/:id`

Obtiene un equipo específico con información detallada de cada Pokémon desde PokéAPI.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Equipo Fuego",
  "members": [
    {
      "name": "charizard",
      "sprites": {
        "front_default": "https://raw.githubusercontent.com/..."
      },
      "types": [
        {
          "type": {
            "name": "fire"
          }
        }
      ],
      "stats": [
        {
          "base_stat": 78,
          "stat": {
            "name": "hp"
          }
        }
      ]
    }
  ]
}
```

**Errores:**
- `404 Not Found`: Equipo no encontrado

---

### 4. Actualizar Equipo

Soporta dos métodos HTTP:

**PATCH** `/teams/:id` - Actualización parcial

**PUT** `/teams/:id` - Reemplazo completo

**Request Body:**
```json
{
  "name": "Equipo Actualizado",
  "members": ["pikachu", "raichu", "mewtwo"]
}
```

**Validaciones:**
- `name`: Requerido, string, mínimo 3 caracteres
- `members`: Requerido, array de strings, mínimo 1 Pokémon, máximo 6

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Equipo Actualizado",
  "members": ["pikachu", "raichu", "mewtwo"]
}
```

**Errores:**
- `404 Not Found`: Equipo no encontrado

---

### 5. Eliminar Equipo

**DELETE** `/teams/:id`

Elimina un equipo.

**Response:** `204 No Content`

**Errores:**
- `404 Not Found`: Equipo no encontrado

---

## 📁 Estructura del Proyecto

```
pokeAPI/
├── api/
│   ├── controllers/
│   │   └── teamController.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── teamModel.js
│   ├── routes/
│   │   └── teamRoutes.js
│   ├── .env.example
│   ├── app.js
│   └── server.js
├── README.md
└── package.json
```

- **`controllers/`**: Lógica de negocio y manejo de solicitudes.
- **`middlewares/`**: Funciones middleware, como manejo de errores.
- **`models/`**: Definición del modelo de datos y esquema de la base de datos.
- **`routes/`**: Definición de las rutas de la API.

## 🧪 Testing con Thunder Client

### Importar Colección

1. Instala la extensión **Thunder Client** en VS Code
2. Abre Thunder Client (icono del rayo en la barra lateral)
3. Click en el menú (⋮) → **Import**
4. Selecciona el archivo `thunder-collection.json`
5. ¡Listo! Tendrás todos los endpoints configurados

### Colección Incluye

- ✅ **Create Team** - POST para crear equipo
- ✅ **Get All Teams** - GET con paginación
- ✅ **Get Team by ID** - GET con datos enriquecidos de PokéAPI
- ✅ **Update Team (PATCH)** - Actualización parcial
- ✅ **Replace Team (PUT)** - Reemplazo completo
- ✅ **Delete Team** - DELETE para eliminar

## 🧪 Testing con Jest

### Ejecutar Tests

```bash
npm test
```

### Cobertura de Tests

- ✅ **POST /teams** - Crear equipo exitosamente
- ✅ **POST /teams** - Validación (máximo 6 Pokémon)
- ✅ **GET /teams** - Listar con paginación
- ✅ **GET /teams/:id** - Obtener con datos enriquecidos de PokéAPI
- ✅ **GET /teams/:id** - Error 404 si no existe
- ✅ **PATCH /teams/:id** - Actualización parcial del equipo
- ✅ **PUT /teams/:id** - Reemplazo completo del equipo

## 👨‍💻 Desarrollo

¡Listo! Ahora tienes toda la información para utilizar y contribuir a PokeAPI Teams.

### Actualizar equipo parcialmente (PATCH)

```bash
curl -X PATCH http://localhost:3000/teams/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Equipo Modificado",
    "members": ["pikachu"]
  }'
```

### Reemplazar equipo completamente (PUT)

```bash
curl -X PUT http://localhost:3000/teams/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Equipo Nuevo",
    "members": ["charizard", "blastoise", "venusaur"]
  }'
```