import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
  Modal, useWindowDimensions,
} from 'react-native';
import { supabase } from '../../config/supabase';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';
import { Alert } from '../../utils/alertas';
import Icono from '../../components/Icono';
import Etiqueta from '../../components/Etiqueta';
import EncabezadoPantalla from '../../components/EncabezadoPantalla';

const ROLES = ['cliente', 'admin', 'vendedor', 'deposito'];
const VARIANTE_ROL = {
  cliente: 'neutro',
  admin: 'primario',
  vendedor: 'acentoSuave',
  deposito: 'exito',
};

export default function UsuariosAdminScreen() {
  const [users, setUsers] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const { width } = useWindowDimensions();
  const columnas = width < 768 ? 1 : width < 1024 ? 2 : 3;
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1360);

  const load = useCallback(async () => {
    setCargando(true);
    try {
      const {
        data,
        error
      } = await supabase.from('usuarios').select('*').order('creado_en', {
        ascending: false
      });
      if (error) throw error;
      setUsers(data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setCargando(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const changeRole = async (role) => {
    try {
      const { error } = await supabase.rpc('cambiar_rol_usuario', {
        p_usuario_id: usuarioSeleccionado.id,
        p_rol: role,
      });
      if (error) throw error;
      setUsuarioSeleccionado(null);
      await load();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };
  const filas = Math.ceil(users.length / columnas);

  return <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <EncabezadoPantalla
          kicker="EQUIPO"
          titulo="Usuarios"
          descripcion="Administrá las cuentas y los roles de acceso."
          estilo={styles.encabezado}
        />
        <ScrollView
          style={styles.lista}
          contentContainerStyle={styles.contenidoLista}
          showsVerticalScrollIndicator
          refreshControl={
            <RefreshControl refreshing={cargando} onRefresh={load} tintColor={COLORES.primario} />
          }
        >
          {users.length > 0 ? (
            Array.from({ length: filas }, (_, indiceFila) => (
              <View key={`fila-${indiceFila}`} style={styles.fila}>
                {users
                  .slice(indiceFila * columnas, (indiceFila + 1) * columnas)
                  .map((item) => (
                    <View key={item.id} style={[styles.celda, { width: `${100 / columnas}%` }]}>
                      <View style={styles.card}>
                        <View style={styles.cardCabecera}>
                          <View style={styles.avatar}>
                            <Text style={styles.avatarTexto}>
                              {(item.nombre || item.email || '?').charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <Etiqueta
                            texto={item.rol}
                            variante={VARIANTE_ROL[item.rol] || 'neutro'}
                          />
                        </View>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {item.nombre || 'Sin nombre'}
                        </Text>
                        <Text style={styles.cardText} numberOfLines={1}>{item.email}</Text>
                        <TouchableOpacity style={styles.btnRol} onPress={() => setUsuarioSeleccionado(item)}>
                          <Icono nombre="shield-checkmark-outline" tamaño={15} color={COLORES.primario} />
                          <Text style={styles.btnRolTexto}>Cambiar rol</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
              </View>
            ))
          ) : (
            <View style={styles.vacio}>
              <View style={styles.vacioIcono}>
                <Icono nombre={cargando ? 'people' : 'search'} tamaño={34} color={COLORES.primarioClaro} />
              </View>
              <Text style={styles.vacioTexto}>
                {cargando ? 'Cargando usuarios…' : 'No hay usuarios registrados.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      <Modal
        visible={Boolean(usuarioSeleccionado)}
        transparent
        animationType="fade"
        onRequestClose={() => setUsuarioSeleccionado(null)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modal}>
            <View style={styles.modalCabecera}>
              <Icono nombre="shield-checkmark" tamaño={22} color={COLORES.primario} />
              <Text style={styles.modalTitulo}>Cambiar rol</Text>
            </View>
            <Text style={styles.modalTexto} numberOfLines={1}>
              {usuarioSeleccionado?.email}
            </Text>
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.opcionRol,
                  usuarioSeleccionado?.rol === role && styles.opcionRolActual,
                ]}
                onPress={() => changeRole(role)}
              >
                <Etiqueta texto={role} variante={VARIANTE_ROL[role] || 'neutro'} />
                {usuarioSeleccionado?.rol === role && (
                  <Icono nombre="checkmark-circle" tamaño={18} color={COLORES.exito} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelar} onPress={() => setUsuarioSeleccionado(null)}>
              <Text style={styles.cancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: ESPACIADO.lg,
  },
  encabezado: {
    marginBottom: ESPACIADO.md,
  },
  lista: {
    flex: 1,
    minHeight: 0,
  },
  contenidoLista: {
    paddingBottom: ESPACIADO.xl,
  },
  fila: {
    flexDirection: 'row',
    gap: ESPACIADO.md,
  },
  celda: {
    marginBottom: ESPACIADO.md,
  },
  card: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.md,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.sm,
  },
  cardCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: RADIO.completo,
    backgroundColor: COLORES.primarioTinte,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: COLORES.primario,
    fontFamily: FUENTES.extrabold,
    fontSize: 16,
  },
  cardTitle: {
    color: COLORES.texto,
    fontFamily: FUENTES.bold,
    fontSize: 15,
  },
  cardText: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 13,
    marginTop: 2,
  },
  btnRol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORES.primarioTinte,
    borderRadius: RADIO.md,
    paddingVertical: ESPACIADO.sm,
    marginTop: ESPACIADO.sm,
  },
  btnRolTexto: {
    color: COLORES.primario,
    fontFamily: FUENTES.bold,
    fontSize: 13,
  },
  vacio: {
    alignItems: 'center',
    paddingVertical: ESPACIADO.xxl,
  },
  vacioIcono: {
    width: 72,
    height: 72,
    borderRadius: RADIO.completo,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  vacioTexto: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 14,
    textAlign: 'center',
  },
  modalFondo: {
    flex: 1,
    justifyContent: 'center',
    padding: ESPACIADO.lg,
    backgroundColor: COLORES.overlay,
  },
  modal: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    padding: ESPACIADO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.lg,
  },
  modalCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.xs,
  },
  modalTitulo: {
    color: COLORES.texto,
    fontSize: 22,
    fontFamily: FUENTES.display,
    letterSpacing: 0.4,
  },
  modalTexto: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 13,
    marginBottom: ESPACIADO.md,
  },
  opcionRol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ESPACIADO.sm + 2,
    paddingHorizontal: ESPACIADO.md,
    marginBottom: ESPACIADO.xs,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    backgroundColor: COLORES.fondo,
  },
  opcionRolActual: {
    borderColor: COLORES.exito,
    backgroundColor: COLORES.exitoClaro,
  },
  cancelar: {
    alignItems: 'center',
    paddingTop: ESPACIADO.md,
  },
  cancelarTexto: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.bold,
    fontSize: 14,
  },
});
