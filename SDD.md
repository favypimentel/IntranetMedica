# Software Design Document (SDD)
## Sistema de Intranet Médica

---

## 1. INTRODUCCIÓN

### 1.1 Propósito
Este documento describe el diseño técnico del Sistema de Intranet Médica, una plataforma web que permite a médicos acceder a cursos de actualización profesional, noticias del sector, y gestionar sus membresías mensuales.

### 1.2 Alcance
El sistema proporcionará funcionalidades para:
- Autenticación y gestión de usuarios médicos
- Catálogo y gestión de cursos
- Sistema de inscripción a cursos
- Publicación y visualización de noticias
- Gestión de membresías y procesamiento de pagos
- Panel de usuario personalizado

### 1.3 Definiciones y Acrónimos
- **SDD**: Software Design Document
- **API**: Application Programming Interface
- **REST**: Representational State Transfer
- **JWT**: JSON Web Token
- **CRUD**: Create, Read, Update, Delete
- **SPA**: Single Page Application
- **ORM**: Object-Relational Mapping
- **MVC**: Model-View-Controller

### 1.4 Referencias
- Business Development Document (BDD) v1.0
- Requisitos Funcionales del Sistema
- Estándares de Codificación del Equipo

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Visión General de la Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web App    │  │    Admin     │  │    Mobile    │  │
│  │   (React)    │  │    Panel     │  │  (Futuro)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS/REST API
                          │
┌─────────────────────────────────────────────────────────┐
│                  CAPA DE APLICACIÓN                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │            API REST Backend                       │  │
│  │         (Node.js/Express o Python/Django)        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Auth    │  │ Courses  │  │ Payment  │            │
│  │ Service  │  │ Service  │  │ Gateway  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────┘
                          │
                          │
┌─────────────────────────────────────────────────────────┐
│                  CAPA DE DATOS                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Redis     │  │  File Store  │  │
│  │   Database   │  │    Cache     │  │   (S3/CDN)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Patrón Arquitectónico
**Arquitectura de Tres Capas con Microservicios**

- **Capa de Presentación**: Frontend SPA (React/Vue.js)
- **Capa de Lógica de Negocio**: API REST con servicios modulares
- **Capa de Datos**: Base de datos relacional + Cache + Almacenamiento de archivos

### 2.3 Stack Tecnológico Propuesto

#### Frontend
- **Framework**: React 18+ con TypeScript
- **State Management**: Redux Toolkit / Zustand
- **Routing**: React Router v6
- **UI Library**: Material-UI / Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod / Yup

#### Backend
**Opción 1: Node.js**
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js / NestJS
- **Lenguaje**: TypeScript
- **ORM**: Prisma / TypeORM
- **Autenticación**: Passport.js + JWT

**Opción 2: Python**
- **Framework**: Django / FastAPI
- **Lenguaje**: Python 3.11+
- **ORM**: Django ORM / SQLAlchemy
- **Autenticación**: Django Auth / JWT

#### Base de Datos
- **Principal**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Búsqueda**: ElasticSearch (opcional, futuro)

#### Infraestructura
- **Hosting**: AWS / Azure / DigitalOcean
- **Contenedores**: Docker + Docker Compose
- **CI/CD**: GitHub Actions / GitLab CI
- **CDN**: CloudFront / Cloudflare
- **Almacenamiento**: AWS S3 / Azure Blob Storage

#### Servicios Externos
- **Pagos**: Stripe / PayPal / Mercado Pago
- **Email**: SendGrid / AWS SES
- **Monitoring**: Sentry / DataDog

---

## 3. DISEÑO DE BASE DE DATOS

### 3.1 Diagrama Entidad-Relación

