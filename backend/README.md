# Backend - Sistema de Intranet Médica

API REST para la plataforma de intranet médica que permite a médicos acceder a cursos de actualización, noticias y gestionar sus membresías.

## 🚀 Tecnologías

- **Node.js** 18+
- **TypeScript** 5.3+
- **Express** 4.18+
- **PostgreSQL** 14+
- **Sequelize** ORM
- **Redis** para caché
- **JWT** para autenticación
- **Stripe** para pagos
- **SendGrid** para emails

## 📋 Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- Redis 7 o superior
- npm o yarn

## 🔧 Instalación

1. Instalar dependencias:
```powershell
cd backend
npm install
```

2. Configurar variables de entorno:
```powershell
Copy-Item .env.example .env
# Editar .env con tus credenciales
```

3. Crear base de datos:
```sql
CREATE DATABASE intranet_medica;
```

4. Ejecutar migraciones (los modelos se sincronizan automáticamente en desarrollo):
```powershell
npm run dev
```

## 🎯 Scripts Disponibles

- `npm run dev` - Iniciar servidor en modo desarrollo con hot-reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Iniciar servidor en producción
- `npm test` - Ejecutar tests
- `npm run lint` - Ejecutar linter
- `npm run lint:fix` - Corregir errores de linting

## 📚 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, Redis, etc.)
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middlewares personalizados
│   ├── models/          # Modelos de Sequelize
│   ├── routes/          # Definición de rutas
│   ├── utils/           # Utilidades y helpers
│   └── server.ts        # Punto de entrada
├── logs/                # Archivos de log
├── .env.example         # Variables de entorno ejemplo
├── package.json
└── tsconfig.json
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación.

### Obtener Token:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "password123"
}
```

### Usar Token:

```http
GET /api/v1/courses
Authorization: Bearer {tu_token_aqui}
```

## 📖 Endpoints Principales

### Autenticación
- `POST /api/v1/auth/register` - Registro de nuevo médico
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Cerrar sesión
- `GET /api/v1/auth/me` - Obtener usuario actual

### Cursos
- `GET /api/v1/courses` - Lista de cursos (con paginación y filtros)
- `GET /api/v1/courses/:id` - Detalles de un curso
- `POST /api/v1/courses/:id/enroll` - Inscribirse a un curso
- `GET /api/v1/courses/me/enrollments` - Mis cursos inscritos
- `PUT /api/v1/courses/enrollments/:id/progress` - Actualizar progreso

### Noticias
- `GET /api/v1/news` - Lista de noticias
- `GET /api/v1/news/:id` - Detalles de una noticia

### Membresías
- `GET /api/v1/memberships/me` - Mi membresía actual
- `POST /api/v1/memberships` - Crear/renovar membresía

### Pagos
- `GET /api/v1/payments/me` - Historial de pagos
- `GET /api/v1/payments/me/pending` - Pagos pendientes

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (factor 12)
- Rate limiting en endpoints críticos
- CORS configurado
- Helmet para headers de seguridad
- Validación de inputs con express-validator
- JWT con expiración corta (15 min) y refresh tokens (7 días)

## 🧪 Testing

```powershell
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm test -- --coverage

# Tests en modo watch
npm run test:watch
```

## 🚀 Despliegue

### Desarrollo
```powershell
npm run dev
```

### Producción
```powershell
npm run build
npm start
```

### Docker
```powershell
docker-compose up -d
```

## 📝 Variables de Entorno

Ver `.env.example` para la lista completa de variables requeridas.

Variables críticas:
- `JWT_SECRET` - Secret para JWT tokens
- `DATABASE_URL` o credenciales de DB individuales
- `REDIS_URL` o configuración de Redis
- `STRIPE_SECRET_KEY` - Para procesamiento de pagos
- `SENDGRID_API_KEY` - Para envío de emails

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos existe

### Error de conexión a Redis
- Verificar que Redis esté corriendo
- Verificar configuración de Redis en `.env`

### Error de JWT inválido
- Verificar que `JWT_SECRET` esté configurado
- Verificar que el token no haya expirado

## 📄 Licencia

MIT

## 👥 Contribuir

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request
