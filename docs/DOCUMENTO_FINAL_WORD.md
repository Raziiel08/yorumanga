# YORUMANGA — Documento integral del Proyecto Integrador

**Escuela:** E.E.S.T N°1 de Esteban Echeverría  
**Tecnicatura:** Informática Personal y Profesional  
**Materia:** Aplicaciones Móviles | **Profesor:** Pablo Gareis | **Curso:** 7° 3°  
**Alumnos:** Agustín Hermida y Elías González  
**Versión:** 1.0 — Noviembre 2026

> Versión en Markdown del documento integral para Word. Se organiza en las **diez secciones exigidas** y referencia los documentos de detalle dentro de `docs/`. La matriz de pruebas **no se reproduce aquí**: su única fuente de verdad es [`PRUEBAS.md`](PRUEBAS.md).

---

## 1. Introducción

YORUMANGA es una aplicación multiplataforma para la gestión integral de una librería especializada en mangas físicos. Cubre la venta online y en mostrador, el control de inventario, la administración de clientes y proveedores y la asistencia mediante Inteligencia Artificial.

**Propósito:** reemplazar el registro manual por un sistema único que evite la sobreventa, centralice el stock y apoye las decisiones de compra con datos reales.

**Alcance actual:** autenticación, catálogo con filtros, carrito con reserva atómica de stock, POS de mostrador, depósito y proveedores, solicitudes especiales, recomendador IA y generación de informes. El checkout es una **demostración de experiencia de pago**: valida datos y emite un comprobante interno, pero **no hay pasarela bancaria real, ni cobro, ni cifrado SSL propio**.

**Fuera de alcance:** facturación fiscal electrónica ante AFIP y débito real de fondos.

---

## 2. Descripción del sistema

**Stakeholders:** clientes lectores, vendedor de mostrador, encargado de depósito y administrador.

**Funciones principales:**

| Módulo | Responsabilidad |
|:---|:---|
| Usuarios y seguridad | Acceso por correo y contraseña; perfiles por rol |
| Catálogo | Búsqueda, filtros por género, novedades y ofertas |
| Carrito y checkout | Reserva de stock y comprobante de demostración |
| Ventas | Registro transaccional en mostrador |
| Depósito | Entradas, salidas y auditoría de movimientos |
| IA | Recomendaciones con stock real e informes para gerencia |

**Restricciones generales:** conexión a Internet, contraseñas de al menos 6 caracteres, dominios de correo reconocidos y stock nunca negativo.

---

## 3. Arquitectura del sistema

- **Cliente:** Expo / React Native, con navegación por pila y pestañas según el rol.
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Row Level Security).
- **Lógica transaccional:** RPC en PostgreSQL (`crear_pedido`, `crear_venta`, movimientos de stock).
- **IA:** Edge Function `ai`. El punto de entrada es `index.js`; toda la lógica está en `logica.js` en JavaScript puro. Gemini redacta, pero los IDs, títulos, precios, stocks y métricas se reescriben en servidor desde la base de datos.
- **Secretos:** `GEMINI_API_KEY`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` solo en el entorno del servidor; la app móvil no expone la clave de Gemini.

Detalle: [`BASE_DE_DATOS.md`](BASE_DE_DATOS.md), [`DIAGRAMAS.md`](DIAGRAMAS.md) y [`ESTRUCTURA.md`](ESTRUCTURA.md).

---

## 4. Diseño de datos

Entidades principales: `usuarios`, `productos`, `clientes`, `proveedores`, `pedidos`, `items_pedido`, `ventas`, `items_venta`, `solicitudes_manga`, `movimientos_stock`.

**Reglas de integridad:** claves foráneas, `CHECK (stock >= 0)`, congelamiento de precios en las tablas de ítems y políticas RLS por rol. El script de referencia es `supabase/basededatos.sql`.

**Deuda conocida:** el script no incluye índices y el seed no es idempotente; ambos puntos quedan registrados en el informe de testing.

---

## 5. Comportamiento del sistema

1. **Acceso:** el usuario inicia sesión y el navegador muestra solo las pantallas de su perfil.
2. **Compra:** el cliente filtra el catálogo, agrega tomos al carrito y confirma el pedido; la RPC descuenta stock de forma atómica.
3. **Checkout de demostración:** tarjeta 3D con giro al enfocar el CVV, detección de marca, cuotas de **1, 3 o 6 sin interés**, validación de formatos y ticket con código `#YORU-XXXXXX`. No se contacta a ningún banco.
4. **Mostrador y depósito:** ventas y movimientos con auditoría.
5. **IA:** `recommend`, `report` y `chat` con verificación de sesión y salidas validadas en servidor.

