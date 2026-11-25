# Proyecto Integrador — YORUMANGA

**Escuela de Educación Secundaria Técnica N°1 de Esteban Echeverría**  
**Materia:** Aplicaciones Móviles | **Profesor:** Pablo Gareis | **Curso:** 7° 3°  
**Integrantes:** Agustín Hermida y Elías González  
**Repositorio GitHub:** [https://github.com/Raziiel08/yorumanga](https://github.com/Raziiel08/yorumanga) (Ramas: `main`, `Documentacion`, `Marketing`)

---

## 1. Empresa Ficticia
- **Nombre:** YORUMANGA
- **Logo:** `src/assets/yorumanga-logo.png`
- **Rubro:** Comercio minorista y e-commerce de mangas japoneses, novelas ligeras y merchandising coleccionable.
- **Productos / Servicios:** Catálogo físico categorizado por géneros (Shounen, Seinen, Shojo, Spokon, etc.), Novedades y Ofertas; venta presencial de salón en mostrador; pedidos online con reserva de existencias; pedidos especiales de mangas no disponibles; cafetería temática de lectura.
- **Público Objetivo:** Jóvenes, adultos y coleccionistas aficionados al cómic japonés.
- **Organización Básica:**
  - **Administrador:** Gestión integral de catálogo, precios, pedidos web, reportes y roles del personal.
  - **Vendedor:** Cobro y liquidación de ventas en mostrador (POS), altas de clientes con correo obligatorio.
  - **Encargado de Depósito:** Control de existencias, auditoría de entradas/salidas y libreta de proveedores.
  - **Cliente:** Consulta de catálogo interactivo, reservas por carrito, pedidos y recomendaciones con IA.

---

## 2. Problemática Actual de la Empresa
Antes de la implementación del sistema, la comiquería gestionaba sus operaciones mediante planillas de cálculo de Excel desarticuladas y anotaciones manuales en papel. Esto provocaba:
- Desfasajes críticos de stock (sobreventas y quiebres de inventario al vender el mismo tomo físico por internet y en el salón).
- Falta total de auditoría y trazabilidad en los ingresos de mercadería de editoriales (Ivrea, Panini, Ovni Press).
- Ausencia de roles o permisos de seguridad: cualquier empleado podía alterar precios o registros históricos.
- Dificultad para elaborar balances de venta y proyecciones de compras.

---

## 3. Solución Propuesta y Alcance
Desarrollo de un sistema multiplataforma (móvil y web) en **React Native con Expo** conectado al backend en la nube **Supabase (PostgreSQL + Auth + RLS + RPCs)**.

### Alcance (Qué SÍ realiza el sistema):
- Autenticación segura mediante JWT con selección y control de 4 roles (`cliente`, `vendedor`, `deposito`, `admin`).
- Catálogo virtual inmersivo con filtros por género, Novedades ✨, Ofertas 🏷️ y ocultamiento de cabecera al scrollear.
- Carrito de compras y emisión de pedidos online con reserva atómica de existencias.
- Punto de venta de mostrador (POS) con cálculo automático y descuento transaccional en servidor.
- Formularios con validaciones estrictas: campos 100% obligatorios en Proveedores y Clientes, contraseñas de al menos 6 caracteres y correos limitados a dominios populares (@gmail.com, @hotmail.com, etc.).
- Movimientos de depósito con registro inmutable de entradas y salidas.
- Módulo de Inteligencia Artificial para recomendación de títulos y generación de reportes estratégicos para administración.

### Alcance (Qué NO realiza en esta etapa inicial):
- Facturación fiscal electrónica directa con la AFIP.
- Pasarela bancaria de captura de tarjetas en vivo: el checkout es una demostración de experiencia de usuario (1, 3 o 6 cuotas sin interés) que crea el pedido en Supabase, pero no debita dinero ni contacta a un banco. El cobro real se registra como efectivo, transferencia o venta en mostrador.

---

## 4. Requisitos Funcionales y No Funcionales

### Requisitos Funcionales:
* **RF01:** El sistema deberá permitir iniciar sesión con correo y contraseña.
* **RF02:** El sistema deberá permitir registrar nuevos usuarios. El registro público crea perfiles de `cliente`; los roles operativos (`vendedor`, `deposito`, `admin`) son asignados por la administración. **Pendiente:** retirar el selector público de roles y restringir la RPC `asignar_mi_rol` (deuda de seguridad del informe de testing).
* **RF03:** El sistema deberá permitir al Administrador gestionar productos (CRUD completo).
* **RF04:** El sistema deberá mostrar el catálogo de títulos activos con filtros por género y Novedades.
* **RF05:** El sistema deberá permitir agregar tomos al carrito respetando el stock disponible.
* **RF06:** El sistema deberá confirmar pedidos web descontando stock de forma atómica en el servidor.
* **RF07:** El sistema deberá registrar ventas en mostrador descontando stock en tiempo real.
* **RF08:** El sistema deberá actualizar automáticamente el inventario mediante transacciones SQL (`crear_venta`, `crear_pedido`).
* **RF09:** El sistema deberá registrar movimientos de inventario con responsable, tipo (entrada/salida) y motivo.
* **RF10:** El sistema deberá gestionar clientes y proveedores con validación de campos obligatorios y correo electrónico.
* **RF11:** El sistema deberá permitir a los clientes solicitar títulos no disponibles.
* **RF12:** El sistema deberá generar reportes analíticos para la gerencia con Inteligencia Artificial.
* **RF13:** El sistema deberá recomendar lecturas temáticas con IA garantizando stock activo en tienda.
* **RF14:** El sistema deberá segregar las pantallas y menús según el rol autenticado.

### Requisitos No Funcionales:
* **Seguridad:** Contraseñas protegidas mediante hash criptográfico y tokens JWT por Supabase Auth.
* **Acceso y Rendimiento:** Multiplataforma para celulares (Android/iOS) y terminales web de escritorio. Tiempos de respuesta menores a 1.8 segundos.
* **Integridad de Datos:** Políticas de Row Level Security (RLS) en todas las tablas y restricciones `CHECK (stock >= 0)`.

---

## 5. Historias de Usuario
- *Como cliente*, quiero navegar el catálogo por géneros para encontrar lecturas de mi preferencia.
- *Como cliente*, quiero recibir recomendaciones de Inteligencia Artificial para descubrir nuevos tomos en stock.
- *Como cliente*, quiero reservar mangas desde el carrito para asegurar mi compra antes de que se agoten.
- *Como vendedor*, quiero registrar ventas en mostrador rápidamente para que el stock se descuente en el acto.
- *Como vendedor*, quiero dar de alta clientes con sus datos de contacto completos para la entrega.
- *Como encargado de depósito*, quiero asentar los ingresos de mercadería de proveedores para mantener el inventario al día.
- *Como administrador*, quiero consultar reportes generados con IA para planificar las compras a distribuidoras.
- *Como administrador*, quiero supervisar los usuarios y ajustar roles de acceso al personal.

---

## 6. Reglas de Negocio
1. **Sin stock negativo:** Ninguna venta o pedido puede superar el stock físico disponible en bodega (`CHECK (stock >= 0)`).
2. **Inmutabilidad histórica:** El precio del tomo se congela en `items_venta` e `items_pedido` en el momento de la operación.
3. **Borrado lógico:** Un producto que registre operaciones históricas no puede borrarse físicamente de la base de datos (se desactiva con `activo = false`).
4. **Validación de correos:** Solo se aceptan correos terminados en `.com` o `.com.ar` de dominios reconocidos.
5. **Completitud de datos:** Los proveedores y clientes deben registrar obligatoriamente nombre, contacto, correo y dirección.
6. **Pago simulado:** El checkout de la app es una demostración visual: valida formatos, ofrece 1, 3 o 6 cuotas sin interés y emite un comprobante interno. No procesa pagos, no dispone de SSL propio ni realiza verificaciones criptográficas.
