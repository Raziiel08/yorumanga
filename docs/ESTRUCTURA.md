# Estructura del Proyecto — YORUMANGA

**Proyecto Integrador** — E.E.S.T N°1 de Esteban Echeverría  
**Materia:** Aplicaciones Móviles | **Profesor:** Pablo Gareis | **Curso:** 7° 3°  
**Alumnos:** Agustín Hermida y Elías González  

---

## 1. Arquitectura del Sistema
Aplicación multiplataforma (Mobile y Web) desarrollada en **React Native con Expo SDK 51**, consumiendo servicios en la nube a través de **Supabase** (PostgreSQL, Supabase Auth con tokens JWT, Row Level Security y funciones almacenadas transaccionales).

---

## 2. Árbol de Carpetas del Proyecto

```
Yorumanga/
├── App.js                   # Punto de entrada principal con carga de fuentes
├── app.json                 # Configuración de Expo (nombre, orientación, icono)
├── package.json             # Dependencias del proyecto
├── .env                     # Variables de entorno seguras (URL y Anon Key de Supabase)
├── supabase/
│   └── basededatos.sql      # Script DDL completo idempotente (tablas, RLS, triggers y RPCs)
├── docs/                    # Documentación formal completa para entrega
│   ├── DOCUMENTO_FINAL_WORD.md
│   ├── MANUAL_DE_USUARIO.md
│   ├── REGISTRO_IA.md
│   ├── RESUMENES_SEMANALES.md
│   ├── BASE_DE_DATOS.md
│   ├── DIAGRAMAS.md
│   ├── PRUEBAS.md
│   ├── PROYECTO_INTEGRADOR.md
│   └── assets/qrs/          # Códigos QR del local comercial
└── src/
    ├── assets/              # Logo institucional (yorumanga-logo.png)
    ├── components/          # Componentes visuales modulares reutilizables
    │   ├── AvisoError.js
    │   ├── Boton.js
    │   ├── Campo.js
    │   ├── Chip.js
    │   ├── ConfirmarBoton.js
    │   ├── EncabezadoEscritorio.js
    │   ├── EncabezadoPantalla.js
    │   ├── Etiqueta.js
    │   ├── Icono.js
    │   ├── LogoMarca.js
    │   ├── PanelOperativo.js
    │   ├── PiePagina.js
    │   ├── Tarjeta.js
    │   ├── TarjetaCreditoInteractiva.js # Tarjeta 3D interactiva (crd-ui), giro frente/dorso y marcas
    │   └── TarjetaProducto.js
    ├── config/              # Conexión cliente con Supabase (supabase.js)
    ├── constants/           # Definiciones de diseño (theme.js, generos.js)
    ├── context/             # Estados globales de React (ContextoAuth.js, ContextoCarrito.js)
    ├── hooks/               # Hooks personalizados (useResponsivo.js)
    ├── navigation/          # Enrutamiento y segregación de accesos
    │   ├── NavegadorApp.js  # Switcher según rol del usuario autenticado
    │   ├── PilaAuth.js      # Login y Registro público
    │   ├── PilaCliente.js   # Pila y Tabs para el cliente
    │   ├── PilaVendedor.js  # Módulo de punto de venta y clientes
    │   ├── PilaDeposito.js  # Módulo de inventario y proveedores
    │   └── PilaAdmin.js     # Módulo de administración general
    ├── screens/             # Vistas de la aplicación
    │   ├── auth/            # Login.js, Registro.js (con selector de 4 roles)
    │   ├── cliente/         # Inicio, Catalogo (inmersivo), DetalleProducto, Carrito, Pago (Simulador 3D crd-ui), Perfil, MisPedidos, MisSolicitudes, SolicitarManga, RecomendadorIA
    │   ├── vendedor/        # PanelVendedor, Ventas, NuevaVenta, Clientes, FormCliente, ProductosVendedor
    │   ├── deposito/        # PanelDeposito, Stock, MovimientoStock, ProductosDeposito, Proveedores, FormProveedor
    │   └── admin/           # PanelAdmin, ProductosAdmin, FormProducto, PedidosAdmin, SolicitudesAdmin, UsuariosAdmin, Reportes
    ├── services/            # Capa de consumo de API Supabase
    │   ├── clientes.js
    │   ├── ia.js
    │   ├── pedidos.js
    │   ├── productos.js
    │   ├── proveedores.js
    │   ├── stock.js
    │   └── ventas.js
    └── utils/               # Funciones utilitarias y validadores
        ├── alertas.js       # Alertas universales (Web y Mobile)
        ├── moneda.js        # Formateo a moneda argentina ($)
        ├── reportes.js      # Lógica de cálculo estadístico
        └── validaciones.js  # Validación estricta de emails (.com y dominios populares) y claves
```

---

## 3. Matriz de Roles y Permisos (RBAC)

| Funcionalidad / Módulo | Cliente | Vendedor | Depósito | Administrador |
|---|:---:|:---:|:---:|:---:|
| **Explorar catálogo con filtros y Novedades** | ✓ | ✓ | ✓ | ✓ |
| **Agregar al carrito y confirmar pedidos online** | ✓ | ✗ | ✗ | ✗ |
| **Recomendador temático con Inteligencia Artificial** | ✓ | ✗ | ✗ | ✓ |
| **Solicitar mangas no disponibles** | ✓ | ✗ | ✗ | ✗ |
| **Registrar ventas en mostrador (POS presencial)** | ✗ | ✓ | ✗ | ✓ |
| **Crear y administrar clientes (campos obligatorios)** | ✗ | ✓ | ✗ | ✓ |
| **Registrar entradas y salidas de stock** | ✗ | ✗ | ✓ | ✓ |
| **Administrar proveedores de distribución** | ✗ | ✗ | ✓ | ✓ |
| **Alta, edición y desactivación de productos** | ✗ | ✗ | ✗ | ✓ |
| **Cambiar estado de pedidos de clientes** | ✗ | ✗ | ✗ | ✓ |
| **Gestión y cambio de roles de usuarios** | ✗ | ✗ | ✗ | ✓ |
| **Generar informes analíticos con IA** | ✗ | ✗ | ✗ | ✓ |
| **Pasarela interactiva de pago con tarjeta (crd-ui)** | ✓ | ✗ | ✗ | ✗ |

---

## 4. Flujo Transaccional de Ventas y Pedidos

```
[Compra Online y Pasarela de Pago Simulada]
  1. Cliente agrega tomos al Carrito y presiona "Proceder al Pago"
  2. Módulo de Pago Seguro abre interfaz de Tarjeta 3D interactiva
  3. Detección automática de marca (Visa / Mastercard / Amex / Cabal / Naranja)
  4. Animación Flip (giro al dorso en 3D) al ingresar o enfocar el código CVV
  5. Selección de cuotas (1 a 6 cuotas sin interés) o carga rápida de tarjeta de prueba
  6. Presiona "Pagar": simulación de autorización SSL bancaria
  7. Ejecución de RPC crear_pedido -> Descuenta stock y genera comprobante con código de operación

[Venta en Mostrador]
  1. Vendedor selecciona o crea Cliente (+ Nuevo cliente)
  2. Selecciona mangas y cantidades
  3. Servidor ejecuta RPC crear_venta (Bloqueo de fila FOR UPDATE)
  4. Valida stock >= cantidad -> Descuenta stock
  5. Inserta registro en 'ventas', 'items_venta' y 'movimientos_stock'
  6. Si falta stock -> Rollback total (sin stock negativo)
```
