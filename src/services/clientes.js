import { supabase } from '../config/supabase';
export const clientsService = {
  async getAll() {
    const {
      data,
      error
    } = await supabase.from('clientes').select('*').order('creado_en', {
      ascending: false
    });
    if (error) throw error;
    return data;
  },
  async getById(id) {
    const {
      data,
      error
    } = await supabase.from('clientes').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(client) {
    const {
      data,
      error
    } = await supabase.from('clientes').insert([client]).select().single();
    if (error) throw error;
    return data;
  },
  async update(id, updates) {
    const {
      data,
      error
    } = await supabase.from('clientes').update({
      ...updates,
      actualizado_en: new Date().toISOString()
    }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async remove(id) {
    const {
      error
    } = await supabase.from('clientes').delete().eq('id', id);
    if (error) throw error;
  }
};