```
┌─────────────────┐         ┌─────────────────┐
│     Users       │         │    Roles        │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄───────┤│ id (PK)         │
│ email           │         │ name            │
│ password_hash   │         │ description     │
│ first_name      │         │ created_at      │
│ last_name       │         └─────────────────┘
│ phone           │
│ role_id (FK)    │
│ is_active       │         ┌─────────────────┐
│ created_at      │         │    Doctors      │
│ updated_at      │         ├─────────────────┤
└─────────────────┘         │ id (PK)         │
         │                  │ user_id (FK)    │◄──┐
         │                  │ license_number  │   │
         │                  │ specialty       │   │
         │                  │ institution     │   │
         │                  │ verified        │   │
         │                  │ created_at      │   │
         │                  └─────────────────┘   │
         │                                        │
         │                  ┌─────────────────┐   │
         │                  │    Courses      │   │
         │                  ├─────────────────┤   │
         │                  │ id (PK)         │   │
         │                  │ title           │   │
         │                  │ description     │   │
         │                  │ category        │   │
         │                  │ duration_hours  │   │
         │                  │ instructor      │   │
         │                  │ thumbnail_url   │   │
         │                  │ is_active       │   │
         │                  │ created_at      │   │
         │                  │ updated_at      │   │
         │                  └─────────────────┘   │
         │                          │             │
         │                          │             │
         │                  ┌───────▼──────────┐  │
         └─────────────────►│   Enrollments   │  │
                            ├─────────────────┤  │
                            │ id (PK)         │  │
                            │ user_id (FK)    │──┘
                            │ course_id (FK)  │
                            │ enrollment_date │
                            │ status          │
                            │ progress        │
                            │ completed_at    │
                            └─────────────────┘


┌─────────────────┐         ┌─────────────────┐
│  Memberships    │         │    Payments     │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄───────┤│ id (PK)         │
│ user_id (FK)    │         │ membership_id(FK)│
│ plan_type       │         │ amount          │
│ status          │         │ currency        │
│ start_date      │         │ payment_method  │
│ end_date        │         │ transaction_id  │
│ auto_renew      │         │ status          │
│ created_at      │         │ paid_at         │
│ updated_at      │         │ created_at      │
└─────────────────┘         └─────────────────┘


┌─────────────────┐         ┌─────────────────┐
│      News       │         │  News_Images    │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄───────┤│ id (PK)         │
│ title           │         │ news_id (FK)    │
│ content         │         │ image_url       │
│ excerpt         │         │ caption         │
│ author_id (FK)  │         │ display_order   │
│ category        │         └─────────────────┘
│ published_at    │
│ is_published    │
│ views_count     │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### 3.2 Descripción de Tablas Principales

#### Tabla: users
Almacena información básica de todos los usuarios del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email del usuario |
| password_hash | VARCHAR(255) | NOT NULL | Contraseña encriptada |
| first_name | VARCHAR(100) | NOT NULL | Nombre |
| last_name | VARCHAR(100) | NOT NULL | Apellido |
| phone | VARCHAR(20) | NULL | Teléfono de contacto |
| role_id | INTEGER | FOREIGN KEY | Referencia a roles |
| is_active | BOOLEAN | DEFAULT TRUE | Estado del usuario |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

#### Tabla: doctors
Información específica de usuarios que son médicos.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| user_id | INTEGER | FOREIGN KEY, UNIQUE | Referencia a users |
| license_number | VARCHAR(50) | UNIQUE, NOT NULL | Número de colegiatura |
| specialty | VARCHAR(100) | NOT NULL | Especialidad médica |
| institution | VARCHAR(200) | NULL | Institución de trabajo |
| verified | BOOLEAN | DEFAULT FALSE | Estado de verificación |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de registro |

#### Tabla: courses
Catálogo de cursos disponibles.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| title | VARCHAR(255) | NOT NULL | Título del curso |
| description | TEXT | NOT NULL | Descripción completa |
| category | VARCHAR(100) | NOT NULL | Categoría del curso |
| duration_hours | INTEGER | NOT NULL | Duración en horas |
| instructor | VARCHAR(200) | NULL | Nombre del instructor |
| thumbnail_url | VARCHAR(500) | NULL | URL de imagen |
| is_active | BOOLEAN | DEFAULT TRUE | Curso activo |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

#### Tabla: enrollments
Inscripciones de usuarios a cursos.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| user_id | INTEGER | FOREIGN KEY | Referencia a users |
| course_id | INTEGER | FOREIGN KEY | Referencia a courses |
| enrollment_date | TIMESTAMP | DEFAULT NOW() | Fecha de inscripción |
| status | VARCHAR(50) | NOT NULL | enrolled, completed, cancelled |
| progress | INTEGER | DEFAULT 0 | Progreso 0-100% |
| completed_at | TIMESTAMP | NULL | Fecha de completado |

**CONSTRAINT**: UNIQUE(user_id, course_id)

#### Tabla: memberships
Membresías activas de usuarios.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| user_id | INTEGER | FOREIGN KEY, UNIQUE | Referencia a users |
| plan_type | VARCHAR(50) | NOT NULL | monthly, yearly |
| status | VARCHAR(50) | NOT NULL | active, cancelled, expired |
| start_date | DATE | NOT NULL | Fecha de inicio |
| end_date | DATE | NOT NULL | Fecha de fin |
| auto_renew | BOOLEAN | DEFAULT TRUE | Renovación automática |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

#### Tabla: payments
Historial de pagos realizados.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| membership_id | INTEGER | FOREIGN KEY | Referencia a memberships |
| amount | DECIMAL(10,2) | NOT NULL | Monto pagado |
| currency | VARCHAR(3) | DEFAULT 'USD' | Moneda |
| payment_method | VARCHAR(50) | NOT NULL | Método de pago |
| transaction_id | VARCHAR(255) | UNIQUE | ID de transacción externa |
| status | VARCHAR(50) | NOT NULL | pending, completed, failed |
| paid_at | TIMESTAMP | NULL | Fecha de pago |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

#### Tabla: news
Noticias publicadas en la plataforma.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| title | VARCHAR(255) | NOT NULL | Título de la noticia |
| content | TEXT | NOT NULL | Contenido completo |
| excerpt | VARCHAR(500) | NOT NULL | Resumen corto |
| author_id | INTEGER | FOREIGN KEY | Referencia a users |
| category | VARCHAR(100) | NOT NULL | Categoría de noticia |
| published_at | TIMESTAMP | NULL | Fecha de publicación |
| is_published | BOOLEAN | DEFAULT FALSE | Estado de publicación |
| views_count | INTEGER | DEFAULT 0 | Contador de vistas |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

---

## 4. DISEÑO DE API REST

### 4.1 Principios de Diseño
- **RESTful**: Recursos identificados por URLs, operaciones mediante métodos HTTP
- **Versionado**: API versionada (v1) en la URL
- **Formato**: JSON para requests y responses
- **Autenticación**: JWT Bearer tokens
- **Paginación**: Resultados paginados para listas grandes
- **Códigos HTTP**: Uso correcto de códigos de estado

### 4.2 Base URL
```
https://api.intranet-medica.com/api/v1
```

### 4.3 Autenticación

#### POST /auth/register
Registro de nuevo usuario médico.

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "SecurePass123!",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+34 600 123 456",
  "licenseNumber": "COL12345",
  "specialty": "Cardiología",
  "institution": "Hospital General"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "userId": 123,
    "email": "doctor@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Usuario registrado exitosamente"
}
```

#### POST /auth/login
Inicio de sesión.

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "SecurePass123!"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "userId": 123,
    "email": "doctor@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "doctor",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/refresh
Renovar token de acceso.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/logout
Cerrar sesión.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

