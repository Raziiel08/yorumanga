## 1. Esquema Relacional (10 Tablas)

### 1. `usuarios`
Perfiles de usuarios del sistema, vinculados directamente con el motor de autenticación `auth.users`.
* **`id` (UUID, PK):** Clave foránea referenciando `auth.users(id) ON DELETE CASCADE`.
* **`email` (VARCHAR(255), UNIQUE, NOT NULL):** Correo electrónico del usuario.
* **`nombre` (VARCHAR(100)):** Nombre completo.
* **`rol` (VARCHAR(20), NOT NULL, DEFAULT 'cliente'):** Restricción `CHECK (rol IN ('cliente','admin','vendedor','deposito'))`.
* **`creado_en` (TIMESTAMPTZ, DEFAULT NOW()):** Fecha de registro.
* **`actualizado_en` (TIMESTAMPTZ, DEFAULT NOW()):** Última modificación.

### 2. `productos`
Catálogo de tomos de manga y publicaciones físicas.
* **`id` (UUID, PK, DEFAULT uuid_generate_v4()):** Identificador único.
* **`titulo` (VARCHAR(255), NOT NULL):** Título del manga.
* **`imagen` (TEXT):** URL de la portada oficial.
* **`precio` (DECIMAL(10,2), NOT NULL, CHECK (precio >= 0)):** Precio unitario de venta.
* **`stock` (INTEGER, NOT NULL, DEFAULT 0, CHECK (stock >= 0)):** Cantidad física disponible.
* **`genero` (VARCHAR(100), NOT NULL):** Género (Shounen, Seinen, Shoujo, Spokon, Isekai, etc.).
* **`editorial` (VARCHAR(100)):** Editorial (Ivrea, Panini, Ovni Press, etc.).
* **`autor` (VARCHAR(150)):** Autor / Mangaka.
* **`descripcion` (TEXT):** Sinopsis y ficha técnica.
* **`precio_anterior` (DECIMAL(10,2)):** Precio previo para cálculo de ofertas.
* **`destacado` (BOOLEAN, DEFAULT FALSE):** Si se destaca en la portada de inicio.
* **`activo` (BOOLEAN, DEFAULT TRUE):** Control de borrado lógico para productos con historial de ventas.
* **`creado_en` / `actualizado_en` (TIMESTAMPTZ):** Marcas temporales.

### 3. `clientes`
Libreta de clientes frecuentes para la facturación en salón de ventas.
* **`id` (UUID, PK):** Identificador del cliente.
* **`usuario_id` (UUID, FK a usuarios.id):** Opcional, si el cliente posee cuenta registrada.
* **`nombre` (VARCHAR(150), NOT NULL):** Nombre y apellido.
* **`email` (VARCHAR(255)):** Correo electrónico con dominio válido.
* **`direccion` (TEXT):** Domicilio de entrega o facturación.
* **`creado_en` / `actualizado_en` (TIMESTAMPTZ).**

### 4. `proveedores`
Distribuidoras mayoristas y editoriales que suministran mercadería al depósito.
* **`id` (UUID, PK):** Identificador del proveedor.
* **`nombre` (VARCHAR(150), NOT NULL):** Nombre de la empresa o editorial.
* **`contacto` (VARCHAR(150)):** Asesor comercial de contacto.
* **`email` (VARCHAR(255)):** Correo de contacto.
* **`direccion` (TEXT):** Domicilio del depósito proveedor.
* **`creado_en` / `actualizado_en` (TIMESTAMPTZ).**

### 5. `pedidos`
Cabecera de las órdenes de compra realizadas por clientes desde la app móvil o e-commerce.
* **`id` (UUID, PK):** Identificador de la orden.
* **`usuario_id` (UUID, FK a usuarios.id, NOT NULL):** Cliente comprador.
* **`estado` (VARCHAR(20), NOT NULL, DEFAULT 'pendiente'):** `CHECK (estado IN ('pendiente','en_proceso','completado','cancelado'))`.
* **`total` (DECIMAL(10,2), NOT NULL, CHECK (total >= 0)):** Monto total de la orden.
* **`creado_en` / `actualizado_en` (TIMESTAMPTZ).**

### 6. `items_pedido`
Detalle de artículos incluidos en cada pedido online.
* **`id` (UUID, PK).**
* **`pedido_id` (UUID, FK a pedidos.id ON DELETE CASCADE, NOT NULL).**
* **`producto_id` (UUID, FK a productos.id, NOT NULL).**
* **`cantidad` (INTEGER, NOT NULL, CHECK (cantidad > 0)):** Cantidad reservada.
* **`precio` (DECIMAL(10,2), NOT NULL, CHECK (precio >= 0)):** Precio histórico congelado al momento de comprar.

