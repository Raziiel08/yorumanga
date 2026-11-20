# Diagramas del Sistema — YORUMANGA

**Proyecto Integrador** — E.E.S.T N°1 de Esteban Echeverría  
**Materia:** Aplicaciones Móviles | **Profesor:** Pablo Gareis | **Curso:** 7° 3°  
**Alumnos:** Agustín Hermida y Elías González  

---

## 1. Diagrama Entidad-Relación (DER / Modelo Físico)

```mermaid
erDiagram
    USUARIOS ||--o{ PEDIDOS : realiza
    USUARIOS ||--o{ SOLICITUDES_MANGA : emite
    USUARIOS ||--o{ VENTAS : atiende
    USUARIOS ||--o{ MOVIMIENTOS_STOCK : registra
    CLIENTES ||--o{ VENTAS : factura_a
    PRODUCTOS ||--o{ ITEMS_PEDIDO : incluye
    PRODUCTOS ||--o{ ITEMS_VENTA : incluye
    PRODUCTOS ||--o{ MOVIMIENTOS_STOCK : afecta
    PEDIDOS ||--o{ ITEMS_PEDIDO : contiene
    VENTAS ||--o{ ITEMS_VENTA : compone

    USUARIOS {
        uuid id PK
        varchar email
        varchar nombre
        varchar rol
        timestamp creado_en
    }
    PRODUCTOS {
        uuid id PK
        varchar titulo
        decimal precio
        int stock
        varchar genero
        varchar editorial
        varchar autor
        boolean activo
    }
    CLIENTES {
        uuid id PK
        uuid usuario_id FK
        varchar nombre
        varchar email
        text direccion
    }
    PROVEEDORES {
        uuid id PK
        varchar nombre
        varchar contacto
        varchar email
    }
    PEDIDOS {
        uuid id PK
        uuid usuario_id FK
        varchar estado
        decimal total
        timestamp creado_en
    }
    ITEMS_PEDIDO {
        uuid id PK
        uuid pedido_id FK
        uuid producto_id FK
        int cantidad
        decimal precio
    }
    VENTAS {
        uuid id PK
        uuid vendedor_id FK
        uuid cliente_id FK
        decimal total
        varchar estado
        timestamp creado_en
    }
    ITEMS_VENTA {
        uuid id PK
        uuid venta_id FK
        uuid producto_id FK
        int cantidad
        decimal precio
    }
    MOVIMIENTOS_STOCK {
        uuid id PK
        uuid producto_id FK
        uuid usuario_id FK
        varchar tipo
        int cantidad
        text motivo
    }
    SOLICITUDES_MANGA {
        uuid id PK
        uuid usuario_id FK
        varchar titulo_solicitado
        varchar estado
    }
```

---

## 2. Casos de Uso — Autenticación y Enrutamiento por Rol

```mermaid
flowchart TD
    Inicio[Usuario ingresa a la App] --> Login[Pantalla Login / Registro]
    Login --> AuthCheck{Credenciales válidas?}
    AuthCheck -- No --> ErrorMsg[Mostrar error contextual]
    ErrorMsg --> Login
    AuthCheck -- Sí --> Token[Generar JWT en Supabase Auth]
    Token --> LeerRol[Consultar rol en tabla 'usuarios']
    LeerRol --> Evaluador{¿Qué rol posee?}
    Evaluador -- 'cliente' --> StackC[PilaCliente: Catálogo, Carrito, Pedidos, IA]
    Evaluador -- 'vendedor' --> StackV[PilaVendedor: Punto de Venta POS, Clientes]
    Evaluador -- 'deposito' --> StackD[PilaDeposito: Stock, Movimientos, Proveedores]
    Evaluador -- 'admin' --> StackA[PilaAdmin: CRUD Total, Reportes IA, Roles]
```

---

## 3. Diagrama de Actividades — Registro de Datos (Venta en Mostrador)

```mermaid
flowchart TD
    Start([Inicio]) --> AbrirVenta[Vendedor ingresa a 'Nueva Venta']
    AbrirVenta --> SelecCliente[Selecciona Cliente o Consumidor Final]
    SelecCliente --> SumarItems[Agrega mangas y cantidades al carrito]
    SumarItems --> ValidacionStock{¿Hay stock suficiente en góndola?}
    ValidacionStock -- No --> AlertaStock[Alerta de stock insuficiente]
    AlertaStock --> SumarItems
    ValidacionStock -- Sí --> Confirmar[Presiona 'Confirmar Venta']
    Confirmar --> RPC[Llamada a RPC 'crear_venta' en PostgreSQL]
    RPC --> Transaccion{¿Transacción atómica exitosa?}
    Transaccion -- No --> ErrorRollback[Error SQL y Rollback automático]
    Transaccion -- Sí --> Commit[Descuento de stock + Inserción de venta + Movimiento]
    Commit --> Exito[Alerta de venta exitosa y reseteo de pantalla]
    Exito --> End([Fin])
```

---

## 4. Diagrama de Componentes de la Arquitectura

```mermaid
flowchart LR
    App[App.js] --> CtxAuth[ContextoAuth.js]
    App --> CtxCart[ContextoCarrito.js]
    App --> NavApp[NavegadorApp.js]

    NavApp --> PilaAuth[PilaAuth]
    NavApp --> PilaCliente[PilaCliente]
    NavApp --> PilaVendedor[PilaVendedor]
    NavApp --> PilaDeposito[PilaDeposito]
    NavApp --> PilaAdmin[PilaAdmin]

    PilaCliente --> ServP[Servicios: productos, pedidos, ia]
    PilaVendedor --> ServV[Servicios: ventas, clientes, productos]
    PilaDeposito --> ServD[Servicios: stock, proveedores, productos]
    PilaAdmin --> ServA[Servicios: productos, usuarios, reportes, ia]

    ServP --> Supabase[(Supabase Client)]
    ServV --> Supabase
    ServD --> Supabase
    ServA --> Supabase

    Supabase --> PG[(PostgreSQL Database + RLS)]
    Supabase --> GeminiAPI[Google Gemini AI Engine]
```
