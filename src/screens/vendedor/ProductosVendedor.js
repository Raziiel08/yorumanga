import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { productsService } from '../../services/productos';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';
import { formatearMoneda } from '../../utils/moneda';
import Icono from '../../components/Icono';
import Etiqueta from '../../components/Etiqueta';
import EncabezadoPantalla from '../../components/EncabezadoPantalla';

export default function ProductosVendedorScreen() {
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { width } = useWindowDimensions();
  const columnas = width < 768 ? 1 : width < 1024 ? 2 : 3;
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1360);

  const load = useCallback(async () => {
    setCargando(true);
    try {
      setProducts(await productsService.getAll(true));
    } catch (e) { console.error('Error cargando productos:', e); } finally {
      setCargando(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const filas = Math.ceil(products.length / columnas);

  return <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <EncabezadoPantalla
          kicker="CATÁLOGO"
          titulo="Productos"
          descripcion="Consultá precios y stock antes de armar una venta."
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
          {products.length > 0 ? (
            Array.from({ length: filas }, (_, indiceFila) => (
              <View key={`fila-${indiceFila}`} style={styles.fila}>
                {products
                  .slice(indiceFila * columnas, (indiceFila + 1) * columnas)
                  .map((item) => (
                    <View key={item.id} style={[styles.celda, { width: `${100 / columnas}%` }]}>
                      <View style={styles.card}>
                        <View style={styles.cardCabecera}>
                          <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
                          <Etiqueta
                            texto={item.stock > 0 ? `${item.stock} disp.` : 'Sin stock'}
                            variante={item.stock > 0 ? 'exito' : 'error'}
                          />
                        </View>
                        <Text style={styles.cardPrecio}>{formatearMoneda(item.precio)}</Text>
                        <Text style={styles.cardText}>{item.genero || 'Sin género'}</Text>
                      </View>
                    </View>
                  ))}
              </View>
            ))
          ) : (
            <View style={styles.vacio}>
              <View style={styles.vacioIcono}>
                <Icono nombre={cargando ? 'library' : 'search'} tamaño={34} color={COLORES.primarioClaro} />
              </View>
              <Text style={styles.vacioTexto}>
                {cargando ? 'Cargando productos…' : 'No hay productos disponibles.'}
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
  cardPrecio: {
    color: COLORES.primario,
    fontFamily: FUENTES.display,
    fontSize: 22,
    letterSpacing: 0.4,
    marginTop: ESPACIADO.xs,
  },
  cardText: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 13,
    marginTop: 2,
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