### 4.4 Endpoints de Cursos

#### GET /courses
Obtener lista de cursos disponibles.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (int): Número de página (default: 1)
- `limit` (int): Elementos por página (default: 20)
- `category` (string): Filtrar por categoría
- `search` (string): Búsqueda por título/descripción

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "title": "Actualización en Cardiología 2026",
        "description": "Últimos avances en tratamientos cardiovasculares",
        "category": "Cardiología",
        "durationHours": 20,
        "instructor": "Dr. María González",
        "thumbnailUrl": "https://cdn.example.com/course1.jpg",
        "isActive": true,
        "createdAt": "2026-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 95,
      "itemsPerPage": 20
    }
  }
}
```

#### GET /courses/{courseId}
Obtener detalles de un curso específico.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Actualización en Cardiología 2026",
    "description": "Descripción completa del curso...",
    "category": "Cardiología",
    "durationHours": 20,
    "instructor": "Dr. María González",
    "thumbnailUrl": "https://cdn.example.com/course1.jpg",
    "syllabus": [
      {
        "module": 1,
        "title": "Introducción",
        "duration": "2 horas"
      }
    ],
    "isActive": true,
    "enrolledCount": 145,
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

#### POST /courses/{courseId}/enroll
Inscribirse a un curso.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "enrollmentId": 456,
    "courseId": 1,
    "userId": 123,
    "status": "enrolled",
    "enrollmentDate": "2026-09-16T14:30:00Z"
  },
  "message": "Inscripción exitosa al curso"
}
```

#### GET /users/me/enrollments
Obtener cursos inscritos del usuario actual.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (string): enrolled, completed, cancelled

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "enrollmentId": 456,
        "course": {
          "id": 1,
          "title": "Actualización en Cardiología 2026",
          "thumbnailUrl": "https://cdn.example.com/course1.jpg",
          "durationHours": 20
        },
        "status": "enrolled",
        "progress": 45,
        "enrollmentDate": "2026-09-16T14:30:00Z",
        "completedAt": null
      }
    ]
  }
}
```

### 4.5 Endpoints de Noticias

#### GET /news
Obtener lista de noticias publicadas.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (int): Número de página
- `limit` (int): Elementos por página
- `category` (string): Filtrar por categoría

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "news": [
      {
        "id": 1,
        "title": "Nuevos protocolos de tratamiento COVID-19",
        "excerpt": "La OMS ha actualizado sus recomendaciones...",
        "category": "Salud Pública",
        "author": {
          "id": 10,
          "name": "Dr. Carlos Martínez"
        },
        "publishedAt": "2026-09-15T08:00:00Z",
        "viewsCount": 1523,
        "thumbnailUrl": "https://cdn.example.com/news1.jpg"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 196,
      "itemsPerPage": 20
    }
  }
}
```

#### GET /news/{newsId}
Obtener detalles completos de una noticia.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Nuevos protocolos de tratamiento COVID-19",
    "content": "Contenido completo de la noticia en HTML...",
    "excerpt": "La OMS ha actualizado sus recomendaciones...",
    "category": "Salud Pública",
    "author": {
      "id": 10,
      "name": "Dr. Carlos Martínez",
      "specialty": "Infectología"
    },
    "publishedAt": "2026-09-15T08:00:00Z",
    "viewsCount": 1524,
    "images": [
      {
        "url": "https://cdn.example.com/news1-img1.jpg",
        "caption": "Imagen ilustrativa"
      }
    ]
  }
}
```

### 4.6 Endpoints de Membresías

#### GET /users/me/membership
Obtener información de membresía del usuario actual.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "membershipId": 789,
    "userId": 123,
    "planType": "monthly",
    "status": "active",
    "startDate": "2026-09-01",
    "endDate": "2026-10-01",
    "autoRenew": true,
    "daysRemaining": 15
  }
}
```

#### POST /memberships
Crear o renovar membresía.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "planType": "monthly",
  "autoRenew": true,
  "paymentMethodId": "pm_123456789"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "membershipId": 789,
    "status": "active",
    "startDate": "2026-09-16",
    "endDate": "2026-10-16",
    "payment": {
      "paymentId": 1001,
      "amount": 29.99,
      "currency": "USD",
      "status": "completed"
    }
  },
  "message": "Membresía activada exitosamente"
}
```

### 4.7 Endpoints de Pagos

#### GET /users/me/payments
Obtener historial de pagos del usuario.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (int): Número de página
- `limit` (int): Elementos por página
- `status` (string): pending, completed, failed

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": 1001,
        "membershipId": 789,
        "amount": 29.99,
        "currency": "USD",
        "paymentMethod": "credit_card",
        "transactionId": "txn_abc123456",
        "status": "completed",
        "paidAt": "2026-09-16T10:30:00Z",
        "createdAt": "2026-09-16T10:25:00Z"
      }
    ],
    "summary": {
      "totalPaid": 89.97,
      "pendingPayments": 0,
      "nextPaymentDue": "2026-10-16"
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 3
    }
  }
}
```

#### GET /users/me/payments/pending
Obtener pagos pendientes del usuario.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "pendingPayments": [
      {
        "id": 1002,
        "membershipId": 789,
        "amount": 29.99,
        "currency": "USD",
        "dueDate": "2026-10-16",
        "daysOverdue": 0,
        "status": "pending"
      }
    ],
    "totalPending": 29.99
  }
}
```

#### POST /payments/{paymentId}/process
Procesar un pago pendiente.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "paymentMethodId": "pm_123456789"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "paymentId": 1002,
    "status": "completed",
    "transactionId": "txn_xyz789012",
    "paidAt": "2026-09-16T14:45:00Z"
  },
  "message": "Pago procesado exitosamente"
}
```

