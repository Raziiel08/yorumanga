import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { ordersService } from '../../services/pedidos';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';
import { Alert } from '../../utils/alertas';
import { formatearMoneda } from '../../utils/moneda';
import Icono from '../../components/Icono';
import Etiqueta from '../../components/Etiqueta';
import EncabezadoPantalla from '../../components/EncabezadoPantalla';

const ESTADOS = ['pendiente', 'en_proceso', 'completado', 'cancelado'];
const VARIANTE_ESTADO = {
  pendiente: 'advertencia',
  en_proceso: 'info',
  completado: 'exito',
  cancelado: 'error',
};
const NOMBRE_ESTADO = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  completado: 'Completado',
  cancelado: 'Cancelado',
};

export default function PedidosAdminScreen() {
  const [orders, setOrders] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { width } = useWindowDimensions();
  const columnas = width < 768 ? 1 : width < 1024 ? 2 : 3;
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1360);

  const load = useCallback(async () => {
    setCargando(true);
    try {
      setOrders(await ordersService.getAll());
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setCargando(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const changeStatus = order => {
    Alert.alert('Cambiar estado', 'Seleccioná el nuevo estado', ESTADOS.map(e => ({
      text: e,
      onPress: async () => {
        try {
          await ordersService.updateStatus(order.id, e);
          load();
        } catch (err) {
          Alert.alert('Error', err.message);
        }
      }
    })));
  };
  const filas = Math.ceil(orders.length / columnas);

  return <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <EncabezadoPantalla
          kicker="OPERACIONES"
          titulo="Pedidos"
          descripcion="Revisá y procesá los pedidos de los clientes."
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
          {orders.length > 0 ? (
            Array.from({ length: filas }, (_, indiceFila) => (
              <View key={`fila-${indiceFila}`} style={styles.fila}>
                {orders
                  .slice(indiceFila * columnas, (indiceFila + 1) * columnas)
                  .map((item) => (
                    <View key={item.id} style={[styles.celda, { width: `${100 / columnas}%` }]}>
                      <View style={styles.card}>
                        <View style={styles.cardCabecera}>
                          <Text style={styles.cardTitle}>Pedido #{item.id.slice(0, 8)}</Text>
                          <Etiqueta
                            texto={NOMBRE_ESTADO[item.estado] || item.estado}
                            variante={VARIANTE_ESTADO[item.estado] || 'neutro'}
                          />
                        </View>
                        <Text style={styles.cardText} numberOfLines={1}>
                          Cliente: {item.user?.nombre || item.user?.email || item.usuario_id}
                        </Text>
                        <Text style={styles.cardText}>
                          {new Date(item.creado_en).toLocaleString()}
                        </Text>
                        <View style={styles.pieCard}>
                          <Text style={styles.cardPrecio}>{formatearMoneda(item.total)}</Text>
                          {!['completado', 'cancelado'].includes(item.estado) ? (
                            <TouchableOpacity style={styles.btnEstado} onPress={() => changeStatus(item)}>
                              <Icono nombre="swap-horizontal" tamaño={15} color="#FFFFFF" />
                              <Text style={styles.btnEstadoTexto}>Cambiar estado</Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            ))
          ) : (
            <View style={styles.vacio}>
              <View style={styles.vacioIcono}>
                <Icono nombre={cargando ? 'bag-handle' : 'search'} tamaño={34} color={COLORES.primarioClaro} />
              </View>
              <Text style={styles.vacioTexto}>
                {cargando ? 'Cargando pedidos…' : 'No hay pedidos todavía.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
    alignItems: 'flex-start',
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.xs,
  },
  cardTitle: {
    flex: 1,
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
  pieCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    marginTop: ESPACIADO.sm,
    paddingTop: ESPACIADO.sm,
    borderTopWidth: 1,
    borderTopColor: COLORES.bordeSuave,
  },
  cardPrecio: {
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
  },
  btnEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORES.info,
    paddingHorizontal: ESPACIADO.sm + 2,
    paddingVertical: ESPACIADO.xs + 2,
    borderRadius: RADIO.completo,
  },
  btnEstadoTexto: {
    color: '#FFFFFF',
    fontFamily: FUENTES.bold,
    fontSize: 12,
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
});
