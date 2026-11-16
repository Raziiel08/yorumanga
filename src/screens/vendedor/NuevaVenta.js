import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Alert } from '../../utils/alertas';
import { productsService } from '../../services/productos';
import { clientsService } from '../../services/clientes';
import { salesService } from '../../services/ventas';
import { useAuth } from '../../context/ContextoAuth';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';
import { formatearMoneda } from '../../utils/moneda';
import Icono from '../../components/Icono';
import Chip from '../../components/Chip';
import EncabezadoPantalla from '../../components/EncabezadoPantalla';
import Boton from '../../components/Boton';

export default function NuevaVentaScreen({
  navigation
}) {
  const {
    user
  } = useAuth();
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { width } = useWindowDimensions();
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1080);

  useEffect(() => {
    (async () => {
      try {
        const [ps, cs] = await Promise.all([productsService.getAll(true), clientsService.getAll()]);
        setProducts(ps);
        setClients(cs);
      } catch (e) {
        Alert.alert('Error', e.message);
      }
    })();
  }, []);
  const addToCart = product => {
    setCarrito(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) {
        if (existing.cantidad + 1 > product.stock) {
          Alert.alert('Stock', 'No hay suficiente stock');
          return prev;
        }
        return prev.map(c => c.product.id === product.id ? {
          ...c,
          cantidad: c.cantidad + 1
        } : c);
      }
      if (product.stock < 1) {
        Alert.alert('Stock', 'Producto sin stock');
        return prev;
      }
      return [...prev, {
        product,
        cantidad: 1
      }];
    });
  };
  const removeFromCart = productId => {
    setCarrito(prev => prev.filter(c => c.product.id !== productId));
  };
  const changeQty = (productId, delta) => {
    setCarrito(prev => prev.map(c => {
      if (c.product.id !== productId) return c;
      const newQty = c.cantidad + delta;
      if (newQty < 1) return c;
      if (newQty > c.product.stock) {
        Alert.alert('Stock', 'No hay suficiente stock');
        return c;
      }
      return {
        ...c,
        cantidad: newQty
      };
    }));
  };
  const total = carrito.reduce((acc, c) => acc + c.product.precio * c.cantidad, 0);
  const confirmar = async () => {
    if (carrito.length === 0) {
      Alert.alert('Error', 'El carrito está vacío');
      return;
    }
    if (!user) return;
    setCargando(true);
    try {
      await salesService.createSale(selectedClient?.id || null, carrito.map(c => ({
        product: c.product,
        cantidad: c.cantidad
      })));
      Alert.alert('Éxito', 'Venta registrada');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setCargando(false);
    }
  };

  const encabezadoSeccion = (icono, texto) => (
    <View style={styles.cabeceraSeccion}>
      <Icono nombre={icono} tamaño={18} color={COLORES.primario} />
      <Text style={styles.seccion}>{texto}</Text>
    </View>
  );

  return <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <EncabezadoPantalla
          kicker="VENTA PRESENCIAL"
          titulo="Nueva venta"
          descripcion="Elegí el cliente, sumá productos y confirmá la venta."
          estilo={styles.encabezado}
        />
        <ScrollView
          style={styles.lista}
          contentContainerStyle={styles.contenidoLista}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
        >
          {encabezadoSeccion('person', 'Cliente (opcional)')}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filaChips}
            contentContainerStyle={styles.contenidoChips}
          >
            <Chip
              texto="Sin cliente"
              compacto
              icono="person-outline"
              activo={!selectedClient}
              alPresionar={() => setSelectedClient(null)}
            />
            {clients.map(c => (
              <Chip
                key={c.id}
                texto={c.nombre}
                compacto
                activo={selectedClient?.id === c.id}
                alPresionar={() => setSelectedClient(c)}
              />
            ))}
          </ScrollView>

          {encabezadoSeccion('library', 'Productos')}
          {products.length > 0 ? products.map(p => (
            <View key={p.id} style={styles.productRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.productTitle} numberOfLines={1}>{p.titulo}</Text>
                <Text style={styles.productSub}>
                  {formatearMoneda(p.precio)} · Stock: {p.stock}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.botonAgregar, p.stock < 1 && styles.botonAgregarDeshabilitado]}
                onPress={() => addToCart(p)}
                disabled={p.stock < 1}
                activeOpacity={0.8}
                accessibilityLabel={`Agregar ${p.titulo} al carrito`}
              >
                <Icono nombre="add" tamaño={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )) : (
            <Text style={styles.textoVacio}>Cargando productos…</Text>
          )}

          {encabezadoSeccion('cart', 'Carrito')}
          {carrito.length > 0 ? carrito.map(c => (
            <View key={c.product.id} style={styles.cartRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.cartTitle} numberOfLines={1}>
                  {c.product.titulo} ×{c.cantidad}
                </Text>
                <Text style={styles.productSub}>
                  {formatearMoneda(c.product.precio * c.cantidad)}
                </Text>
              </View>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.botonCantidad}
                  onPress={() => changeQty(c.product.id, -1)}
                  accessibilityLabel="Quitar una unidad"
                >
                  <Icono nombre="remove" tamaño={16} color={COLORES.primario} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botonCantidad}
                  onPress={() => changeQty(c.product.id, 1)}
                  accessibilityLabel="Agregar una unidad"
                >
                  <Icono nombre="add" tamaño={16} color={COLORES.primario} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botonCantidad, styles.botonEliminar]}
                  onPress={() => removeFromCart(c.product.id)}
                  accessibilityLabel="Quitar del carrito"
                >
                  <Icono nombre="trash-outline" tamaño={16} color={COLORES.error} />
                </TouchableOpacity>
              </View>
            </View>
          )) : (
            <Text style={styles.textoVacio}>Todavía no sumaste productos a la venta.</Text>
          )}

          <View style={styles.resumenTotal}>
            <Text style={styles.resumenEtiqueta}>TOTAL</Text>
            <Text style={styles.total}>{formatearMoneda(total)}</Text>
          </View>

          <Boton
            titulo={cargando ? 'Procesando...' : 'Confirmar venta'}
            icono="checkmark-circle"
            tamaño="lg"
            alPresionar={confirmar}
            cargando={cargando}
            deshabilitado={carrito.length === 0}
            estilo={styles.botonConfirmar}
          />
        </ScrollView>
      </View>
    </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
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
    paddingBottom: ESPACIADO.xxl,
  },
  cabeceraSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    marginTop: ESPACIADO.lg,
    marginBottom: ESPACIADO.sm,
  },
  seccion: {
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
    fontSize: 16,
  },
  filaChips: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: ESPACIADO.sm,
  },
  contenidoChips: {
    gap: ESPACIADO.sm,
    paddingRight: ESPACIADO.lg,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.md,
    borderRadius: RADIO.md,
    marginBottom: ESPACIADO.sm,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.sm,
  },
  productTitle: {
    color: COLORES.texto,
    fontFamily: FUENTES.bold,
    fontSize: 14,
  },
  productSub: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 13,
    marginTop: 2,
  },
  botonAgregar: {
    width: 40,
    height: 40,
    borderRadius: RADIO.completo,
    backgroundColor: COLORES.primario,
    alignItems: 'center',
    justifyContent: 'center',
    ...SOMBRAS.sm,
  },
  botonAgregarDeshabilitado: {
    opacity: 0.35,
  },
  cartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.md,
    borderRadius: RADIO.md,
    marginBottom: ESPACIADO.sm,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
  },
  cartTitle: {
    color: COLORES.texto,
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    flex: 1,
  },
  qtyRow: {
    flexDirection: 'row',
    gap: ESPACIADO.xs,
  },
  botonCantidad: {
    width: 34,
    height: 34,
    borderRadius: RADIO.completo,
    backgroundColor: COLORES.primarioTinte,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonEliminar: {
    backgroundColor: COLORES.errorClaro,
  },
  textoVacio: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 13,
    marginBottom: ESPACIADO.sm,
  },
  resumenTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    padding: ESPACIADO.md,
    marginTop: ESPACIADO.md,
    marginBottom: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  resumenEtiqueta: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.extrabold,
    fontSize: 12,
    letterSpacing: 1.6,
  },
  total: {
    color: COLORES.primario,
    fontFamily: FUENTES.display,
    fontSize: 30,
    letterSpacing: 0.4,
  },
  botonConfirmar: {
    backgroundColor: COLORES.exito,
  },
});
