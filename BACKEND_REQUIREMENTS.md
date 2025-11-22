
# Requerimientos de Backend - Pizzería San Marzano

Este documento describe la arquitectura de backend necesaria para soportar la aplicación Web.

## 1. Stack Tecnológico Recomendado
*   **Base de Datos:** PostgreSQL.
*   **Servidor:** Node.js (Express/Fastify) o Serverless Functions.

## 2. Esquema de Base de Datos (SQL)

```sql
-- Clientes
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction TIMESTAMP WITH TIME ZONE
);

-- Ordenes
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivery', 'delivered', 'cancelled');

CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  status order_status DEFAULT 'confirmed',
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL, -- Array de items Snapshot
  eta VARCHAR(50), -- Tiempo estimado texto (ej: "30 min")
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. API Endpoints Requeridos

### Gestión de Pedidos (Web App)
La aplicación web (`services/orderService.ts`) espera consumir estos endpoints:

1.  **Crear Pedido**
    *   `POST /api/orders`
    *   Body: `{ items: [], customer: {} }`
    *   Acción: Crear registro en DB y retornar ID de orden.

## 4. Integración Frontend

Para conectar la App Web actual con este Backend real:

1.  Ir a `services/orderService.ts`.
2.  Descomentar `API_URL`.
3.  Reemplazar los `setTimeout` y el Mock LocalStorage con llamadas `fetch()` o `axios`.