---

## 6. Restricciones del diseño

- Multiplataforma: Android, iOS y web; Expo SDK 51.
- Comunicaciones con Supabase por HTTPS/TLS del proveedor; la app no implementa cifrado propio.
- Sin cifrado SSL ni verificación criptográfica en el checkout.
- La función IA exige JWT de usuario; las llamadas con anon key responden `401`.

---

## 7. Pruebas y validaciones

La cobertura total es de **31 casos**:

| Bloque | Casos | Tipo |
|:---|:---:|:---|
| Autenticación y registro | CP01–CP08 | Manual |
| Ventas y pedidos | CP09–CP13 | Manual |
| Operaciones y seguridad | CP14–CP20 | Manual |
| Checkout y catálogo | CP21–CP25 | Manual |
| Inteligencia Artificial | CP26–CP31 | Automatizado (`npm run test:ai`, 6/6) |

Entradas, resultados esperados y obtenidos: [`PRUEBAS.md`](PRUEBAS.md).

---

## 8. Despliegue y operación

- **Desarrollo:** Node.js 20+, Expo SDK 51, variables en `.env` (ver `.env.example`).
- **Producción:** Supabase Cloud; Edge Function `ai` con `verify_jwt = true` y secretos configurados en servidor.
- **Verificación local:** `npm ci`, `npm run test:ai`, `npx expo export --platform web`.
- **Pendiente de despliegue:** la función `ai` no pudo verificarse en vivo sin un JWT de usuario válido.

---

## 9. Ciclo de vida del software

Se trabajó en seis iteraciones semanales: análisis y requisitos, modelado de datos, implementación de roles y transacciones, frontend y catálogo, IA, y pruebas y documentación final. El registro de asistencia de IA se documenta en [`REGISTRO_IA.md`](REGISTRO_IA.md) y los avances en [`RESUMENES_SEMANALES.md`](RESUMENES_SEMANALES.md).

---

## 10. Sector de marketing e identidad institucional

- **Identidad:** paleta institucional, tipografías Bebas Neue y Manrope, logotipo e isotipo en `src/assets/yorumanga-logo.png`.
- **Local comercial:** planta, interior y maquetado 3D en Sweet Home 3D (`docs/sweet_home_3d_*.jpg`, `docs/plano_2d_sweet_home_3d.svg`).
- **QR de los sectores:** `docs/assets/qrs/` (`qr_app_catalogo.png`, `qr_cafe_solicitudes.png`, `qr_recomendador_ia.png`).
- **Manual de usuario:** [`MANUAL_DE_USUARIO.md`](MANUAL_DE_USUARIO.md).
- **Tríptico y merchandising:** describen la propuesta de valor, los servicios y los canales de contacto.

Detalle completo en [`informe final.md`](informe%20final.md), sección 10.

---

## Anexo — Entregables

| Entregable | Ubicación |
|:---|:---|
| Documento integral (este archivo) | `docs/DOCUMENTO_FINAL_WORD.md` |
| Informe técnico | `docs/informe final.md` |
| Presentación de defensa en 10 puntos | `docs/PRESENTACION_DEFENSA.md` |
| Checklist final de entrega | `docs/CHECKLIST_ENTREGA.md` |
| Manual de usuario | `docs/MANUAL_DE_USUARIO.md` |
| Matriz de pruebas CP01–CP31 | `docs/PRUEBAS.md` |
| Registro de uso de IA | `docs/REGISTRO_IA.md` |
| Resúmenes semanales | `docs/RESUMENES_SEMANALES.md` |
| Proyecto integrador (requisitos) | `docs/PROYECTO_INTEGRADOR.md` |
| Diagramas y base de datos | `docs/DIAGRAMAS.md`, `docs/BASE_DE_DATOS.md` |
