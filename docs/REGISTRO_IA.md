# REGISTRO FORMAL DEL USO DE INTELIGENCIA ARTIFICIAL (Puntos 2 y 20)
## Escuela de Educación Secundaria Técnica N°1 de Esteban Echeverría
**Materia:** Aplicaciones Móviles  
**Profesor:** Pablo Gareis  
**Curso:** 7° 3°  
**Proyecto:** YORUMANGA  
**Integrantes:** Agustín Hermida y Elías González  

---

### 1. Política y Criterio de Uso de Inteligencia Artificial
Durante el ciclo de desarrollo del sistema **YORUMANGA**, se utilizaron herramientas de Inteligencia Artificial como asistentes de ingeniería de software para acelerar la resolución de problemas técnicos, optimizar consultas de base de datos y refactorizar interfaces de usuario. 

Siguiendo las pautas del Proyecto Integrador, **ninguna porción de código fue incorporada de forma ciega ("copiar y pegar sin comprender")**. Todo componente, procedimiento almacenado o función generado o asistido por IA fue analizado, adaptado a la arquitectura del proyecto, modificado manualmente y sometido a pruebas funcionales para asegurar su correcto funcionamiento.

---

### 2. Tabla de Registro de Interacciones con IA

| ID | Herramienta | Finalidad / Consulta Realizada | Respuesta / Solución de la IA | Modificaciones y Adaptaciones Manuales Realizadas | Método de Comprobación y Validación |
|:---:|:---:|:---|:---|:---|:---|
| **IA-01** | **OpenCode** | Estructurar el esquema relacional inicial de PostgreSQL para evitar sobreventas de stock. | Propuso tablas separadas para pedidos y ventas con claves foráneas estándar. | Se renombraron las tablas e identificadores a español (`usuarios`, `productos`, `ventas`), se agregaron constraints `CHECK (stock >= 0)` y campos de auditoría `creado_en`. | Ejecución del script DDL en el SQL Editor de Supabase y verificación de restricciones mediante inserts inválidos. |
| **IA-02** | **OpenCode** | Resolver condición de carrera (race condition) al vender el último tomo disponible. | Sugirió realizar un select previo desde el cliente y luego un update. | **Se rechazó la lógica en el cliente por insegura** y se diseñó la función almacenada `crear_venta` en PL/pgSQL en el servidor con transacciones atómicas (`BEGIN ... COMMIT`). | Pruebas de ventas simultáneas desde dos sesiones distintas; el sistema bloqueó la segunda venta correctamente. |
| **IA-03** | **Antigravity** | Diseñar la navegación por roles segregada con `@react-navigation/native-stack`. | Generó un esquema básico de navegadores condicionales según el estado de sesión. | Se dividieron en 4 pilas dedicadas (`PilaCliente`, `PilaVendedor`, `PilaDeposito`, `PilaAdmin`) y se sincronizó con el `ContextoAuth` y tokens de Supabase. | Inicio de sesión con cuentas de prueba de cada rol (vendedor, cliente, depósito, admin); se comprobó que nadie puede saltar a pantallas ajenas. |
| **IA-04** | **Antigravity** | Integración del Recomendador de Mangas con la API de IA (Google Gemini). | Propuso un endpoint general que respondía en texto libre. | Se forzó un prompt con salida estricta en JSON y se implementó un parser de extracción (`extractJSON`) que filtra únicamente los mangas que **realmente tienen stock mayor a 0 en la BD**. | Pruebas pidiendo mangas de géneros agotados; el sistema descartó sugerencias sin existencias reales. |
| **IA-05** | **OpenCode** | Generación de la paleta institucional y diseño responsivo para móviles y navegadores web. | Proveyó un hook básico para detectar dimensiones de pantalla con `useWindowDimensions`. | Se creó el hook `useResponsivo.js` y componentes dedicados (`EncabezadoEscritorio.js`, `EncabezadoPantalla.js`) aplicando la paleta oficial de colores manga (`theme.js`). | Exportación y ejecución web (`npx expo export --platform web`) y emulación en resoluciones móviles de 360px a 1440px. |
| **IA-06** | **Antigravity** | Validación de formularios de registro y login (correo y contraseñas). | Sugirió expresiones regulares estándar de validación. | Se adaptó para exigir contraseñas alfanuméricas de al menos 6 caracteres y se incorporó el icono interactivo para mostrar/ocultar contraseña (`showPassword`). | Pruebas de límite con contraseñas de 5 caracteres (rechazadas) y 6 caracteres (aceptadas). |
| **IA-07** | **Antigravity** | Generación de reportes directivos asistidos por IA para el Administrador. | Sugirió un resumen textual simple de ventas. | Se combinaron métricas numéricas reales (total recaudado, mangas más vendidos) con un prompt analítico que redacta sugerencias de reposición de stock. | Comprobación en la pantalla `Reportes.js` comparando los totales calculados por SQL contra el texto emitido por la IA. |
| **IA-08** | **Antigravity** | Validación estricta de dominios populares y campos obligatorios en Proveedores/Clientes. | Sugirió un validador regex básico. | Se creó una lista blanca estricta (`DOMINIOS_POPULARES_PERMITIDOS`) que restringe correos a dominios reconocidos (@gmail.com, @hotmail.com, etc.), exigiendo el 100% de los campos en altas comerciales. | Pruebas intentando ingresar correos no populares (`@saraza.com`) o sin `.com` (`@gmail`), verificando el bloqueo y mensaje contextual. |
