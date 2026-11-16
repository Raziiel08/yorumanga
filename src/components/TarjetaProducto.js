import React, { useEffect, useRef, useState } from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View,
} from 'react-native';
import Icono from './Icono';
import Etiqueta from './Etiqueta';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../constants/theme';
import { formatearMoneda } from '../utils/moneda';

export default function TarjetaProducto({ producto, onAbrir, onAgregar }) {
  const enOferta = Number(producto.precio_anterior) > Number(producto.precio);
  const descuento = enOferta
    ? Math.round((1 - Number(producto.precio) / Number(producto.precio_anterior)) * 100)
    : 0;
  const { width } = useWindowDimensions();
  const tarjetaEstrecha = width < 480;

  const [agregado, setAgregado] = useState(false);
  const timeout = useRef(null);
  useEffect(() => () => clearTimeout(timeout.current), []);

  const manejarAgregar = () => {
    onAgregar?.();
    setAgregado(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setAgregado(false), 1800);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onAbrir} activeOpacity={0.88}>
        <View style={styles.portadaContenedor}>
          {producto.imagen
            ? (
              <Image
                source={{ uri: producto.imagen }}
                style={styles.portada}
                onError={(event) => console.warn('Error imagen:', producto.titulo, event.nativeEvent?.error)}
              />
            )
            : (
              <View style={[styles.portada, styles.portadaVacia]}>
                <Icono nombre="book" tamaño={34} color={COLORES.primarioLight} />
                <Text style={styles.textoPortadaVacia}>Portada pendiente</Text>
              </View>
            )}
          {enOferta && (
            <Etiqueta texto={`OFERTA · −${descuento}%`} variante="acento" estilo={styles.etiquetaOferta} />
          )}
          {producto.destacado && (
            <Etiqueta texto="DESTACADO" variante="primarioSuave" estilo={styles.etiquetaDestacado} />
          )}
        </View>
        <Text style={styles.titulo} numberOfLines={2}>{producto.titulo}</Text>
        <Text style={styles.autor} numberOfLines={1}>
          {producto.autor || 'Autor pendiente'}
        </Text>
      </TouchableOpacity>

      <View style={[styles.filaPrecio, tarjetaEstrecha && styles.filaPrecioEstrecha]}>
        <View>
          {enOferta && (
            <Text style={styles.precioAnterior}>{formatearMoneda(producto.precio_anterior)}</Text>
          )}
          <Text style={styles.precio}>{formatearMoneda(producto.precio)}</Text>
        </View>
        <Text style={[
          styles.stock,
          tarjetaEstrecha && styles.stockEstrecho,
          producto.stock <= 0 && styles.sinStock,
        ]}>
          {producto.stock > 0 ? `${producto.stock} disp.` : 'Sin stock'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.boton,
          producto.stock <= 0 && styles.botonDeshabilitado,
          agregado && styles.botonAgregado,
        ]}
        accessibilityLabel={`Agregar ${producto.titulo} al carrito`}
        disabled={producto.stock <= 0}
        onPress={manejarAgregar}
        activeOpacity={0.85}
      >
        <Icono
          nombre={agregado ? 'checkmark' : 'cart'}
          tamaño={16}
          color={producto.stock <= 0 ? COLORES.textoAtenuado : '#FFFFFF'}
        />
        <Text style={[
          styles.textoBoton,
          producto.stock <= 0 && styles.textoBotonDeshabilitado,
        ]}>
          {producto.stock <= 0 ? 'Sin stock' : agregado ? 'Agregado' : 'Agregar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    padding: ESPACIADO.md,
    margin: ESPACIADO.xs,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.sm,
  },
  portadaContenedor: {
    position: 'relative',
    marginBottom: ESPACIADO.md,
  },
  portada: {
    width: '100%',
    aspectRatio: 0.72,
    borderRadius: RADIO.md,
    backgroundColor: COLORES.superficieAlterna,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
  },
  portadaVacia: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIADO.xs,
    backgroundColor: COLORES.primarioTinte,
  },
  textoPortadaVacia: {
    color: COLORES.primario,
    fontSize: 12,
    fontFamily: FUENTES.bold,
  },
  etiquetaOferta: {
    position: 'absolute',
    top: ESPACIADO.sm,
    left: ESPACIADO.sm,
  },
  etiquetaDestacado: {
    position: 'absolute',
    top: ESPACIADO.sm,
    right: ESPACIADO.sm,
  },
  titulo: {
    color: COLORES.texto,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: FUENTES.extrabold,
    minHeight: 42,
  },
  autor: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.medio,
    marginTop: 2,
  },
  filaPrecio: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: ESPACIADO.xs,
    marginTop: ESPACIADO.md,
    minHeight: 42,
  },
  filaPrecioEstrecha: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 2,
    minHeight: 60,
  },
  precioAnterior: {
    color: COLORES.textoAtenuado,
    fontSize: 13,
    fontFamily: FUENTES.medio,
    textDecorationLine: 'line-through',
  },
  precio: {
    color: COLORES.primario,
    fontSize: 22,
    fontFamily: FUENTES.display,
    letterSpacing: 0.5,
  },
  stock: {
    color: COLORES.textoAtenuado,
    fontSize: 11,
    fontFamily: FUENTES.bold,
    textAlign: 'right',
  },
  stockEstrecho: {
    textAlign: 'left',
  },
  sinStock: {
    color: COLORES.error,
  },
  boton: {
    minHeight: 44,
    marginTop: ESPACIADO.md,
    paddingHorizontal: ESPACIADO.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORES.primario,
    borderRadius: RADIO.md,
  },
  botonDeshabilitado: {
    backgroundColor: COLORES.superficieAlterna,
  },
  botonAgregado: {
    backgroundColor: COLORES.exito,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FUENTES.extrabold,
    textAlign: 'center',
  },
  textoBotonDeshabilitado: {
    color: COLORES.textoAtenuado,
  },
});
