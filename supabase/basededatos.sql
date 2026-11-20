CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(100),

  rol VARCHAR(20) NOT NULL DEFAULT 'cliente'
    CHECK (rol IN ('cliente','admin','vendedor','deposito')),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  imagen TEXT,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  genero VARCHAR(100) NOT NULL,
  editorial VARCHAR(100),
  autor VARCHAR(150),
  descripcion TEXT,
  precio_anterior DECIMAL(10,2),
  destacado BOOLEAN NOT NULL DEFAULT FALSE,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS autor VARCHAR(150);
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS precio_anterior DECIMAL(10,2);
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS destacado BOOLEAN NOT NULL DEFAULT FALSE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'productos_precio_anterior_check'
      AND conrelid = 'public.productos'::regclass
  ) THEN
    ALTER TABLE public.productos
      ADD CONSTRAINT productos_precio_anterior_check
      CHECK (precio_anterior IS NULL OR precio_anterior > precio);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(255),

  direccion TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.proveedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(150) NOT NULL,
  contacto VARCHAR(150),

  email VARCHAR(255),
  direccion TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente','en_proceso','completado','cancelado')),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.items_pedido (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0)
);

CREATE TABLE IF NOT EXISTS public.solicitudes_manga (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  titulo_solicitado VARCHAR(255) NOT NULL,
  observaciones TEXT,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente','visto','agregado')),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.movimientos_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada','salida','ajuste')),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  motivo TEXT,
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendedor_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'completada' CHECK (estado IN ('completada','anulada')),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.items_venta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venta_id UUID NOT NULL REFERENCES public.ventas(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0)
);

DROP POLICY IF EXISTS "users_select_own" ON public.usuarios;
DROP POLICY IF EXISTS "users_update_own" ON public.usuarios;
DROP POLICY IF EXISTS "users_insert_own" ON public.usuarios;
DROP POLICY IF EXISTS "admin_manage_users" ON public.usuarios;
DROP POLICY IF EXISTS "products_select_auth" ON public.productos;
DROP POLICY IF EXISTS "products_insert_staff" ON public.productos;
DROP POLICY IF EXISTS "products_update_staff" ON public.productos;
DROP POLICY IF EXISTS "products_update_catalog" ON public.productos;
DROP POLICY IF EXISTS "products_delete_admin" ON public.productos;
DROP POLICY IF EXISTS "clients_select_staff" ON public.clientes;
DROP POLICY IF EXISTS "clients_insert_staff" ON public.clientes;
DROP POLICY IF EXISTS "clients_update_staff" ON public.clientes;
DROP POLICY IF EXISTS "clients_delete_admin" ON public.clientes;
DROP POLICY IF EXISTS "suppliers_select_staff" ON public.proveedores;
DROP POLICY IF EXISTS "suppliers_manage_admin" ON public.proveedores;
DROP POLICY IF EXISTS "suppliers_manage_staff" ON public.proveedores;
DROP POLICY IF EXISTS "orders_select_own_or_staff" ON public.pedidos;
DROP POLICY IF EXISTS "orders_insert_own" ON public.pedidos;
DROP POLICY IF EXISTS "orders_update_staff" ON public.pedidos;
DROP POLICY IF EXISTS "order_items_select" ON public.items_pedido;
DROP POLICY IF EXISTS "order_items_insert_own" ON public.items_pedido;
DROP POLICY IF EXISTS "requests_select_own_or_staff" ON public.solicitudes_manga;
DROP POLICY IF EXISTS "requests_insert_own" ON public.solicitudes_manga;
DROP POLICY IF EXISTS "requests_update_staff" ON public.solicitudes_manga;
DROP POLICY IF EXISTS "stock_select_staff" ON public.movimientos_stock;
DROP POLICY IF EXISTS "stock_insert_staff" ON public.movimientos_stock;
DROP POLICY IF EXISTS "sales_select_staff" ON public.ventas;
DROP POLICY IF EXISTS "sales_insert_vendedor" ON public.ventas;
DROP POLICY IF EXISTS "sales_update_admin" ON public.ventas;
DROP POLICY IF EXISTS "sale_items_select" ON public.items_venta;
DROP POLICY IF EXISTS "sale_items_insert" ON public.items_venta;

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_manga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_venta ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.rol_actual() RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT u.rol FROM public.usuarios AS u WHERE u.id = auth.uid();
$$;

