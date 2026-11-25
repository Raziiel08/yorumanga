# Checklist final de entrega — YORUMANGA

Estado verificado en la auditoría de noviembre de 2026. **OK** = comprobado; **PENDIENTE** = deuda registrada, no bloquea la entrega documental pero debe resolverse antes de publicar.

## Documentación

| Ítem | Estado | Evidencia |
|:---|:---:|:---|
| Documento integral para Word (10 secciones) | **OK** | `docs/DOCUMENTO_FINAL_WORD.md` |
| Informe técnico | **OK** | `docs/informe final.md` |
| Presentación de defensa en 10 puntos | **OK** | `docs/PRESENTACION_DEFENSA.md` |
| Checklist final de entrega | **OK** | este archivo |
| Manual de usuario | **OK** | `docs/MANUAL_DE_USUARIO.md` |
| Matriz única de pruebas CP01–CP31 | **OK** | `docs/PRUEBAS.md` |
| Registro de uso de IA | **OK** | `docs/REGISTRO_IA.md` |
| Resúmenes semanales y proyecto integrador | **OK** | `docs/RESUMENES_SEMANALES.md`, `docs/PROYECTO_INTEGRADOR.md` |
| Diagramas y base de datos | **OK** | `docs/DIAGRAMAS.md`, `docs/BASE_DE_DATOS.md` |
| QR del local y maquetado 3D | **OK** | `docs/assets/qrs/`, `docs/sweet_home_3d_*.jpg` |

## Consistencia de código y pagos

| Ítem | Estado | Evidencia |
|:---|:---:|:---|
| Proyecto sin TypeScript (sin `.ts` ni dependencias de tipos) | **OK** | `index.js`, `logica.js`, `pruebas.js` y `package.json` sin `typescript` ni `@types/react` |
| Sin `config.toml` de Supabase | **OK** | `supabase/` queda solo con `basededatos.sql` y `funciones/ai/` |
| Colores usados y no definidos en `theme.js` | **OK** | 4 alias agregados; auditoría de tema sin faltantes |
| Cuotas uniformes 1/3/6 sin interés | **OK** | `src/screens/cliente/Pago.js` y documentación |
| Sin claims de SSL 256-bit ni verificación criptográfica | **OK** | checkout, tarjeta 3D, manual, informe y ESTRUCTURA |
| Datos de tarjetas de prueba ficticios | **OK** | titulares "USUARIO DE PRUEBA" y "CLIENTE DEMO" |
| CP01–CP31 numerados sin tablas duplicadas | **OK** | `informe final.md` referencia a `PRUEBAS.md` |

## Verificación técnica

| Ítem | Estado | Evidencia |
|:---|:---:|:---|
| Pruebas automatizadas de IA | **OK** | `npm run test:ai` → 6 passed / 0 failed |
| `deno check` de la función IA | **OK** | sin errores |
| Export web | **OK** | instalación actual e instalación limpia |
| Export Android/iOS en instalación actual | **OK** | bundle 3,15 MB |
| Prueba visual del export web | **OK** | login y registro sin errores de consola |
| Export Android/iOS en instalación limpia | **PENDIENTE** | falta declarar `expo-constants` en `package.json` |
| Función IA desplegada verificada en vivo | **PENDIENTE** | sin JWT de usuario; anon key → `401` |
| Pruebas en dispositivo/emulador real | **PENDIENTE** | solo se probó export estático y web |
| Configuración CLI regenerada si se usa Supabase local | **PENDIENTE** | `supabase init` crea un `config.toml`; declarar `entrypoint = "./funciones/ai/index.js"` para no depender del `index.ts` por defecto |

## Seguridad y repositorio

| Ítem | Estado | Evidencia |
|:---|:---:|:---|
| Registro público sin opción Admin | **PENDIENTE** | `Registro.js`, `ContextoAuth.js`, `asignar_mi_rol` |
| Índices SQL y seed idempotente | **PENDIENTE** | `supabase/basededatos.sql` |
| `npm audit` sin vulnerabilidades | **PENDIENTE** | 40 hallazgos (1 critical, 17 high) |
| Working tree limpio y rama con upstream | **PENDIENTE** | 98 entradas sin commitear; `master` sin upstream |
| PR de revisión e issues de seguimiento | **PENDIENTE** | 0 issues y 0 PRs en GitHub |

---

**Conclusión:** la documentación y la coherencia funcional quedaron alineadas. Los ítems **PENDIENTE** corresponden a deudas técnicas ya informadas y requieren credenciales o decisiones del equipo antes de publicar.
