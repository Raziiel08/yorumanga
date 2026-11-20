import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icono from "../../components/Icono";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import { useCart } from "../../context/ContextoCarrito";
import { useAuth } from "../../context/ContextoAuth";
import { useResponsive } from "../../hooks/useResponsivo";
import { ordersService } from "../../services/pedidos";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { formatearMoneda } from "../../utils/moneda";

export default function PantallaCarrito({ navigation }) {
  const { items, removeItem, updateQty, clear, total } = useCart();
  const { user } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const { esEscritorio, anchoMaxContenido } = useResponsive();

  const irAlPago = () => {
    if (items.length === 0) return;
    if (!user) {
      navigation.navigate("Login");
      return;
    }
    navigation.navigate("Pago");
  };

  const listaProductos =
    items.length > 0 ? (
      <View>
        {items.map((item) => (
          <View key={item.product.id} style={estilos.tarjeta}>
            <View style={estilos.portadaContenedor}>
              {item.product.imagen ? (
                <Image
                  source={{ uri: item.product.imagen }}
                  style={estilos.portada}
                  accessibilityLabel={`Portada de ${item.product.titulo}`}
                />
              ) : (
                <View style={[estilos.portada, estilos.portadaVacia]}>
                  <Icono
                    nombre="book"
                    tamaño={20}
                    color={COLORES.primarioLight}
                  />
                </View>
              )}
            </View>

            <View style={estilos.contenidoTarjeta}>
              <View style={estilos.encabezadoTarjeta}>
                <Text style={estilos.tituloTarjeta} numberOfLines={2}>
                  {item.product.titulo}
                </Text>
                <TouchableOpacity
                  onPress={() => removeItem(item.product.id)}
                  style={estilos.botonEliminar}
                  accessibilityLabel={`Quitar ${item.product.titulo} del carrito`}
                >
                  <Icono
                    nombre="trash-outline"
                    tamaño={17}
                    color={COLORES.error}
                  />
                </TouchableOpacity>
              </View>
              <Text style={estilos.subtituloTarjeta}>
                {item.product.genero}
              </Text>
              <View style={estilos.pieTarjeta}>
                <View style={estilos.controlCantidad}>
                  <TouchableOpacity
                    style={estilos.botonCantidad}
                    onPress={() =>
                      updateQty(item.product.id, item.cantidad - 1)
                    }
                    accessibilityLabel="Reducir cantidad"
                  >
                    <Icono
                      nombre="remove"
                      tamaño={15}
                      color={COLORES.primario}
                    />
                  </TouchableOpacity>
                  <Text style={estilos.cantidad}>{item.cantidad}</Text>
                  <TouchableOpacity
                    style={estilos.botonCantidad}
                    onPress={() =>
                      updateQty(item.product.id, item.cantidad + 1)
                    }
                    accessibilityLabel="Aumentar cantidad"
                  >
                    <Icono nombre="add" tamaño={15} color={COLORES.primario} />
                  </TouchableOpacity>
                </View>
                <Text style={estilos.precioTarjeta}>
                  {formatearMoneda(item.product.precio * item.cantidad)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    ) : (
      <View style={estilos.contenedorVacio}>
        <View style={estilos.iconoVacioContenedor}>
          <Icono
            nombre="cart-outline"
            tamaño={34}
            color={COLORES.primarioLight}
          />
        </View>
        <Text style={estilos.textoVacio}>Tu carrito está vacío</Text>
        <TouchableOpacity
          style={estilos.botonVerCatalogo}
          onPress={() => navigation.navigate("Catálogo")}
          activeOpacity={0.85}
        >
          <Text style={estilos.textoVerCatalogo}>Explorar catálogo</Text>
        </TouchableOpacity>
      </View>
    );

  const resumen = (
    <View style={estilos.resumen}>
      <Text style={estilos.tituloResumen}>Resumen</Text>
      <View style={estilos.filaResumen}>
        <Text style={estilos.etiquetaResumen}>
          {items.length} producto{items.length !== 1 ? "s" : ""}
        </Text>
        <Text style={estilos.total}>{formatearMoneda(total)}</Text>
      </View>
      <View style={estilos.separador} />
      <TouchableOpacity
        style={[
          estilos.botonConfirmar,
          items.length === 0 && estilos.botonConfirmarDeshabilitado,
        ]}
        onPress={irAlPago}
        disabled={items.length === 0}
        activeOpacity={0.85}
      >
        <View style={estilos.filaConfirmar}>
          <Icono nombre="card-outline" tamaño={20} color="#FFFFFF" />
          <Text style={estilos.textoConfirmar}>Proceder al Pago</Text>
        </View>
      </TouchableOpacity>
      {!user ? (
        <TouchableOpacity
          style={estilos.avisoSesion}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Icono
            nombre="information-circle-outline"
            tamaño={16}
            color={COLORES.advertencia}
          />
          <Text style={estilos.textoAvisoSesion}>
            Iniciá sesión para realizar el pago — tocar acá
          </Text>
        </TouchableOpacity>
      ) : null}
      {error ? (
        <View style={estilos.avisoError}>
          <Icono nombre="alert-circle" tamaño={16} color={COLORES.error} />
          <Text style={estilos.textoAvisoError} numberOfLines={3}>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={estilos.contenedor}>
      <View style={[estilos.contenido, { maxWidth: anchoMaxContenido }]}>
        <EncabezadoPantalla
          kicker="TU SELECCIÓN"
          titulo="Tu carrito"
          descripcion="Revisá las cantidades antes de confirmar tu pedido."
        />
        <View
          style={[
            estilos.distribucion,
            { flexDirection: esEscritorio ? "row" : "column" },
          ]}
        >
          <View
            style={esEscritorio ? { flex: 2, minWidth: 0 } : { minWidth: 0 }}
          >
            {listaProductos}
          </View>
          {items.length > 0 && (
            <View
              style={
                esEscritorio
                  ? { flex: 1, marginLeft: ESPACIADO.lg }
                  : { marginTop: ESPACIADO.md }
              }
            >
              {resumen}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    width: "100%",
    padding: ESPACIADO.lg,
  },
  distribucion: {
    width: "100%",
  },
  tarjeta: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.md,
    borderRadius: RADIO.lg,
    marginBottom: ESPACIADO.sm,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    flexDirection: "row",
    gap: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  portadaContenedor: {
    width: 64,
  },
  portada: {
    width: 64,
    height: 89,
    borderRadius: RADIO.sm,
    backgroundColor: COLORES.superficieAlterna,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
  },
  portadaVacia: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORES.primarioTinte,
  },
  contenidoTarjeta: {
    flex: 1,
    minWidth: 0,
  },
  encabezadoTarjeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: ESPACIADO.sm,
  },
  tituloTarjeta: {
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
  subtituloTarjeta: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.medio,
    marginTop: 2,
    marginBottom: ESPACIADO.sm,
  },
  botonEliminar: {
    width: 34,
    height: 34,
    borderRadius: RADIO.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  pieTarjeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlCantidad: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.xs,
    backgroundColor: COLORES.fondo,
    borderRadius: RADIO.sm,
    paddingHorizontal: ESPACIADO.xs,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  botonCantidad: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cantidad: {
    color: COLORES.texto,
    fontSize: 15,
    fontFamily: FUENTES.extrabold,
    minWidth: 20,
    textAlign: "center",
  },
  precioTarjeta: {
    color: COLORES.primario,
    fontFamily: FUENTES.display,
    fontSize: 21,
    letterSpacing: 0.5,
  },
  resumen: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.lg,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.md,
  },
  tituloResumen: {
    fontSize: 21,
    fontFamily: FUENTES.display,
    letterSpacing: 0.8,
    color: COLORES.texto,
    marginBottom: ESPACIADO.md,
  },
  filaResumen: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  etiquetaResumen: {
    color: COLORES.textoSecundario,
    fontSize: 14,
    fontFamily: FUENTES.medio,
    marginBottom: 2,
  },
  total: {
    fontSize: 30,
    fontFamily: FUENTES.display,
    letterSpacing: 0.5,
    color: COLORES.primario,
  },
  separador: {
    height: 1,
    backgroundColor: COLORES.borde,
    marginVertical: ESPACIADO.md,
  },
  botonConfirmar: {
    backgroundColor: COLORES.primario,
    paddingVertical: ESPACIADO.md,
    borderRadius: RADIO.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    ...SOMBRAS.sm,
  },
  botonConfirmarDeshabilitado: {
    opacity: 0.6,
  },
  filaConfirmar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avisoSesion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: ESPACIADO.sm,
    padding: ESPACIADO.sm,
    backgroundColor: COLORES.advertenciaClara,
    borderRadius: RADIO.sm,
  },
  textoAvisoSesion: {
    flex: 1,
    color: COLORES.advertencia,
    fontFamily: FUENTES.bold,
    fontSize: 12,
    lineHeight: 17,
  },
  avisoError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: ESPACIADO.sm,
    padding: ESPACIADO.sm,
    backgroundColor: COLORES.errorClaro,
    borderRadius: RADIO.sm,
  },
  textoAvisoError: {
    flex: 1,
    color: COLORES.error,
    fontFamily: FUENTES.bold,
    fontSize: 12,
    lineHeight: 17,
  },
  textoConfirmar: {
    color: "#FFFFFF",
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  contenedorVacio: {
    alignItems: "center",
    paddingVertical: ESPACIADO.xxl,
  },
  iconoVacioContenedor: {
    width: 84,
    height: 84,
    borderRadius: RADIO.full,
    backgroundColor: COLORES.primarioTinte,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ESPACIADO.md,
  },
  textoVacio: {
    color: COLORES.textoSecundario,
    textAlign: "center",
    fontSize: 16,
    fontFamily: FUENTES.extrabold,
  },
  botonVerCatalogo: {
    marginTop: ESPACIADO.lg,
    backgroundColor: COLORES.primario,
    paddingHorizontal: ESPACIADO.xl,
    paddingVertical: ESPACIADO.md,
    borderRadius: RADIO.md,
    ...SOMBRAS.sm,
  },
  textoVerCatalogo: {
    color: "#FFFFFF",
    fontFamily: FUENTES.extrabold,
    fontSize: 14,
  },
});
