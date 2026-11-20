# YORUMANGA

Sistema de gestión para tienda de mangas físicos (Proyecto Integrador).

## Stack
- React Native (Expo)
- Supabase (PostgreSQL + Auth + RLS)
- Google Gemini (Recomendador con IA)

## Configuración rápida
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear archivo `.env` basado en `.env.example`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   EXPO_PUBLIC_GEMINI_API_KEY=tu_gemini_api_key
   ```
3. Ejecutar el script SQL en Supabase SQL Editor:
   - Archivo: `supabase/basededatos.sql`
4. Iniciar la aplicación:
   ```bash
   npx expo start
   ```

## Roles
- **Cliente:** Catálogo con filtros y novedades, carrito, pedidos y recomendador IA.
- **Vendedor:** Ventas en mostrador (POS) y gestión de clientes.
- **Depósito:** Control de stock, movimientos y proveedores.
- **Admin:** Panel de métricas, usuarios, pedidos, solicitudes y reportes.