CREATE POLICY "users_select_own" ON public.usuarios FOR SELECT USING (auth.uid() = id OR public.rol_actual() IN ('admin'));
CREATE POLICY "users_update_own" ON public.usuarios FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "products_select_auth" ON public.productos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "products_update_catalog" ON public.productos FOR UPDATE
  USING (public.rol_actual() IN ('admin','deposito'))
  WITH CHECK (public.rol_actual() IN ('admin','deposito'));
CREATE POLICY "products_delete_admin" ON public.productos FOR DELETE USING (public.rol_actual() = 'admin');

CREATE POLICY "clients_select_staff" ON public.clientes FOR SELECT USING (public.rol_actual() IN ('admin','vendedor'));
CREATE POLICY "clients_insert_staff" ON public.clientes FOR INSERT WITH CHECK (public.rol_actual() IN ('admin','vendedor'));
CREATE POLICY "clients_update_staff" ON public.clientes FOR UPDATE USING (public.rol_actual() IN ('admin','vendedor'));
CREATE POLICY "clients_delete_admin" ON public.clientes FOR DELETE USING (public.rol_actual() = 'admin');

CREATE POLICY "suppliers_select_staff" ON public.proveedores FOR SELECT USING (public.rol_actual() IN ('admin','deposito'));
CREATE POLICY "suppliers_manage_staff" ON public.proveedores FOR ALL
  USING (public.rol_actual() IN ('admin','deposito'))
  WITH CHECK (public.rol_actual() IN ('admin','deposito'));

CREATE POLICY "orders_select_own_or_staff" ON public.pedidos FOR SELECT USING (
  auth.uid() = usuario_id OR public.rol_actual() IN ('admin','vendedor')
);

CREATE POLICY "order_items_select" ON public.items_pedido FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pedidos o WHERE o.id = items_pedido.pedido_id AND (o.usuario_id = auth.uid() OR public.rol_actual() IN ('admin','vendedor')))
);

CREATE POLICY "requests_select_own_or_staff" ON public.solicitudes_manga FOR SELECT USING (
  auth.uid() = usuario_id OR public.rol_actual() IN ('admin')
);
CREATE POLICY "requests_insert_own" ON public.solicitudes_manga FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "requests_update_staff" ON public.solicitudes_manga FOR UPDATE USING (public.rol_actual() = 'admin');

CREATE POLICY "stock_select_staff" ON public.movimientos_stock FOR SELECT USING (public.rol_actual() IN ('admin','deposito','vendedor'));

CREATE POLICY "sales_select_staff" ON public.ventas FOR SELECT USING (public.rol_actual() IN ('admin','vendedor'));

CREATE POLICY "sale_items_select" ON public.items_venta FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.ventas s WHERE s.id = items_venta.venta_id AND public.rol_actual() IN ('admin','vendedor'))
);