### 4.8 Endpoints de Usuario

#### GET /users/me
Obtener perfil del usuario actual.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "doctor@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+34 600 123 456",
    "role": "doctor",
    "isActive": true,
    "doctor": {
      "licenseNumber": "COL12345",
      "specialty": "Cardiología",
      "institution": "Hospital General",
      "verified": true
    },
    "createdAt": "2026-01-10T12:00:00Z"
  }
}
```

#### PUT /users/me
Actualizar perfil del usuario.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "firstName": "Juan Carlos",
  "phone": "+34 600 999 888",
  "doctor": {
    "institution": "Hospital Universitario"
  }
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": 123,
    "firstName": "Juan Carlos",
    "phone": "+34 600 999 888",
    "doctor": {
      "institution": "Hospital Universitario"
    }
  },
  "message": "Perfil actualizado exitosamente"
}
```

### 4.9 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa (GET, PUT, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 204 | No Content | Operación exitosa sin contenido de respuesta |
| 400 | Bad Request | Error en la solicitud del cliente |
| 401 | Unauthorized | Autenticación requerida o inválida |
| 403 | Forbidden | No tiene permisos para el recurso |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto con estado actual (ej: usuario ya existe) |
| 422 | Unprocessable Entity | Error de validación de datos |
| 500 | Internal Server Error | Error del servidor |
| 503 | Service Unavailable | Servicio temporalmente no disponible |

### 4.10 Formato de Errores

**Estructura de Respuesta de Error:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email o contraseña incorrectos",
    "details": {
      "field": "email",
      "reason": "not_found"
    }
  },
  "timestamp": "2026-09-16T14:30:00Z"
}
```

**Códigos de Error Comunes:**
- `INVALID_CREDENTIALS`: Credenciales inválidas
- `VALIDATION_ERROR`: Error de validación de datos
- `RESOURCE_NOT_FOUND`: Recurso no encontrado
- `DUPLICATE_ENTRY`: Entrada duplicada
- `UNAUTHORIZED`: No autorizado
- `FORBIDDEN`: Prohibido
- `PAYMENT_FAILED`: Fallo en el pago
- `MEMBERSHIP_EXPIRED`: Membresía expirada
- `COURSE_FULL`: Curso lleno
- `ALREADY_ENROLLED`: Ya inscrito en el curso

---

## 5. COMPONENTES DEL SISTEMA

### 5.1 Módulo de Autenticación

**Responsabilidades:**
- Registro de usuarios
- Login/Logout
- Gestión de tokens JWT
- Recuperación de contraseña
- Verificación de email

**Componentes:**
- `AuthController`: Maneja requests HTTP
- `AuthService`: Lógica de negocio de autenticación
- `TokenService`: Generación y validación de JWT
- `PasswordService`: Hash y verificación de contraseñas
- `EmailVerificationService`: Envío de emails de verificación

**Flujo de Autenticación:**
```
Usuario → Login Request → AuthController
                                ↓
                         AuthService.authenticate()
                                ↓
                         Verificar credenciales en BD
                                ↓
                         TokenService.generateTokens()
                                ↓
                         Retornar tokens (access + refresh)
```

### 5.2 Módulo de Cursos

**Responsabilidades:**
- CRUD de cursos (Admin)
- Listado y búsqueda de cursos
- Inscripción a cursos
- Seguimiento de progreso
- Gestión de contenido del curso

**Componentes:**
- `CoursesController`: Endpoints de cursos
- `CoursesService`: Lógica de negocio
- `EnrollmentService`: Gestión de inscripciones
- `ProgressTracker`: Seguimiento de progreso

**Flujo de Inscripción:**
```
Usuario → POST /courses/{id}/enroll → CoursesController
                                            ↓
                                  Verificar membresía activa
                                            ↓
                                  Verificar no inscrito previamente
                                            ↓
                                  EnrollmentService.create()
                                            ↓
                                  Crear registro en BD
                                            ↓
                                  Enviar email de confirmación
                                            ↓
                                  Retornar enrollment data
```

### 5.3 Módulo de Noticias

**Responsabilidades:**
- CRUD de noticias (Admin/Editor)
- Publicación de noticias
- Listado y filtrado
- Contador de vistas
- Gestión de imágenes

**Componentes:**
- `NewsController`: Endpoints de noticias
- `NewsService`: Lógica de negocio
- `ImageUploadService`: Gestión de imágenes
- `ViewsTrackerService`: Contador de vistas

### 5.4 Módulo de Membresías

**Responsabilidades:**
- Creación y renovación de membresías
- Gestión de planes
- Validación de membresía activa
- Cancelación de membresías
- Notificaciones de expiración

**Componentes:**
- `MembershipController`: Endpoints de membresías
- `MembershipService`: Lógica de negocio
- `SubscriptionManager`: Gestión de suscripciones
- `ExpirationNotifier`: Notificaciones de vencimiento

**Estados de Membresía:**
- `active`: Membresía activa
- `cancelled`: Cancelada por el usuario
- `expired`: Expirada por falta de pago
- `suspended`: Suspendida por admin

### 5.5 Módulo de Pagos

**Responsabilidades:**
- Procesamiento de pagos
- Integración con pasarelas de pago
- Historial de transacciones
- Gestión de pagos pendientes
- Manejo de webhooks de pago

**Componentes:**
- `PaymentsController`: Endpoints de pagos
- `PaymentService`: Lógica de negocio
- `PaymentGateway`: Interfaz con pasarelas externas
- `WebhookHandler`: Procesamiento de webhooks
- `InvoiceGenerator`: Generación de facturas

**Flujo de Pago:**
```
Usuario → Iniciar pago → PaymentService.createPaymentIntent()
                                ↓
                    PaymentGateway.createCharge()
                                ↓
                    Pasarela externa (Stripe/PayPal)
                                ↓
                    Webhook de confirmación
                                ↓
                    WebhookHandler.process()
                                ↓
                    Actualizar estado de pago en BD
                                ↓
                    Actualizar membresía si corresponde
                                ↓
                    Enviar confirmación por email
