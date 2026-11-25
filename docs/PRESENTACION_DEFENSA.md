# YORUMANGA — Presentación de defensa en 10 puntos

Guion para una exposición de aproximadamente 10 minutos. Cada punto indica el mensaje central y la evidencia que se debe mostrar en pantalla.

---

### 1. El problema y la propuesta
**Mensaje:** una librería de mangas gestionaba stock, ventas y pedidos en forma dispersa; YORUMANGA los unifica en una sola app.
**Mostrar:** pantalla de inicio y logotipo de la marca.

### 2. Alcance del sistema
**Mensaje:** seis módulos — usuarios, catálogo, ventas, depósito, solicitudes e IA. El checkout es una demostración, no un cobro real.
**Mostrar:** menú por rol y el aviso "Checkout de demostración · sin cobro real".

### 3. Requisitos y actores
**Mensaje:** 14 requisitos funcionales (RF01–RF14) y cuatro perfiles: cliente, vendedor, depósito y administrador.
**Mostrar:** `docs/PROYECTO_INTEGRADOR.md`, sección 4.

### 4. Arquitectura
**Mensaje:** Expo/React Native en el cliente, Supabase en servidor, transacciones SQL y una Edge Function para IA con secretos fuera de la app.
**Mostrar:** diagrama de despliegue en `docs/DIAGRAMAS.md`.

### 5. Modelo de datos e integridad
**Mensaje:** stock nunca negativo, precios congelados en cada operación y RLS por rol.
**Mostrar:** DER en `docs/BASE_DE_DATOS.md`.

### 6. Recorrido de compra
**Mensaje:** carrito → pedido atómico → descuento de stock. El pago valida formatos y ofrece 1, 3 o 6 cuotas sin interés, sin conexión bancaria.
**Mostrar:** flujo en `docs/ESTRUCTURA.md`, sección 4.

### 7. Inteligencia Artificial
**Mensaje:** recomendaciones sobre títulos con stock real e informes cuyas métricas se calculan en servidor; Gemini solo redacta.
**Mostrar:** pantalla del recomendador y `supabase/funciones/ai/logica.js`.

### 8. Pruebas
**Mensaje:** 31 casos documentados; los seis de IA están automatizados y pasan con `npm run test:ai`.
**Mostrar:** `docs/PRUEBAS.md` y la salida `6 passed / 0 failed`.

### 9. Marketing, local y QR
**Mensaje:** identidad visual, maquetado 3D del local y códigos QR por sector.
**Mostrar:** imágenes de `docs/` y `docs/assets/qrs/`.

### 10. Estado actual y próximos pasos
**Mensaje:** Entregable documental completo. Pendientes: build nativo limpio (`expo-constants`), restricción del rol admin, deploy en vivo de la función IA y commit/PR.
**Mostrar:** `docs/CHECKLIST_ENTREGA.md`.

---

**Cierre sugerido:** "El sistema cubre el ciclo completo de venta e inventario; la IA trabaja sobre datos verificados y el checkout es una simulación honesta, sin claims bancarios."