REVOKE INSERT, UPDATE, DELETE ON public.usuarios FROM anon, authenticated;
GRANT UPDATE (nombre) ON public.usuarios TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.productos FROM anon, authenticated;
GRANT UPDATE (titulo, imagen, precio, genero, editorial, autor, descripcion, precio_anterior, destacado, activo)
  ON public.productos TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.pedidos FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.items_pedido FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.ventas FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.items_venta FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.movimientos_stock FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.cambiar_rol_usuario(p_usuario_id UUID, p_rol TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL OR COALESCE(public.rol_actual(), '') <> 'admin' THEN
    RAISE EXCEPTION 'No autorizado para cambiar roles' USING ERRCODE = '42501';
  END IF;
  IF p_rol IS NULL OR p_rol NOT IN ('cliente', 'admin', 'vendedor', 'deposito') THEN
    RAISE EXCEPTION 'Rol no válido';
  END IF;
  UPDATE public.usuarios SET rol = p_rol WHERE id = p_usuario_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;
END;
$$;

DROP FUNCTION IF EXISTS public.crear_producto(TEXT, TEXT, NUMERIC, INTEGER, TEXT, TEXT, TEXT, BOOLEAN);
CREATE OR REPLACE FUNCTION public.crear_producto(
  p_titulo TEXT,
  p_imagen TEXT,
  p_precio NUMERIC,
  p_stock INTEGER,
  p_genero TEXT,
  p_editorial TEXT,
  p_descripcion TEXT,
  p_activo BOOLEAN DEFAULT TRUE,
  p_autor TEXT DEFAULT NULL,
  p_precio_anterior NUMERIC DEFAULT NULL,
  p_destacado BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_producto_id UUID;
BEGIN
  IF auth.uid() IS NULL OR COALESCE(public.rol_actual(), '') NOT IN ('admin', 'deposito') THEN
    RAISE EXCEPTION 'No autorizado para crear productos' USING ERRCODE = '42501';
  END IF;
  IF p_titulo IS NULL OR length(trim(p_titulo)) = 0 OR p_genero IS NULL OR length(trim(p_genero)) = 0
    OR p_precio IS NULL OR p_precio < 0 OR p_stock IS NULL OR p_stock < 0 THEN
    RAISE EXCEPTION 'Datos de producto no válidos';
  END IF;
  IF p_precio_anterior IS NOT NULL AND p_precio_anterior <= p_precio THEN
    RAISE EXCEPTION 'El precio anterior debe ser mayor que el precio actual';
  END IF;

  INSERT INTO public.productos (
    titulo, imagen, precio, stock, genero, editorial, autor, descripcion,
    precio_anterior, destacado, activo
  )
  VALUES (
    trim(p_titulo), p_imagen, p_precio, 0, trim(p_genero), p_editorial,
    NULLIF(trim(p_autor), ''), p_descripcion, p_precio_anterior,
    COALESCE(p_destacado, FALSE), COALESCE(p_activo, TRUE)
  )
  RETURNING id INTO v_producto_id;

  IF p_stock > 0 THEN
    UPDATE public.productos SET stock = p_stock WHERE id = v_producto_id;
    INSERT INTO public.movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
    VALUES (v_producto_id, 'entrada', p_stock, 'Stock inicial', auth.uid());
  END IF;
  RETURN v_producto_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.productos_mas_vendidos(p_limite INTEGER DEFAULT 8)
RETURNS SETOF public.productos
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Debés iniciar sesión para consultar el catálogo' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  WITH unidades AS (
    SELECT item.producto_id, SUM(item.cantidad)::BIGINT AS cantidad
    FROM public.items_venta AS item
    JOIN public.ventas AS venta ON venta.id = item.venta_id
    WHERE venta.estado = 'completada'
    GROUP BY item.producto_id
    UNION ALL
    SELECT item.producto_id, SUM(item.cantidad)::BIGINT AS cantidad
    FROM public.items_pedido AS item
    JOIN public.pedidos AS pedido ON pedido.id = item.pedido_id
    WHERE pedido.estado = 'completado'
    GROUP BY item.producto_id
  ),
  totales AS (
    SELECT producto_id, SUM(cantidad)::BIGINT AS cantidad
    FROM unidades
    GROUP BY producto_id
  )
  SELECT producto.*
  FROM public.productos AS producto
  JOIN totales ON totales.producto_id = producto.id
  WHERE producto.activo = TRUE
  ORDER BY totales.cantidad DESC, producto.creado_en DESC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limite, 8), 12));
END;
$$;