```

---

## 6. SEGURIDAD

### 6.1 Autenticación y Autorización

#### JWT (JSON Web Tokens)
- **Access Token**: Duración de 15 minutos
- **Refresh Token**: Duración de 7 días
- **Algoritmo**: HS256 o RS256
- **Claims incluidos**:
  - `userId`: ID del usuario
  - `email`: Email del usuario
  - `role`: Rol del usuario (doctor, admin, editor)
  - `iat`: Issued at timestamp
  - `exp`: Expiration timestamp

#### Roles y Permisos
```
┌──────────────┬─────────┬─────────┬──────────┐
│   Recurso    │ Doctor  │ Editor  │  Admin   │
├──────────────┼─────────┼─────────┼──────────┤
│ Ver cursos   │    ✓    │    ✓    │    ✓     │
│ Inscribirse  │    ✓    │    ✓    │    ✓     │
│ Ver noticias │    ✓    │    ✓    │    ✓     │
│ Crear noticias│   ✗    │    ✓    │    ✓     │
│ Crear cursos │    ✗    │    ✗    │    ✓     │
│ Gestionar usuarios│ ✗  │    ✗    │    ✓     │
│ Ver estadísticas│  ✗   │    ✗    │    ✓     │
└──────────────┴─────────┴─────────┴──────────┘
```

### 6.2 Protección de Datos

#### Encriptación
- **En Tránsito**: TLS 1.3 (HTTPS obligatorio)
- **En Reposo**:
  - Contraseñas: bcrypt (cost factor 12)
  - Datos sensibles: AES-256-GCM
  - Tokens de pago: Tokenización mediante pasarela

#### Datos Personales (GDPR/LOPD)
- Almacenamiento mínimo necesario
- Derecho al olvido implementado
- Consentimiento explícito para marketing
- Logs de acceso a datos personales

### 6.3 Validación de Entrada

**Todas las entradas deben ser validadas:**
- Email: Formato válido, longitud máxima
- Contraseñas: 
  - Mínimo 8 caracteres
  - Al menos 1 mayúscula
  - Al menos 1 minúscula
  - Al menos 1 número
  - Al menos 1 carácter especial
- Teléfono: Formato internacional válido
- Campos de texto: Sanitización contra XSS
- IDs numéricos: Validar tipo y rango

### 6.4 Protección contra Ataques

#### Rate Limiting
```
- Login: 5 intentos / 15 minutos por IP
- API General: 100 requests / minuto por usuario
- Registro: 3 intentos / hora por IP
- Pagos: 10 intentos / hora por usuario
```

#### Prevención de Ataques
- **SQL Injection**: Uso de ORM con queries parametrizadas
- **XSS**: Sanitización de inputs, CSP headers
- **CSRF**: Tokens CSRF en formularios
- **Clickjacking**: X-Frame-Options: DENY
- **Brute Force**: Rate limiting, bloqueo temporal de cuentas

### 6.5 Headers de Seguridad

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 6.6 Logging y Auditoría

**Eventos a Registrar:**
- Intentos de login (exitosos y fallidos)
- Cambios en perfiles de usuario
- Creación/cancelación de membresías
- Transacciones de pago
- Acceso a datos sensibles
- Cambios administrativos

**Formato de Log:**
```json
{
  "timestamp": "2026-09-16T14:30:00Z",
  "level": "info",
  "event": "user_login",
  "userId": 123,
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": true,
  "metadata": {
    "loginMethod": "email"
  }
}
```

---

## 7. INTERFAZ DE USUARIO

### 7.1 Estructura de Páginas

#### Páginas Públicas
1. **Landing Page** (`/`)
   - Descripción de la plataforma
   - Call-to-action para registro
   - Beneficios de la membresía

2. **Login** (`/login`)
   - Formulario de email y contraseña
   - Enlace a recuperación de contraseña
   - Enlace a registro

3. **Registro** (`/register`)
   - Formulario de datos personales
   - Formulario de datos profesionales
   - Aceptación de términos y condiciones

#### Páginas Privadas (Requieren Autenticación)
4. **Dashboard** (`/dashboard`)
   - Resumen de cursos inscritos
   - Estado de membresía
   - Noticias destacadas
   - Accesos rápidos

5. **Catálogo de Cursos** (`/courses`)
   - Lista de cursos disponibles
   - Filtros por categoría
   - Búsqueda
   - Ordenamiento

6. **Detalle de Curso** (`/courses/:id`)
   - Información completa del curso
   - Botón de inscripción
   - Contenido del curso (si está inscrito)

7. **Mis Cursos** (`/my-courses`)
   - Lista de cursos inscritos
   - Progreso de cada curso
   - Acceso al contenido

8. **Noticias** (`/news`)
   - Lista de noticias publicadas
   - Filtros por categoría
   - Búsqueda

9. **Detalle de Noticia** (`/news/:id`)
   - Contenido completo de la noticia
   - Noticias relacionadas

10. **Membresía** (`/membership`)
    - Estado actual de membresía
    - Opciones de renovación
    - Historial de pagos
    - Pagos pendientes

11. **Perfil** (`/profile`)
    - Datos personales
    - Datos profesionales
    - Cambio de contraseña
    - Configuración de notificaciones

### 7.2 Componentes Principales

#### Componentes de Layout
- `Header`: Navegación principal, usuario, logout
- `Sidebar`: Menú lateral (responsive)
- `Footer`: Links legales, contacto
- `Breadcrumbs`: Navegación contextual

#### Componentes de UI
- `CourseCard`: Tarjeta de curso en lista
- `NewsCard`: Tarjeta de noticia
- `ProgressBar`: Barra de progreso de curso
- `PaymentStatusBadge`: Estado de pago
- `MembershipStatus`: Estado de membresía
- `Button`: Botón genérico con variantes
- `Input`: Campo de formulario
- `Select`: Selector dropdown
- `Modal`: Diálogo modal
- `Alert`: Notificaciones/alertas
- `Pagination`: Paginación de listas
- `LoadingSpinner`: Indicador de carga

### 7.3 Navegación

```
┌─────────────────────────────────────────────────┐
│  Header                                         │
│  [Logo] Dashboard | Cursos | Noticias | [User▼]│
└─────────────────────────────────────────────────┘
│                              │                  │
│  Sidebar                     │  Main Content    │
│  ┌──────────────┐           │                  │
│  │ Dashboard    │           │  [Content Area]  │
│  │ Mis Cursos   │           │                  │
│  │ Catálogo     │           │                  │
│  │ Noticias     │           │                  │
│  │ Membresía    │           │                  │
│  │ Perfil       │           │                  │
│  └──────────────┘           │                  │
│                              │                  │
└──────────────────────────────────────────────────┘
│  Footer                                         │
│  © 2026 | Términos | Privacidad | Contacto     │
└─────────────────────────────────────────────────┘
```

### 7.4 Diseño Responsive

#### Breakpoints
```css
/* Mobile */
@media (max-width: 767px) { ... }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }
```

#### Adaptaciones Mobile
- Menú hamburguesa en lugar de navegación completa
- Sidebar colapsable
- Cards en vista de lista vertical
- Formularios en una columna
- Tablas con scroll horizontal

### 7.5 Temas y Estilos

#### Paleta de Colores (Propuesta)
```css
:root {
  /* Primarios */
  --primary: #0066CC;      /* Azul médico */
  --primary-dark: #004C99;
  --primary-light: #3399FF;
  
  /* Secundarios */
  --secondary: #00A86B;    /* Verde */
  --accent: #FF6B35;       /* Naranja */
  
  /* Neutrales */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Estados */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Fondos */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;
}
```

#### Tipografía
```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-heading: 'Poppins', sans-serif;
  
  /* Tamaños */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

