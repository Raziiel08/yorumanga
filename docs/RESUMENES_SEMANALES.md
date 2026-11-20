# SEGUIMIENTO SEMANAL DEL PROYECTO (Puntos 6, 7 y 22)

## Escuela de Educación Secundaria Técnica N°1 de Esteban Echeverría

**Materia:** Aplicaciones Móviles  
**Profesor:** Pablo Gareis  
**Curso:** 7° 3°  
**Proyecto:** YORUMANGA  
**Integrantes:** Agustín Hermida y Elías González  
**Período de Desarrollo:** 1 de Octubre al 13 de Noviembre de 2026

---

### Semana 1: Del 1 al 9 de Octubre

- **Objetivo de la etapa:** Definición de la empresa ficticia, relevamiento de la problemática, requisitos del sistema e historias de usuario.
- **Tareas realizadas:**
  - Creación del concepto de la empresa: YORUMANGA (tienda física de mangas y plataforma e-commerce).
  - Relevamiento de los problemas actuales del negocio (descontrol en Excel, sobreventa de tomos físicos, falta de permisos).
  - Redacción de los 14 Requisitos Funcionales (RF01 a RF14) y Requisitos No Funcionales.
  - Definición de las historias de usuario para los 4 roles (Cliente, Vendedor, Depósito y Administrador).
  - Elección de la herramienta de gestión y asignación de responsabilidades en el equipo (Agustín: Backend/BD/IA; Elías: Frontend/UI/Docs).
- **Tareas pendientes:** Comenzar el modelado del Diagrama Entidad-Relación y diseño de pantallas en Figma.
- **Funcionalidades nuevas:** Definición del alcance inicial (qué sí hace y qué no hace el software).
- **Problemas encontrados:** Dudas sobre si implementar pagos con tarjeta bancaria en vivo en la primera versión.
- **Solución aplicada:** Se decidió dejar la pasarela de pagos fuera del alcance inicial (registrando pedidos con pago en efectivo/transferencia/mostrador) para priorizar el control estricto de stock y la lógica transaccional.

---

### Semana 2: Del 10 al 16 de Octubre

- **Objetivo de la etapa:** Diseño de arquitectura, diagramas técnicos y prototipado visual.
- **Tareas realizadas:**
  - Elaboración del Diagrama Entidad-Relación (DER) con 10 entidades normalizadas en 3FN.
  - Diagramación de Casos de Uso (flujo de Login con bifurcación por roles).
  - Diagrama de Actividades para el registro de productos y ventas en mostrador.
  - Diagrama de Componentes de React Native con Expo y capas de servicios.
  - Diseño de la identidad visual: paleta de colores institucional (`theme.js`), tipografías (Bebas Neue y Manrope) y logo oficial (`yorumanga-logo.png`).
- **Tareas pendientes:** Inicialización del proyecto en Expo y configuración del proyecto en Supabase.
- **Funcionalidades nuevas:** Estructura de navegación modular planificada por roles.
- **Problemas encontrados:** Necesidad de que la app funcione fluidamente tanto en pantallas de celular como en navegadores web de computadoras de escritorio.
- **Solución aplicada:** Se diseñó un hook responsivo (`useResponsivo.js`) y encabezados adaptables (`EncabezadoEscritorio.js` y `EncabezadoPantalla.js`) para asegurar que la misma base de código se ajuste a cualquier dispositivo.

---

### Semana 3: Del 17 al 23 de Octubre

- **Objetivo de la etapa:** Creación de la base de datos en Supabase, tablas, triggers y primeros componentes visuales.
- **Tareas realizadas:**
  - Creación del proyecto en Supabase y ejecución del script DDL (`supabase/basededatos.sql`).
  - Creación de tablas (`usuarios`, `productos`, `clientes`, `proveedores`, `pedidos`, `items_pedido`, etc.).
  - Implementación de extensiones UUID y triggers para la actualización de fechas (`set_updated_at`) y creación de perfiles al registrarse (`handle_new_user`).
  - Desarrollo de componentes UI base en React Native: `Boton.js`, `Campo.js`, `Tarjeta.js`, `AvisoError.js`.
  - Configuración de la conexión cliente con Supabase en `src/config/supabase.js`.
