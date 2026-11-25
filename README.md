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
2. Crear archivo `.env` basado en `.env.example` (solo URL y anon/publishable key):
   ```env
   EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```
3. Ejecutar el script SQL en Supabase SQL Editor:
   - Archivo: `supabase/basededatos.sql`
4. Configurar e implementar la Edge Function de IA:
   ```bash
   supabase link --project-ref TU_PROJECT_REF
   supabase secrets set GEMINI_API_KEY=tu_clave_de_gemini
   supabase functions deploy ai
   ```
   La clave de Gemini **nunca** se pone en `.env` de la app: `EXPO_PUBLIC_*` viaja en el bundle.
5. Iniciar la aplicación:
   ```bash
   npx expo start
   ```

## Roles
- **Cliente:** Catálogo con filtros y novedades, carrito, pedidos y recomendador IA.
- **Vendedor:** Ventas en mostrador (POS) y gestión de clientes.
- **Depósito:** Control de stock, movimientos y proveedores.
- **Admin:** Panel de métricas, usuarios, pedidos, solicitudes y reportes.

## Inteligencia Artificial
La función `ai` vive en `supabase/funciones/ai/logica.js` (JavaScript puro, con variables y funciones en español) y expone tres operaciones. El punto de entrada es `index.js` y solo importa `manejador`. El nombre `ai` se mantiene porque es el que usa la app al llamar `functions.invoke("ai")`.

| Tipo (nombre original) | Datos que envía la app | Respuesta |
|---|---|---|
| `recommend` (recomendar) | `{ preferencias }` | JSON con mangas del catálogo; título, género, portada y **stock real** se toman de la BD, no de la IA. |
| `report` (informe) | Datos del informe (se recalculan en el servidor) | Resumen y recomendaciones generados a partir de métricas calculadas en la BD. |
| `chat` (asistente) | `{ message }` | Texto del asistente. |

Los valores `recommend`, `report`, `chat` y los campos `type`, `message` y `content` se dejan en inglés porque son el contrato que ya usa `src/services/ia.js`.

Requiere el secreto `GEMINI_API_KEY` en Supabase (opcional `GEMINI_MODEL`, por defecto `gemini-2.0-flash`). Para probar localmente:

```bash
cp supabase/funciones/.env.example supabase/funciones/.env
# editar .env con tu clave
supabase functions serve ai --env-file supabase/funciones/.env --no-verify-jwt
```

Documentación completa: `docs/REGISTRO_IA.md`.