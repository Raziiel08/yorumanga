import { supabase } from "../config/supabase";
export const ordersService = {
  async getAll() {
    const { data, error } = await supabase
      .from("pedidos")
      .select(
        "*, user:usuarios(*), items:items_pedido(*, product:productos(*))",
      )
      .order("creado_en", {
        ascending: false,
      });
    if (error) throw error;
    return data;
  },
  async getByUser(userId) {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*, items:items_pedido(*, product:productos(*))")
      .eq("usuario_id", userId)
      .order("creado_en", {
        ascending: false,
      });
    if (error) throw error;
    return data;
  },
  async createOrder(items) {
    if (items.length === 0) throw new Error("El carrito está vacío");
    const { data, error } = await supabase.rpc("crear_pedido", {
      p_items: items.map((item) => ({
        producto_id: item.product.id,
        cantidad: item.cantidad,
      })),
    });
    if (error?.code === "PGRST202") {
      throw new Error(
        "Supabase no encuentra crear_pedido. Ejecutá supabase/SQL_SETUP.sql en el proyecto y volvé a intentar.",
      );
    }
    if (error) throw error;
    return data;
  },
  async updateStatus(id, estado) {
    const { data, error } = await supabase.rpc("actualizar_estado_pedido", {
      p_pedido_id: id,
      p_estado: estado,
    });
    if (error) throw error;
    return data;
  },
};
