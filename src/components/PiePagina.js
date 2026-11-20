import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icono from "./Icono";
import LogoMarca from "./LogoMarca";
import { COLORES, ESPACIADO, FUENTES, RADIO } from "../constants/theme";

export default function PiePagina({ navigation, esMobile }) {
  const abrirCatalogo = (params = {}) =>
    navigation.navigate("Catálogo", {
      busqueda: "",
      genero: "",
      soloOfertas: false,
      soloDestacados: false,
      orden: "recientes",
      ...params,
    });

  return (
    <View style={styles.pie}>
      <View style={[styles.contenido, !esMobile && styles.contenidoAmplio]}>
        <View style={styles.marca}>
          <LogoMarca ancho={142} />
          <Text style={styles.descripcionMarca}>
            Tienda online de mangas físicos.
          </Text>
        </View>

        <View style={styles.columna}>
          <Text style={styles.tituloColumna}>EXPLORÁ</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
            <Text style={styles.enlace}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => abrirCatalogo()}>
            <Text style={styles.enlace}>Catálogo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => abrirCatalogo({ soloNovedades: true, orden: "recientes" })}
          >
            <Text style={styles.enlace}>Novedades</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => abrirCatalogo({ soloOfertas: true })}
          >
            <Text style={styles.enlace}>Ofertas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.columna}>
          <Text style={styles.tituloColumna}>TU COMPRA</Text>
          <Text style={styles.textoCompra}>
            Consultá el precio y la disponibilidad en cada manga. Revisá tu
            pedido en el carrito y seguí su estado desde tu perfil.
          </Text>
          <TouchableOpacity
            style={styles.botonCarrito}
            onPress={() => navigation.navigate("Carrito")}
          >
            <Icono nombre="cart" tamaño={15} color="#FFFFFF" />
            <Text style={styles.textoBoton}>Ir al carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.base}>
        <Text style={styles.textoBase}>
          © YORUMANGA · Manga físico para cada historia.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pie: {
    width: "100%",
    marginTop: ESPACIADO.xl,
    paddingTop: ESPACIADO.xl,
    backgroundColor: COLORES.primarioOscuro,
    borderTopLeftRadius: RADIO.lg,
    borderTopRightRadius: RADIO.lg,
  },
  contenido: {
    gap: ESPACIADO.xl,
    paddingHorizontal: ESPACIADO.lg,
    paddingBottom: ESPACIADO.xl,
  },
  contenidoAmplio: {
    maxWidth: 1120,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  marca: {
    gap: ESPACIADO.sm,
  },
  descripcionMarca: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    fontFamily: FUENTES.medio,
  },
  columna: {
    maxWidth: 340,
    gap: ESPACIADO.sm,
  },
  tituloColumna: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 2.2,
    marginBottom: ESPACIADO.xs,
  },
  enlace: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontFamily: FUENTES.bold,
    paddingVertical: 2,
  },
  textoCompra: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    fontFamily: FUENTES.cuerpo,
    lineHeight: 21,
  },
  botonCarrito: {
    alignSelf: "flex-start",
    marginTop: ESPACIADO.xs,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.sm,
    backgroundColor: COLORES.acento,
    borderRadius: RADIO.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FUENTES.extrabold,
  },
  base: {
    minHeight: 52,
    paddingHorizontal: ESPACIADO.lg,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.14)",
  },
  textoBase: {
    color: "rgba(255,255,255,0.64)",
    fontSize: 12,
    fontFamily: FUENTES.bold,
    textAlign: "center",
  },
});
