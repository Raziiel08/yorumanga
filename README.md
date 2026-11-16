# YORUMANGA

Sistema de gestión y venta de mangas físicos, desarrollado como proyecto integrador.

## Tecnologías

- React Native con Expo
- Supabase Auth y PostgreSQL con políticas RLS
- Supabase Edge Functions para las llamadas a Google Gemini

## Puesta en marcha

1. Instalar dependencias con `npm install`.
2. Crear un archivo `.env` en la raíz con `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
3. Ejecutar `supabase/basededatos.sql` en el SQL Editor de un proyecto Supabase nuevo.
4. Promover el primer usuario a administrador desde el SQL Editor de Supabase. No habilitar esa acción desde el cliente.
5. Iniciar Expo con `npx expo start`.


## Roles

- **Cliente:** catálogo, pedidos, solicitudes y recomendaciones.
- **Vendedor:** ventas de mostrador, clientes y lectura del catálogo.
- **Depósito:** catálogo, proveedores y movimientos de stock.
- **Admin:** administración, pedidos, solicitudes, reportes y roles.

## Funcionalidades

- Catálogo, carrito y pedidos en línea.
- Registro de ventas presenciales.
- Control transaccional de stock y su historial.
- Gestión de clientes, proveedores y usuarios.
- Recomendador de mangas e informes asistidos por IA.
