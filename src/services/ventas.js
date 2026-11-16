import { supabase } from '../config/supabase';
export const salesService = {
  async getAll() {
    const {
      data,
      error
    } = await supabase.from('ventas').select('*, vendedor:usuarios(*), cliente:clientes(*), items:items_venta(*, product:productos(*))').order('creado_en', {
      ascending: false
    });
    if (error) throw error;
    return data;
  },
  async getById(id) {
    const {
      data,
      error
    } = await supabase.from('ventas').select('*, vendedor:usuarios(*), cliente:clientes(*), items:items_venta(*, product:productos(*))').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async createSale(clienteId, items) {
    if (items.length === 0) throw new Error('El carrito está vacío');
    const {
      data,
      error
    } = await supabase.rpc('crear_venta', {
      p_cliente_id: clienteId,
      p_items: items.map((item) => ({
        producto_id: item.product.id,
        cantidad: item.cantidad
      }))
    });
    if (error) throw error;
    return data;
  },
  async cancelSale(id) {
    const {
      data,
      error
    } = await supabase.rpc('anular_venta', {
      p_venta_id: id
    });
    if (error) throw error;
    return data;
  }
};