CREATE OR REPLACE FUNCTION public.registrar_movimiento_stock(
  p_producto_id UUID,
  p_tipo TEXT,
  p_cantidad INTEGER,
  p_motivo TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_stock INTEGER;
  v_nuevo_stock INTEGER;
BEGIN
  IF auth.uid() IS NULL OR COALESCE(public.rol_actual(), '') NOT IN ('admin', 'deposito') THEN
    RAISE EXCEPTION 'No autorizado para modificar stock' USING ERRCODE = '42501';
  END IF;
  IF p_tipo IS NULL OR p_tipo NOT IN ('entrada', 'salida') OR p_cantidad IS NULL OR p_cantidad <= 0
    OR p_motivo IS NULL OR length(trim(p_motivo)) = 0 THEN
    RAISE EXCEPTION 'Movimiento de stock no válido';
  END IF;

  SELECT stock INTO v_stock FROM public.productos WHERE id = p_producto_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto no encontrado';
  END IF;
  IF p_tipo = 'salida' AND v_stock < p_cantidad THEN
    RAISE EXCEPTION 'Stock insuficiente';
  END IF;

  v_nuevo_stock := CASE WHEN p_tipo = 'entrada' THEN v_stock + p_cantidad ELSE v_stock - p_cantidad END;
  UPDATE public.productos SET stock = v_nuevo_stock WHERE id = p_producto_id;
  INSERT INTO public.movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
  VALUES (p_producto_id, p_tipo, p_cantidad, trim(p_motivo), auth.uid());
  RETURN v_nuevo_stock;
END;
$$;

CREATE OR REPLACE FUNCTION public.crear_pedido(p_items JSONB)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_item RECORD;
  v_producto public.productos%ROWTYPE;
  v_precio NUMERIC(10, 2);
  v_pedido_id UUID;
  v_total NUMERIC(10, 2) := 0;
BEGIN
  IF auth.uid() IS NULL OR COALESCE(public.rol_actual(), '') <> 'cliente' THEN
    RAISE EXCEPTION 'Solo un cliente autenticado puede crear pedidos' USING ERRCODE = '42501';
  END IF;
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'El pedido debe incluir productos';
  END IF;

  FOR v_item IN
    SELECT x.producto_id, sum(x.cantidad)::BIGINT AS cantidad
    FROM jsonb_to_recordset(p_items) AS x(producto_id UUID, cantidad INTEGER)
    GROUP BY x.producto_id
    ORDER BY x.producto_id
  LOOP
    IF v_item.producto_id IS NULL OR v_item.cantidad IS NULL OR v_item.cantidad <= 0 THEN
      RAISE EXCEPTION 'Cantidad o producto no válido';
    END IF;
    SELECT * INTO v_producto FROM public.productos WHERE id = v_item.producto_id FOR UPDATE;
    IF NOT FOUND OR NOT COALESCE(v_producto.activo, FALSE) THEN
      RAISE EXCEPTION 'Producto no disponible';
    END IF;
    IF v_producto.stock < v_item.cantidad THEN
      RAISE EXCEPTION 'Stock insuficiente para %', v_producto.titulo;
    END IF;
    v_total := v_total + v_producto.precio * v_item.cantidad;
  END LOOP;

  INSERT INTO public.pedidos (usuario_id, estado, total)
  VALUES (auth.uid(), 'pendiente', v_total)
  RETURNING id INTO v_pedido_id;

  FOR v_item IN
    SELECT x.producto_id, sum(x.cantidad)::INTEGER AS cantidad
    FROM jsonb_to_recordset(p_items) AS x(producto_id UUID, cantidad INTEGER)
    GROUP BY x.producto_id
    ORDER BY x.producto_id
  LOOP
    SELECT precio INTO v_precio FROM public.productos WHERE id = v_item.producto_id;
    INSERT INTO public.items_pedido (pedido_id, producto_id, cantidad, precio)
    VALUES (v_pedido_id, v_item.producto_id, v_item.cantidad, v_precio);
    UPDATE public.productos SET stock = stock - v_item.cantidad WHERE id = v_item.producto_id;
    INSERT INTO public.movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
    VALUES (v_item.producto_id, 'salida', v_item.cantidad, 'Reserva pedido ' || v_pedido_id, auth.uid());
  END LOOP;
  RETURN v_pedido_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.crear_venta(p_cliente_id UUID, p_items JSONB)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_item RECORD;
  v_producto public.productos%ROWTYPE;
  v_precio NUMERIC(10, 2);
  v_venta_id UUID;
  v_total NUMERIC(10, 2) := 0;
BEGIN
  IF auth.uid() IS NULL OR COALESCE(public.rol_actual(), '') NOT IN ('admin', 'vendedor') THEN
    RAISE EXCEPTION 'Solo el personal autorizado puede registrar ventas' USING ERRCODE = '42501';
  END IF;
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'La venta debe incluir productos';
  END IF;
  IF p_cliente_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.clientes WHERE id = p_cliente_id) THEN
    RAISE EXCEPTION 'Cliente no encontrado';
  END IF;

  FOR v_item IN
    SELECT x.producto_id, sum(x.cantidad)::BIGINT AS cantidad
    FROM jsonb_to_recordset(p_items) AS x(producto_id UUID, cantidad INTEGER)
    GROUP BY x.producto_id
    ORDER BY x.producto_id
  LOOP
    IF v_item.producto_id IS NULL OR v_item.cantidad IS NULL OR v_item.cantidad <= 0 THEN
      RAISE EXCEPTION 'Cantidad o producto no válido';
    END IF;
    SELECT * INTO v_producto FROM public.productos WHERE id = v_item.producto_id FOR UPDATE;
    IF NOT FOUND OR NOT COALESCE(v_producto.activo, FALSE) THEN
      RAISE EXCEPTION 'Producto no disponible';
    END IF;
    IF v_producto.stock < v_item.cantidad THEN
      RAISE EXCEPTION 'Stock insuficiente para %', v_producto.titulo;
    END IF;
    v_total := v_total + v_producto.precio * v_item.cantidad;
  END LOOP;

  INSERT INTO public.ventas (vendedor_id, cliente_id, total, estado)
  VALUES (auth.uid(), p_cliente_id, v_total, 'completada')
  RETURNING id INTO v_venta_id;

  FOR v_item IN
    SELECT x.producto_id, sum(x.cantidad)::INTEGER AS cantidad
    FROM jsonb_to_recordset(p_items) AS x(producto_id UUID, cantidad INTEGER)
    GROUP BY x.producto_id
    ORDER BY x.producto_id
  LOOP
    SELECT precio INTO v_precio FROM public.productos WHERE id = v_item.producto_id;
    INSERT INTO public.items_venta (venta_id, producto_id, cantidad, precio)
    VALUES (v_venta_id, v_item.producto_id, v_item.cantidad, v_precio);
    UPDATE public.productos SET stock = stock - v_item.cantidad WHERE id = v_item.producto_id;
    INSERT INTO public.movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
    VALUES (v_item.producto_id, 'salida', v_item.cantidad, 'Venta ' || v_venta_id, auth.uid());
  END LOOP;
  RETURN v_venta_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.anular_venta(p_venta_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_venta public.ventas%ROWTYPE;
  v_item RECORD;
BEGIN
  IF auth.uid() IS NULL OR COALESCE(public.rol_actual(), '') <> 'admin' THEN
    RAISE EXCEPTION 'Solo un administrador puede anular ventas' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_venta FROM public.ventas WHERE id = p_venta_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Venta no encontrada';
  END IF;
  IF v_venta.estado = 'anulada' THEN
    RAISE EXCEPTION 'La venta ya está anulada';
  END IF;

  FOR v_item IN
    SELECT producto_id, cantidad FROM public.items_venta
    WHERE venta_id = p_venta_id ORDER BY producto_id
  LOOP
    UPDATE public.productos SET stock = stock + v_item.cantidad WHERE id = v_item.producto_id;
    INSERT INTO public.movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
    VALUES (v_item.producto_id, 'entrada', v_item.cantidad, 'Anulación venta ' || p_venta_id, auth.uid());
  END LOOP;
  UPDATE public.ventas SET estado = 'anulada' WHERE id = p_venta_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.actualizar_estado_pedido(p_pedido_id UUID, p_estado TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_pedido public.pedidos%ROWTYPE;
  v_item RECORD;
BEGIN
  IF auth.uid() IS NULL OR COALESCE(public.rol_actual(), '') NOT IN ('admin', 'vendedor') THEN
    RAISE EXCEPTION 'No autorizado para actualizar pedidos' USING ERRCODE = '42501';
  END IF;
  IF p_estado IS NULL OR p_estado NOT IN ('pendiente', 'en_proceso', 'completado', 'cancelado') THEN
    RAISE EXCEPTION 'Estado de pedido no válido';
  END IF;
  SELECT * INTO v_pedido FROM public.pedidos WHERE id = p_pedido_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pedido no encontrado';
  END IF;
  IF v_pedido.estado IN ('completado', 'cancelado') AND p_estado <> v_pedido.estado THEN
    RAISE EXCEPTION 'Un pedido completado o cancelado no se puede reabrir ni modificar';
  END IF;

  IF p_estado = 'cancelado' AND v_pedido.estado <> 'cancelado' THEN
    FOR v_item IN
      SELECT producto_id, cantidad FROM public.items_pedido
      WHERE pedido_id = p_pedido_id ORDER BY producto_id
    LOOP
      UPDATE public.productos SET stock = stock + v_item.cantidad WHERE id = v_item.producto_id;
      INSERT INTO public.movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
      VALUES (v_item.producto_id, 'entrada', v_item.cantidad, 'Cancelación pedido ' || p_pedido_id, auth.uid());
    END LOOP;
  END IF;
  UPDATE public.pedidos SET estado = p_estado WHERE id = p_pedido_id;
END;
$$;

REVOKE ALL ON FUNCTION public.cambiar_rol_usuario(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crear_producto(TEXT, TEXT, NUMERIC, INTEGER, TEXT, TEXT, TEXT, BOOLEAN, TEXT, NUMERIC, BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.productos_mas_vendidos(INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.registrar_movimiento_stock(UUID, TEXT, INTEGER, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crear_pedido(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crear_venta(UUID, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.anular_venta(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.actualizar_estado_pedido(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cambiar_rol_usuario(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crear_producto(TEXT, TEXT, NUMERIC, INTEGER, TEXT, TEXT, TEXT, BOOLEAN, TEXT, NUMERIC, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.productos_mas_vendidos(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.registrar_movimiento_stock(UUID, TEXT, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crear_pedido(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crear_venta(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.anular_venta(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.actualizar_estado_pedido(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.asignar_mi_rol(p_rol TEXT)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autenticado' USING ERRCODE = '42501';
  END IF;
  IF p_rol IS NULL OR p_rol NOT IN ('cliente', 'admin', 'vendedor', 'deposito') THEN
    RAISE EXCEPTION 'Rol no válido';
  END IF;
  UPDATE public.usuarios SET rol = p_rol, actualizado_en = NOW() WHERE id = auth.uid();
  RETURN p_rol;
END;
$$;
GRANT EXECUTE ON FUNCTION public.asignar_mi_rol(TEXT) TO authenticated, anon;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_rol TEXT;
BEGIN
  v_rol := COALESCE(NEW.raw_user_meta_data->>'rol', 'cliente');
  IF v_rol NOT IN ('cliente', 'vendedor', 'deposito', 'admin') THEN
    v_rol := 'cliente';
  END IF;

  INSERT INTO public.usuarios (id, email, nombre, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    v_rol
  )
  ON CONFLICT (id) DO UPDATE
    SET rol = EXCLUDED.rol,
        nombre = EXCLUDED.nombre,
        actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'users_updated_at') THEN
    CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'products_updated_at') THEN
    CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.productos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'clients_updated_at') THEN
    CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'suppliers_updated_at') THEN
    CREATE TRIGGER suppliers_updated_at BEFORE UPDATE ON public.proveedores FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'orders_updated_at') THEN
    CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'manga_requests_updated_at') THEN
    CREATE TRIGGER manga_requests_updated_at BEFORE UPDATE ON public.solicitudes_manga FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

UPDATE public.productos AS producto
SET precio = seed.precio
FROM (VALUES
  ('One Piece Vol. 1', 10500),
  ('Naruto Vol. 1', 10000),
  ('Attack on Titan Vol. 1', 12000),
  ('Death Note Vol. 1', 11000),
  ('My Hero Academia Vol. 1', 11000)
) AS seed(titulo, precio)
WHERE producto.titulo = seed.titulo
  AND producto.precio IS DISTINCT FROM seed.precio;

INSERT INTO public.productos (titulo, precio, stock, genero, editorial, descripcion, activo)
SELECT seed.titulo, seed.precio, seed.stock, seed.genero, seed.editorial, seed.descripcion, TRUE
FROM (VALUES
  ('One Piece Vol. 1', 10500, 15, 'Shounen', 'Planeta', 'El inicio de la aventura de Luffy.'),
  ('Naruto Vol. 1', 10000, 20, 'Shounen', 'Planeta', 'El camino ninja de Naruto.'),
  ('Attack on Titan Vol. 1', 12000, 10, 'Seinen', 'Panini', 'La humanidad contra los titanes.'),
  ('Death Note Vol. 1', 11000, 8, 'Shounen', 'Planeta', 'Una libreta con un poder misterioso.'),
  ('My Hero Academia Vol. 1', 11000, 12, 'Shounen', 'Panini', 'Héroes en formación.'),
  ('Dragon Ball Vol. 1', 9000, 12, 'Shounen', 'Ivrea', 'El inicio del viaje de Goku.'),
  ('Demon Slayer Vol. 1', 10000, 12, 'Shounen', 'Panini', 'Un joven lucha contra demonios.'),
  ('Jujutsu Kaisen Vol. 1', 10500, 10, 'Shounen', 'Ivrea', 'Hechiceros enfrentan maldiciones.'),
  ('Chainsaw Man Vol. 1', 9500, 10, 'Shounen', 'Ivrea', 'Un cazador de demonios cambia su vida.'),
  ('Spy x Family Vol. 1', 10000, 8, 'Comedia', 'Ivrea', 'Una familia oculta identidades.'),
  ('Haikyu!! Vol. 1', 9000, 8, 'Deportes', 'Ivrea', 'Un equipo de vóley busca superarse.'),
  ('Blue Lock Vol. 1', 10500, 8, 'Deportes', 'Ivrea', 'Un proyecto reúne jóvenes delanteros.'),
  ('One-Punch Man Vol. 1', 10000, 10, 'Acción', 'Ivrea', 'Un héroe busca un rival desafiante.'),
  ('Fullmetal Alchemist Vol. 1', 11000, 8, 'Aventura', 'Ivrea', 'Dos hermanos buscan recuperar lo perdido.'),
  ('Berserk Vol. 1', 12000, 5, 'Seinen', 'Panini', 'Un guerrero recorre un mundo oscuro.')
) AS seed(titulo, precio, stock, genero, editorial, descripcion)
WHERE NOT EXISTS (
  SELECT 1 FROM public.productos AS existing WHERE existing.titulo = seed.titulo
);

INSERT INTO public.movimientos_stock (producto_id, tipo, cantidad, motivo)
SELECT p.id, 'entrada', p.stock, 'Stock inicial (demo)'
FROM public.productos AS p
WHERE p.titulo IN (
  'One Piece Vol. 1', 'Naruto Vol. 1', 'Attack on Titan Vol. 1', 'Death Note Vol. 1',
  'My Hero Academia Vol. 1', 'Dragon Ball Vol. 1', 'Demon Slayer Vol. 1',
  'Jujutsu Kaisen Vol. 1', 'Chainsaw Man Vol. 1', 'Spy x Family Vol. 1',
  'Haikyu!! Vol. 1', 'Blue Lock Vol. 1', 'One-Punch Man Vol. 1',
  'Fullmetal Alchemist Vol. 1', 'Berserk Vol. 1'
)
  AND p.stock > 0
  AND NOT EXISTS (
    SELECT 1 FROM public.movimientos_stock AS m
    WHERE m.producto_id = p.id AND m.motivo = 'Stock inicial (demo)'
  );

NOTIFY pgrst, 'reload schema';