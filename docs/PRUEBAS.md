# Registro de Pruebas y Validación — YORUMANGA

**Proyecto Integrador** — E.E.S.T N°1 de Esteban Echeverría  
**Materia:** Aplicaciones Móviles | **Profesor:** Pablo Gareis | **Curso:** 7° 3°  
**Alumnos:** Agustín Hermida y Elías González  

---

## Matriz de Casos de Prueba (Positivas, Negativas y Límite)

| ID | Módulo / Función | Tipo | Entrada / Acción Realizada | Resultado Esperado | Resultado Obtenido |
|:---:|:---|:---:|:---|:---|:---:|
| **CP01** | Autenticación | Positivo | Usuario y contraseña correctos registrados | Concede acceso a la pantalla de inicio | **Aprobado** |
| **CP02** | Autenticación | Negativo | Contraseña incorrecta | Rechaza acceso con mensaje de error | **Aprobado** |
| **CP03** | Registro | Límite | Contraseña de exactamente 6 caracteres | Permite registro y crea el perfil | **Aprobado** |
| **CP04** | Registro | Negativo | Contraseña de 5 caracteres | Rechaza por longitud insuficiente | **Aprobado** |
| **CP05** | Registro / Roles | Positivo | Seleccionar rol 'vendedor' o 'deposito' | Crea usuario y asigna el rol seleccionado | **Aprobado** |
| **CP06** | Validación Correo | Negativo | Ingresar `usuario@gmail` (sin .com) | Rechaza exigiendo '@gmail.com' | **Aprobado** |
| **CP07** | Validación Correo | Negativo | Ingresar dominio no popular `juan@saraza.com` | Rechaza exigiendo dominios reconocidos | **Aprobado** |
| **CP08** | Validación Correo | Positivo | Ingresar `lector@gmail.com` | Acepta el correo correctamente | **Aprobado** |
| **CP09** | Venta en Mostrador| Positivo | Vender 2 unidades teniendo stock 8 | Registra venta y descuenta stock a 6 | **Aprobado** |
| **CP10** | Venta en Mostrador| Límite | Vender exactamente las 6 unidades restantes | Permite venta y el stock resultante es 0 | **Aprobado** |
| **CP11** | Venta en Mostrador| Negativo | Intentar vender 1 unidad con stock 0 | Servidor bloquea la venta con excepción SQL | **Aprobado** |
| **CP12** | Pedido Online | Positivo | Confirmar carrito con stock | Genera pedido y descuenta stock | **Aprobado** |
| **CP13** | Pedido Online | Negativo | Intentar pedir cantidad mayor al stock | El carrito impide superar el stock disponible | **Aprobado** |
| **CP14** | Proveedores | Negativo | Guardar proveedor con campos vacíos | Bloquea y exige completar los 4 campos | **Aprobado** |
| **CP15** | Clientes | Negativo | Guardar cliente sin dirección o sin correo .com | Bloquea y exige todos los campos obligatorios | **Aprobado** |
| **CP16** | Movimiento Stock | Positivo | Registrar entrada de 10 unidades | Stock aumenta de 0 a 10 con auditoría | **Aprobado** |
| **CP17** | Movimiento Stock | Negativo | Registrar salida mayor al stock disponible | Servidor rechaza el movimiento | **Aprobado** |
| **CP18** | Seguridad RLS | Negativo | Cliente intenta invocar ruta admin | Base de datos deniega el acceso | **Aprobado** |
| **CP19** | Recomendador IA | Positivo | Ingresar preferencia: "peleas y ninjas" | Sugiere mangas con existencias activas | **Aprobado** |
| **CP20** | Catálogo / Scroll | Positivo | Deslizar hacia abajo en la lista de mangas | Oculta filtros superiores dando espacio visual | **Aprobado** |
| **CP21** | Pasarela de Pago | Positivo | Enfocar el campo CVV en el checkout | La tarjeta interactiva gira 3D mostrando el dorso | **Aprobado** |
| **CP22** | Pasarela de Pago | Negativo | Ingresar fecha de expiración vencida o mes 15/28 | Bloquea el pago indicando fecha inválida o caducada | **Aprobado** |
| **CP23** | Pasarela de Pago | Positivo | Presionar botón demo "Visa Crédito (3 cuotas)" | Autocompleta datos válidos de prueba para evaluación | **Aprobado** |
| **CP24** | Pasarela de Pago | Positivo | Detección de marca de tarjeta | Ingresar número comenzando en 4 (Visa) o 5 (Mastercard) y actualiza el logo en vivo | **Aprobado** |
| **CP25** | Pasarela de Pago | Positivo | Confirmar pago de pedido con tarjeta | Simula procesamiento bancario, descuenta stock y emite ticket digital `#YORU-XXXXXX` | **Aprobado** |