---

## 8. FLUJOS DE USUARIO PRINCIPALES

### 8.1 Flujo de Registro e Inscripción a Curso

```
[Inicio] → Usuario accede al sitio
              ↓
    [Landing Page] → Click en "Registrarse"
              ↓
    [Formulario de Registro]
        - Email, contraseña
        - Datos personales
        - Número de colegiatura
        - Especialidad
              ↓
    Enviar formulario → Backend valida datos
              ↓
    ¿Datos válidos? → No → Mostrar errores
              ↓ Sí
    Crear cuenta → Enviar email de verificación
              ↓
    [Verificar Email] (opcional)
              ↓
    Auto-login → Redirigir a /dashboard
              ↓
    [Dashboard] → Ver banner "Activa tu membresía"
              ↓
    Click en "Activar Membresía"
              ↓
    [Página de Membresía]
        - Seleccionar plan (mensual)
        - Ingresar método de pago
              ↓
    Procesar pago → ¿Pago exitoso?
              ↓ Sí
    Membresía activa → Redirigir a /courses
              ↓
    [Catálogo de Cursos]
        - Navegar cursos
        - Filtrar por categoría
              ↓
    Click en curso específico
              ↓
    [Detalle de Curso]
        - Ver información completa
        - Ver contenido/temario
              ↓
    Click en "Inscribirse"
              ↓
    Confirmar inscripción
              ↓
    [Inscripción Exitosa]
        - Mostrar confirmación
        - Enviar email de confirmación
              ↓
    Acceder al contenido del curso
              ↓
    [Fin]
```

### 8.2 Flujo de Login y Visualización de Progreso

```
[Inicio] → Usuario accede a /login
              ↓
    [Página de Login]
        - Ingresar email
        - Ingresar contraseña
              ↓
    Click en "Iniciar Sesión"
              ↓
    Backend valida credenciales
              ↓
    ¿Credenciales válidas? → No → Mostrar error
              ↓ Sí
    Generar JWT tokens
              ↓
    Redirigir a /dashboard
              ↓
    [Dashboard]
        - Ver cursos inscritos
        - Ver estado de membresía
        - Ver noticias recientes
              ↓
    Click en "Mis Cursos"
              ↓
    [Mis Cursos]
        - Lista de cursos inscritos
        - Progreso de cada curso
        - Filtrar por estado
              ↓
    Click en curso específico
              ↓
    [Contenido del Curso]
        - Ver módulos
        - Marcar como completado
        - Actualizar progreso
              ↓
    Sistema actualiza progreso en BD
              ↓
    [Fin]
```

### 8.3 Flujo de Renovación de Membresía

```
[Inicio] → Sistema detecta membresía próxima a vencer
              ↓
    Enviar email de recordatorio (7 días antes)
              ↓
    Usuario accede a /membership
              ↓
    [Página de Membresía]
        - Ver estado actual
        - Ver fecha de vencimiento
        - Ver pagos pendientes
              ↓
    ¿Hay pago pendiente? → Sí → Mostrar alerta
              ↓
    Click en "Renovar Membresía"
              ↓
    ¿Auto-renovación activa?
        ↓ Sí
        Sistema procesa pago automáticamente
        ↓ No
        Mostrar formulario de pago
        ↓
        Ingresar método de pago
        ↓
    Procesar pago
              ↓
    ¿Pago exitoso?
        ↓ No → Mostrar error, permitir reintentar
        ↓ Sí
    Actualizar membresía
        - Extender end_date
        - Crear registro de pago
        - Enviar factura por email
              ↓
    Mostrar confirmación
              ↓
    [Fin]
```

