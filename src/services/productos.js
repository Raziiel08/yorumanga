import { supabase } from "../config/supabase";
export const productsService = {
  async getAll(activeOnly = false) {
    let query = supabase.from("productos").select("*").order("creado_en", {
      ascending: false,
    });
    if (activeOnly) query = query.eq("activo", true);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async getById(id) {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
  async getBestSelling(limit = 8) {
    const { data, error } = await supabase.rpc("productos_mas_vendidos", {
      p_limite: limit,
    });
    if (error) throw error;
    return data;
  },
  async create(product) {
    const { data, error } = await supabase.rpc("crear_producto", {
      p_titulo: product.titulo,
      p_imagen: product.imagen || null,
      p_precio: product.precio,
      p_stock: 0,
      p_genero: product.genero,
      p_editorial: product.editorial || null,
      p_descripcion: product.descripcion || null,
      p_activo: product.activo ?? true,
      p_autor: product.autor || null,
      p_precio_anterior: product.precio_anterior ?? null,
      p_destacado: product.destacado ?? false,
    });
    if (error?.code === "PGRST202") {
      throw new Error(
        "Supabase no encuentra crear_producto. Ejecutá supabase/SQL_SETUP.sql en el proyecto y volvé a intentar.",
      );
    }
    if (error) throw error;
    return this.getById(data);
  },
  async update(id, updates) {
    if (Object.prototype.hasOwnProperty.call(updates, "stock")) {
      throw new Error("El stock solo se modifica desde Movimientos de stock");
    }
    const { data, error } = await supabase
      .from("productos")
      .update({
        ...updates,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async remove(id) {
    return this.update(id, { activo: false });
  },
};