- **Tareas pendientes:** Finalizar las pantallas de Login, Registro y CRUD de productos.
- **Funcionalidades nuevas:** Inicio de sesión y registro de usuarios con asignación automática de rol 'cliente'.
- **Problemas encontrados:** Al registrar un nuevo usuario con Supabase Auth, en ocasiones el trigger tardaba unos milisegundos en insertar el registro en la tabla pública `usuarios`, provocando pantalla blanca.
- **Solución aplicada:** Se agregó un mecanismo de fallback en `ContextoAuth.js` que reintenta la lectura del perfil y, en caso de omisión, realiza la inserción de respaldo con rol 'cliente'.

---

### Semana 4: Del 24 al 30 de Octubre

- **Objetivo de la etapa:** Desarrollo del punto de venta en mostrador (Vendedor), catálogo y carrito (Cliente) y módulo de stock (Depósito).
- **Tareas realizadas:**
  - Desarrollo de la pantalla de catálogo (`Catalogo.js`) con filtros por género y búsqueda por texto.
  - Implementación del `ContextoCarrito.js` para persistir mangas seleccionados y calcular subtotales.
  - Creación de la pantalla de mostrador `NuevaVenta.js` para vendedores, permitiendo seleccionar clientes y productos.
  - Desarrollo de la pantalla `Stock.js` y `MovimientoStock.js` para entradas y salidas de depósito.
- **Tareas pendientes:** Migrar la lógica de descuento de stock al servidor para evitar inconsistencias.
- **Funcionalidades nuevas:** Confirmación de pedidos online y registro de ventas físicas.
- **Problemas encontrados:** Si dos clientes intentaban comprar el último tomo en simultáneo, el stock podía quedar en números negativos si la resta se hacía en la aplicación móvil.
- **Solución aplicada:** Se creó la función almacenada `crear_venta` y `crear_pedido` en PostgreSQL con validación `stock >= cantidad` y restricción SQL `CHECK (stock >= 0)`. Toda la transacción se ejecuta de forma atómica en el servidor.

---

### Semana 5: Del 31 de Octubre al 6 de Noviembre

- **Objetivo de la etapa:** Integración de Inteligencia Artificial, seguridad de datos (RLS) y depuración general.
- **Tareas realizadas:**
  - Integración del servicio de IA en `src/services/ia.js` consumiendo el endpoint de Inteligencia Artificial.
  - Creación de la pantalla `RecomendadorIA.js` para clientes, que analiza preferencias temáticas y sugiere títulos que realmente tienen stock en tienda.
  - Desarrollo de la pantalla `Reportes.js` para el Administrador con generación de informes ejecutivos y sugerencias de compra asistidas por IA.
  - Activación de **Row Level Security (RLS)** en el 100% de las tablas de Supabase para blindar los datos según el rol.
  - Módulo de Solicitud de Mangas no disponibles (`SolicitarManga.js`).
- **Tareas pendientes:** Plan de pruebas de caja negra y redacción de manuales.
- **Funcionalidades nuevas:** Recomendador de manga inteligente y reportes analíticos con IA.
- **Problemas encontrados:** La IA en ocasiones recomendaba mangas populares que no estaban cargados en la base de datos o que tenían stock 0.
- **Solución aplicada:** Se modificó el servicio `ia.js` para que filtre las respuestas contra los IDs reales del catálogo activo y descarte cualquier recomendación sin existencias reales.

---

### Semana 6: Del 7 al 13 de Noviembre

- **Objetivo de la etapa:** Pruebas rigurosas (positivas, negativas y límite), documentación final, manual de usuario y preparación de la defensa.
- **Tareas realizadas:**
  - Ejecución de la matriz de pruebas (CP01 a CP15) cubriendo casos válidos, inválidos y límites de stock y contraseñas.
  - Compilación final del bundle web de producción (`npx expo export --platform web`), verificando cero errores de empaquetado.
  - Redacción del documento integral para Word (`docs/DOCUMENTO_FINAL_WORD.md`) con las 10 secciones exigidas (incluyendo marketing, maquetado y QR).
  - Generación de los códigos QR del local comercial (`docs/assets/qrs/`).
  - Creación del Registro de Uso de IA (`docs/REGISTRO_IA.md`) y Manual de Usuario.
  - Sincronización del repositorio de GitHub (`main`, `Documentacion`, `Marketing`).
  - Ensayo general de la presentación oral para la defensa del 13 de noviembre.
- **Tareas pendientes:** Ninguna. Sistema terminado, probado y listo para su entrega.
- **Funcionalidades nuevas:** Documentación completa y sistema validado en su totalidad.
- **Resultado final:** Sistema 100% operativo cumpliendo con los 23 puntos del Proyecto Integrador.