---

## 9. INTEGRACIÓN CON SERVICIOS EXTERNOS

### 9.1 Pasarela de Pagos (Stripe)

#### Configuración
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

#### Crear Payment Intent
```javascript
async function createPaymentIntent(amount, currency, userId) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convertir a centavos
    currency: currency,
    metadata: {
      userId: userId,
      type: 'membership_payment'
    }
  });
  
  return paymentIntent.client_secret;
}
```

#### Webhook Handler
```javascript
app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Manejar evento
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
  }
  
  res.json({ received: true });
});
```

### 9.2 Servicio de Email (SendGrid)

#### Configuración
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

#### Plantillas de Email
1. **Bienvenida**: Después del registro
2. **Verificación**: Confirmar email
3. **Confirmación de Inscripción**: Al inscribirse en curso
4. **Recordatorio de Pago**: 7 días antes del vencimiento
5. **Confirmación de Pago**: Después de pago exitoso
6. **Factura**: Adjuntar factura PDF
7. **Membresía Expirada**: Notificación de expiración
8. **Recuperación de Contraseña**: Token de reset

#### Ejemplo de Envío
```javascript
async function sendWelcomeEmail(user) {
  const msg = {
    to: user.email,
    from: 'noreply@intranet-medica.com',
    templateId: 'd-xxxxxxxxxxxxxx',
    dynamicTemplateData: {
      firstName: user.firstName,
      verificationUrl: `${process.env.FRONTEND_URL}/verify/${user.verificationToken}`
    }
  };
  
  await sgMail.send(msg);
}
```

### 9.3 Almacenamiento de Archivos (AWS S3)

#### Configuración
```javascript
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
```

#### Subir Archivo
```javascript
async function uploadFile(file, folder) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folder}/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  return result.Location; // URL pública
}
```

---

## 10. DESPLIEGUE Y DEVOPS

### 10.1 Entornos

#### Desarrollo (Development)
- **URL**: http://localhost:3000
- **Base de Datos**: PostgreSQL local
- **Objetivo**: Desarrollo local

#### Staging (Pre-producción)
- **URL**: https://staging.intranet-medica.com
- **Base de Datos**: PostgreSQL en cloud (instancia separada)
- **Objetivo**: Testing y QA

#### Producción (Production)
- **URL**: https://intranet-medica.com
- **Base de Datos**: PostgreSQL en cloud (cluster redundante)
- **Objetivo**: Usuarios finales

### 10.2 Containerización con Docker

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=intranet_medica
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 10.3 CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t intranet-medica:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          docker tag intranet-medica:${{ github.sha }} registry.example.com/intranet-medica:latest
          docker push registry.example.com/intranet-medica:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Comandos de despliegue (SSH, kubectl, etc.)