### 7. `ventas`
Cabecera de ventas presenciales registradas por el vendedor en mostrador.
* **`id` (UUID, PK).**
* **`vendedor_id` (UUID, FK a usuarios.id, NOT NULL):** Vendedor que operó la terminal.
* **`cliente_id` (UUID, FK a clientes.id):** Cliente asociado o nulo (consumidor final).
* **`total` (DECIMAL(10,2), NOT NULL, CHECK (total >= 0)).**
* **`estado` (VARCHAR(20), NOT NULL, DEFAULT 'completada'):** `CHECK (estado IN ('completada','anulada'))`.
* **`creado_en` / `actualizado_en` (TIMESTAMPTZ).**

### 8. `items_venta`
Detalle de tomos vendidos en mostrador presencial.
* **`id` (UUID, PK).**
* **`venta_id` (UUID, FK a ventas.id ON DELETE CASCADE, NOT NULL).**
* **`producto_id` (UUID, FK a productos.id, NOT NULL).**
* **`cantidad` (INTEGER, NOT NULL, CHECK (cantidad > 0)).**
* **`precio` (DECIMAL(10,2), NOT NULL, CHECK (precio >= 0)):** Precio congelado al instante de la venta.

### 9. `movimientos_stock`
Libro de auditoría y trazabilidad de inventario.
* **`id` (UUID, PK).**
* **`producto_id` (UUID, FK a productos.id, NOT NULL).**
* **`usuario_id` (UUID, FK a usuarios.id):** Operador responsable del movimiento.
* **`tipo` (VARCHAR(20), NOT NULL):** `CHECK (tipo IN ('entrada','salida','ajuste'))`.
* **`cantidad` (INTEGER, NOT NULL, CHECK (cantidad > 0)).**
* **`motivo` (TEXT):** Justificación (ej. "Recepción Factura Ivrea", "Venta N°...", "Avería").
* **`creado_en` (TIMESTAMPTZ, DEFAULT NOW()).**

### 10. `solicitudes_manga`
Módulo de pedidos especiales para títulos que no se encuentran en stock.
* **`id` (UUID, PK).**
* **`usuario_id` (UUID, FK a usuarios.id, NOT NULL):** Cliente solicitante.
* **`titulo_solicitado` (VARCHAR(255), NOT NULL):** Nombre del manga solicitado.
* **`observaciones` (TEXT):** Tomo específico, editorial preferida, etc.
* **`estado` (VARCHAR(20), NOT NULL, DEFAULT 'pendiente'):** `CHECK (estado IN ('pendiente','visto','agregado'))`.
* **`creado_en` / `actualizado_en` (TIMESTAMPTZ).**

---

## 2. Procedimientos Almacenados Transaccionales (RPCs)

1. **`crear_venta(p_cliente_id UUID, p_items JSONB)`:**
   - Bloquea las filas de productos afectados (`FOR UPDATE`).
   - Verifica que cada ítem cuente con `stock >= cantidad`. Si falta una sola unidad, arroja excepción `RAISE EXCEPTION` y realiza Rollback total.
   - Inserta la cabecera en `ventas` e ítems en `items_venta`.
   - Descuenta el stock en `productos`.
   - Inserta automáticamente los movimientos en `movimientos_stock`.
2. **`crear_pedido(p_items JSONB)`:**
   - Valida stock y crea la orden online descontando las unidades para que no puedan ser sobrevendidas.
3. **`registrar_movimiento_stock(p_producto_id UUID, p_tipo TEXT, p_cantidad INTEGER, p_motivo TEXT)`:**
   - Suma o resta el stock de bodega y registra el evento con el usuario logueado (`auth.uid()`).
4. **`anular_venta(p_venta_id UUID)`:**
   - Anula una venta de mostrador y reintegra automáticamente las unidades al stock con su respectivo contra-movimiento de entrada.
5. **`handle_new_user()` (Trigger en `auth.users`):**
   - Disparador que crea el perfil en la tabla `usuarios` leyendo el rol seleccionado por el usuario en el registro (`NEW.raw_user_meta_data->>'rol'`).
6. **`asignar_mi_rol(p_rol TEXT)`:**
   - Función protegida para alternar de rol en modo de evaluación.

---

## 3. Seguridad (Row Level Security - RLS)

Todas las tablas poseen `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`:
- **`usuarios`:** Cada usuario solo puede ver su propio perfil; el Administrador puede listar y modificar roles.
- **`productos`:** Lectura pública de productos activos (`activo = true`); creación y edición reservada para personal del negocio (`admin`, `vendedor`, `deposito`).
- **`ventas` y `pedidos`:** Los clientes solo ven sus propios pedidos (`auth.uid() = usuario_id`). Vendedores y Administradores ven todas las operaciones.
