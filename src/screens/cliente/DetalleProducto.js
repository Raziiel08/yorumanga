import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Icono from '../../components/Icono';
import Etiqueta from '../../components/Etiqueta';
import { useCart } from '../../context/ContextoCarrito';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';
import { formatearMoneda } from '../../utils/moneda';

export default function ProductoDetalleScreen({ route, navigation }) {
  const product = route.params.product;
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const { width } = useWindowDimensions();
  const escritorio = width >= 820;
  const enOferta = Number(product.precio_anterior) > Number(product.precio);
  const descuento = enOferta
    ? Math.round((1 - Number(product.precio) / Number(product.precio_anterior)) * 100)
    : 0;

  const portada = product.imagen
    ? (
      <Image
        source={{ uri: product.imagen }}
        style={styles.image}
        onError={(e) => console.warn('Error imagen:', product.titulo, e.nativeEvent?.error)}
      />
    )
    : (
      <View style={[styles.image, styles.imagePlaceholder]}>
        <Icono nombre="book" tamaño={52} color={COLORES.primarioLight} />
        <Text style={styles.placeholderCaption}>Sin portada</Text>
      </View>
    );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, escritorio && styles.containerWide]}>
        <View style={[styles.cover, escritorio && styles.coverWide]}>
          {portada}
          {enOferta && (
            <Etiqueta texto={`OFERTA · −${descuento}%`} variante="acento" estilo={styles.etiquetaOferta} />
          )}
        </View>

        <View style={styles.information}>
          <Text style={styles.kicker}>EDICIÓN IMPRESA</Text>
          <Text style={[styles.title, width < 600 && styles.titleMobile]}>
            {product.titulo}
          </Text>
          <Text style={styles.author}>{product.autor || 'Autor pendiente'}</Text>
          <View style={styles.filaMeta}>
            {product.genero ? <Etiqueta texto={product.genero} variante="primarioSuave" /> : null}
            {product.editorial ? <Etiqueta texto={product.editorial} variante="neutro" /> : null}
          </View>

          <View style={styles.bloquePrecio}>
            {enOferta && (
              <Text style={styles.previousPrice}>{formatearMoneda(product.precio_anterior)}</Text>
            )}
            <Text style={styles.price}>{formatearMoneda(product.precio)}</Text>
          </View>

          {product.descripcion
            ? <Text style={styles.desc}>{product.descripcion}</Text>
            : null}

          <View style={styles.stockBadge}>
            <View style={[
              styles.stockDot,
              { backgroundColor: product.stock > 0 ? COLORS_EXITO : COLORS_ERROR },
            ]} />
            <Text style={styles.stock}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </Text>
          </View>

          <View style={styles.purchaseRow}>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                accessibilityLabel="Reducir cantidad"
                disabled={qty <= 1}
                onPress={() => setQty(Math.max(1, qty - 1))}
                style={styles.qtyButton}
              >
                <Icono
                  nombre="remove"
                  tamaño={18}
                  color={qty <= 1 ? COLORES.textoAtenuado : COLORES.primario}
                />
              </TouchableOpacity>
              <Text style={styles.qty}>{qty}</Text>
              <TouchableOpacity
                accessibilityLabel="Aumentar cantidad"
                disabled={product.stock <= 0 || qty >= product.stock}
                onPress={() => setQty(Math.min(product.stock, qty + 1))}
                style={styles.qtyButton}
              >
                <Icono
                  nombre="add"
                  tamaño={18}
                  color={product.stock <= 0 || qty >= product.stock ? COLORES.textoAtenuado : COLORES.primario}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.subtotalBloque}>
              <Text style={styles.subtotalEtiqueta}>Subtotal</Text>
              <Text style={styles.subtotal}>
                {formatearMoneda(product.precio * qty)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            disabled={product.stock <= 0}
            style={[styles.btn, product.stock <= 0 && styles.btnDisabled]}
            onPress={() => {
              addItem(product, qty);
              navigation.goBack();
            }}
            activeOpacity={0.85}
          >
            <Icono
              nombre="cart"
              tamaño={18}
              color={product.stock <= 0 ? COLORES.textoAtenuado : '#FFFFFF'}
            />
            <Text style={[styles.btnText, product.stock <= 0 && styles.btnTextDisabled]}>
              {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const COLORS_EXITO = '#438271';
const COLORS_ERROR = '#B94A4A';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  scrollContent: {
    alignItems: 'center',
    padding: ESPACIADO.lg,
  },
  container: {
    width: '100%',
    maxWidth: 720,
    padding: ESPACIADO.lg,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.sm,
  },
  containerWide: {
    maxWidth: 960,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ESPACIADO.xl,
    padding: ESPACIADO.xl,
  },
  cover: {
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
    marginBottom: ESPACIADO.lg,
  },
  coverWide: {
    width: 280,
    alignSelf: 'flex-start',
    marginBottom: 0,
  },
  image: {
    width: '100%',
    aspectRatio: 0.72,
    borderRadius: RADIO.lg,
    backgroundColor: COLORES.superficieAlterna,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.md,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIADO.xs,
    backgroundColor: COLORES.primarioTinte,
  },
  placeholderCaption: {
    color: COLORES.primario,
    fontSize: 13,
    fontFamily: FUENTES.bold,
  },
  etiquetaOferta: {
    position: 'absolute',
    top: ESPACIADO.sm,
    left: ESPACIADO.sm,
  },
  information: {
    flex: 1,
    minWidth: 0,
  },
  kicker: {
    color: COLORES.acentoOscuro,
    fontSize: 11,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 2.4,
    marginBottom: ESPACIADO.xs,
  },
  title: {
    color: COLORES.texto,
    fontSize: 40,
    lineHeight: 44,
    fontFamily: FUENTES.display,
    letterSpacing: 1,
  },
  titleMobile: {
    fontSize: 32,
    lineHeight: 36,
  },
  author: {
    color: COLORES.textoSecundario,
    fontSize: 15,
    fontFamily: FUENTES.bold,
    marginTop: ESPACIADO.xs,
  },
  filaMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIADO.xs,
    marginTop: ESPACIADO.sm,
  },
  bloquePrecio: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: ESPACIADO.sm,
    marginTop: ESPACIADO.lg,
    marginBottom: ESPACIADO.md,
  },
  previousPrice: {
    color: COLORES.textoAtenuado,
    fontSize: 17,
    fontFamily: FUENTES.medio,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  price: {
    color: COLORES.primario,
    fontSize: 38,
    lineHeight: 42,
    fontFamily: FUENTES.display,
    letterSpacing: 0.5,
  },
  desc: {
    color: COLORES.textoSecundario,
    fontSize: 14,
    fontFamily: FUENTES.cuerpo,
    lineHeight: 22,
    marginBottom: ESPACIADO.md,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: ESPACIADO.xs,
    backgroundColor: COLORES.superficieAlterna,
    borderRadius: RADIO.full,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.xs,
    marginBottom: ESPACIADO.lg,
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  stock: {
    color: COLORES.textoSecundario,
    fontSize: 12,
    fontFamily: FUENTES.bold,
  },
  purchaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACIADO.md,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.fondo,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: ESPACIADO.xs,
  },
  qtyButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    color: COLORES.texto,
    fontSize: 16,
    fontFamily: FUENTES.extrabold,
    minWidth: 18,
    textAlign: 'center',
  },
  subtotalBloque: {
    alignItems: 'flex-end',
  },
  subtotalEtiqueta: {
    color: COLORES.textoAtenuado,
    fontSize: 11,
    fontFamily: FUENTES.bold,
    letterSpacing: 1,
  },
  subtotal: {
    color: COLORES.texto,
    fontSize: 22,
    fontFamily: FUENTES.display,
    letterSpacing: 0.5,
  },
  btn: {
    minHeight: 52,
    backgroundColor: COLORES.primario,
    padding: ESPACIADO.md,
    borderRadius: RADIO.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    ...SOMBRAS.sm,
  },
  btnDisabled: {
    backgroundColor: COLORES.superficieAlterna,
  },
  btnText: {
    color: '#FFFFFF',
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
  },
  btnTextDisabled: {
    color: COLORES.textoAtenuado,
  },
});