```

### 10.4 Monitoring y Logs

#### Herramientas
- **Application Monitoring**: Sentry, DataDog
- **Infrastructure Monitoring**: Prometheus + Grafana
- **Log Aggregation**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Uptime Monitoring**: UptimeRobot, Pingdom

#### Métricas Clave
- Tiempo de respuesta de API (p50, p95, p99)
- Tasa de errores (4xx, 5xx)
- Disponibilidad del sistema
- Uso de CPU/Memoria
- Conexiones a base de datos
- Tasa de transacciones de pago exitosas

### 10.5 Backups

#### Base de Datos
- **Frecuencia**: Diarios (automáticos)
- **Retención**: 30 días
- **Tipo**: Backups completos + incrementales
- **Ubicación**: S3 con versionado habilitado

#### Archivos
- **Frecuencia**: Diarios
- **Retención**: 30 días
- **Tipo**: Sincronización con S3 Glacier

#### Procedimiento de Restauración
1. Identificar backup a restaurar
2. Descargar desde S3
3. Restaurar en instancia de staging
4. Verificar integridad
5. Promover a producción si es necesario

---

## 11. TESTING

### 11.1 Estrategia de Testing

```
┌─────────────────────────────────────┐
│     Testing Pyramid                 │
│                                     │
│           /\      E2E Tests         │
│          /  \     (Cypress)         │
│         /────\                      │
│        /      \   Integration Tests │
│       / ────── \  (Jest + Supertest)│
│      /          \                   │
│     /────────────\ Unit Tests       │
│    /              \ (Jest)          │
└─────────────────────────────────────┘
```

### 11.2 Unit Tests

**Framework**: Jest

**Cobertura Objetivo**: 80%+

**Ejemplo - AuthService Test**
```javascript
describe('AuthService', () => {
  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'ValidPass123!'
      };
      
      const result = await authService.login(credentials);
      
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(credentials.email);
    });
    
    it('should throw error for invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword'
      };
      
      await expect(authService.login(credentials))
        .rejects
        .toThrow('Invalid credentials');
    });
  });
});
```

### 11.3 Integration Tests

**Framework**: Jest + Supertest

**Ejemplo - Courses API Test**
```javascript
describe('POST /api/v1/courses/:id/enroll', () => {
  let authToken;
  let courseId;
  
  beforeAll(async () => {
    // Setup: crear usuario y obtener token
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!'
      });
    
    authToken = response.body.data.token;
    
    // Crear curso de prueba
    const course = await createTestCourse();
    courseId = course.id;
  });
  
  it('should enroll user in course', async () => {
    const response = await request(app)
      .post(`/api/v1/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.courseId).toBe(courseId);
  });
  
  it('should return 401 without auth token', async () => {
    await request(app)
      .post(`/api/v1/courses/${courseId}/enroll`)
      .expect(401);
  });
});
```

### 11.4 E2E Tests

**Framework**: Cypress

**Ejemplo - Flujo de Inscripción**
```javascript
describe('Course Enrollment Flow', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'TestPass123!');
  });
  
  it('should allow user to enroll in a course', () => {
    // Navegar a catálogo
    cy.visit('/courses');
    
    // Buscar curso específico
    cy.get('[data-testid="course-search"]')
      .type('Cardiología');
    
    // Click en primer resultado
    cy.get('[data-testid="course-card"]')
      .first()
      .click();
    
    // Verificar que estamos en detalle del curso
    cy.url().should('include', '/courses/');
    
    // Click en botón de inscripción
    cy.get('[data-testid="enroll-button"]')
      .click();
    
    // Verificar confirmación
    cy.get('[data-testid="enrollment-success"]')
      .should('be.visible');
    
    // Verificar que aparece en "Mis Cursos"
    cy.visit('/my-courses');
    cy.contains('Cardiología').should('exist');
  });
});
```

### 11.5 Performance Testing

**Herramienta**: k6

**Ejemplo - Load Test**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function() {
  // Test login
  let loginRes = http.post('https://api.example.com/api/v1/auth/login', 
    JSON.stringify({
      email: 'test@example.com',
      password: 'TestPass123!'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login has token': (r) => r.json('data.token') !== '',
  });
  
  let token = loginRes.json('data.token');
  
  // Test get courses
  let coursesRes = http.get('https://api.example.com/api/v1/courses', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  check(coursesRes, {
    'courses status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}
```

---

## 12. MANTENIMIENTO Y EVOLUCIÓN

### 12.1 Versionado de API

**Estrategia**: URL-based versioning

```
/api/v1/courses  (versión actual)
/api/v2/courses  (futura versión)
```

**Política de Deprecación**:
1. Anunciar deprecación con 6 meses de anticipación
2. Mantener versión antigua funcionando por 12 meses
3. Proporcionar guía de migración detallada
4. Endpoint deprecado retorna header `X-API-Deprecated: true`

### 12.2 Gestión de Dependencias

**Herramientas**:
- **npm audit**: Escaneo de vulnerabilidades
- **Dependabot**: Actualizaciones automáticas
- **Snyk**: Monitoreo continuo de seguridad

**Proceso**:
1. Revisión semanal de dependencias desactualizadas
2. Actualización de parches de seguridad inmediata
3. Actualización de versiones menores mensualmente
4. Actualización de versiones mayores trimestralmente (con testing exhaustivo)

### 12.3 Documentación

**Tipos de Documentación**:
1. **Documentación Técnica** (este documento)
2. **Documentación de API** (Swagger/OpenAPI)
3. **Documentación de Usuario** (Guías, FAQs)
4. **Documentación de Deployment**
5. **Runbooks de Operaciones**

**Ubicación**:
- Código: Comentarios inline, JSDoc
- Repository: `/docs` folder
- API: Swagger UI en `/api/docs`
- Usuario: Wiki o sitio de ayuda separado

### 12.4 Roadmap Futuro

#### Fase 2 (Q4 2026)
- Sistema de evaluaciones y certificados
- Notificaciones push
- Chat en vivo para soporte
- Búsqueda avanzada con filtros múltiples

#### Fase 3 (Q1-Q2 2027)
- Aplicación móvil (iOS/Android)
- Videoconferencias integradas para cursos
- Foro de comunidad
- Sistema de gamificación (badges, rankings)

#### Fase 4 (Q3-Q4 2027)
- IA para recomendaciones personalizadas
- Integración con calendarios externos
- API pública para integraciones de terceros
- Marketplace de cursos externos

---

## 13. CONSIDERACIONES FINALES

### 13.1 Escalabilidad

**Estrategias**:
- Implementación de cache (Redis) para queries frecuentes
- CDN para assets estáticos
- Load balancing horizontal
- Database read replicas
- Optimización de queries con índices apropiados

**Puntos Críticos**:
- Inscripciones masivas a cursos populares
- Procesamiento simultáneo de pagos
- Generación de reportes pesados

### 13.2 Accesibilidad

**Cumplimiento**: WCAG 2.1 Level AA

**Implementación**:
- Uso apropiado de etiquetas semánticas HTML
- Contraste de color adecuado (mínimo 4.5:1)
- Soporte para navegación por teclado
- Textos alternativos para imágenes
- ARIA labels donde sea necesario
- Transcripciones para contenido de video

### 13.3 Internacionalización (i18n)

**Fase Inicial**: Solo español

**Futuro**:
- Soporte para inglés, portugués
- Traducción de interfaz
- Localización de formatos de fecha/hora
- Soporte para múltiples monedas

---

## APÉNDICES

### A. Glosario

- **Membresía**: Suscripción mensual que otorga acceso a la plataforma
- **Inscripción**: Acción de registrarse en un curso específico
- **Progreso**: Porcentaje de completado de un curso (0-100%)
- **Colegiatura**: Número de licencia profesional médica
- **Especialidad**: Área de especialización médica del doctor

### B. Referencias

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- RESTful API Design: https://restfulapi.net/
- JWT Best Practices: https://tools.ietf.org/html/rfc8725
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/

### C. Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2026-09-16 | Equipo de Desarrollo | Versión inicial del SDD |

---

**Documento preparado por**: Equipo de Desarrollo  
**Fecha**: 16 de Septiembre, 2026  
**Versión**: 1.0  
**Estado**: Borrador para Revisión
