import { supabase } from "../config/supabase";
export const suppliersService = {
  async getAll() {
    const { data, error } = await supabase
      .from("proveedores")
      .select("*")
      .order("creado_en", {
        ascending: false,
      });
    if (error) throw error;
    return data;
  },
  async getById(id) {
    const { data, error } = await supabase
      .from("proveedores")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
  async create(supplier) {
    const { data, error } = await supabase
      .from("proveedores")
      .insert([supplier])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async update(id, updates) {
    const { data, error } = await supabase
      .from("proveedores")
      .update({
        ...updates,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async remove(id) {
    const { error } = await supabase.from("proveedores").delete().eq("id", id);
    if (error) throw error;
  },
};
