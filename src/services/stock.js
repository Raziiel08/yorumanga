import { supabase } from "../config/supabase";
export const stockService = {
  async getMovements(productId) {
    let query = supabase
      .from("movimientos_stock")
      .select("*, product:productos(*), user:usuarios(*)")
      .order("creado_en", {
        ascending: false,
      });
    if (productId) query = query.eq("producto_id", productId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async registerEntry(productId, cantidad, motivo) {
    if (cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");
    const { data, error } = await supabase.rpc("registrar_movimiento_stock", {
      p_producto_id: productId,
      p_tipo: "entrada",
      p_cantidad: cantidad,
      p_motivo: motivo,
    });
    if (error) throw error;
    return data;
  },
  async registerExit(productId, cantidad, motivo) {
    if (cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");
    const { data, error } = await supabase.rpc("registrar_movimiento_stock", {
      p_producto_id: productId,
      p_tipo: "salida",
      p_cantidad: cantidad,
      p_motivo: motivo,
    });
    if (error) throw error;
    return data;
  },
};
