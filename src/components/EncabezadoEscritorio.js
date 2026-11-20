import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icono from "./Icono";
import LogoMarca from "./LogoMarca";
import { useCart } from "../context/ContextoCarrito";
import { COLORES, ESPACIADO, FUENTES, RADIO } from "../constants/theme";

const PARAMETROS_CATALOGO_LIMPIO = {
  busqueda: "",
  genero: "",
  soloOfertas: false,
  soloDestacados: false,
  soloNovedades: false,
  orden: "recientes",
};

export default function EncabezadoEscritorio({ navigation }) {
  const [busqueda, setBusqueda] = useState("");
  const { items } = useCart();
  const cantidadCarrito = items.reduce(
    (total, item) => total + item.cantidad,
    0,
  );

  const navegar = (pantalla, params = {}) => {
    navigation.navigate("HomeTabs", {
      screen: pantalla,
      params: { ...PARAMETROS_CATALOGO_LIMPIO, ...params },
    });
  };

  return (
    <View style={styles.encabezado}>
      <View style={styles.contenido}>
        <TouchableOpacity
          accessibilityLabel="Ir al inicio"
          onPress={() => navegar("Inicio")}
          style={styles.logo}
        >
          <LogoMarca ancho={128} />
        </TouchableOpacity>

        <View style={styles.navegacion}>
          <TouchableOpacity
            onPress={() => navegar("Inicio")}
            style={styles.enlace}
          >
            <Text style={styles.textoEnlace}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navegar("Catálogo")}
            style={styles.enlace}
          >
            <Text style={styles.textoEnlace}>Catálogo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navegar("Catálogo", { soloNovedades: true, orden: "recientes" })}
            style={styles.enlace}
          >
            <Text style={styles.textoEnlace}>Novedades</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navegar("Catálogo", { soloOfertas: true })}
            style={styles.enlace}
          >
            <Text style={styles.textoEnlace}>Ofertas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buscador}>
          <Icono nombre="search" tamaño={17} color="rgba(255,255,255,0.6)" />
          <TextInput
            accessibilityLabel="Buscar mangas"
            style={styles.campoBusqueda}
            placeholder="Buscar mangas..."
            placeholderTextColor={COLORES.textoAtenuado}
            value={busqueda}
            onChangeText={setBusqueda}
            onSubmitEditing={() => navegar("Catálogo", { busqueda })}
            returnKeyType="search"
          />
          {busqueda.length > 0 && (
            <TouchableOpacity
              accessibilityLabel="Limpiar búsqueda"
              onPress={() => setBusqueda("")}
            >
              <Icono nombre="close" tamaño={14} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          accessibilityLabel={`Carrito, ${cantidadCarrito} productos`}
          onPress={() => navegar("Carrito")}
          style={[styles.accion, styles.accionDestacada]}
        >
          <View style={styles.iconoAccionContenedor}>
            <Icono nombre="cart" tamaño={17} color="#FFFFFF" />
            {cantidadCarrito > 0 && (
              <View style={styles.contadorCarrito}>
                <Text style={styles.textoContador}>{cantidadCarrito}</Text>
              </View>
            )}
          </View>
          <Text style={styles.textoAccionDestacada}>Carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="Abrir perfil"
          onPress={() => navegar("Perfil")}
          style={styles.accion}
        >
          <Icono
            nombre="person-circle-outline"
            tamaño={26}
            color="rgba(255,255,255,0.82)"
          />
          <Text style={styles.textoAccion}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    width: "100%",
    minHeight: 84,
    backgroundColor: COLORES.primarioOscuro,
  },
  contenido: {
    width: "100%",
    maxWidth: 1440,
    minHeight: 84,
    alignSelf: "center",
    paddingHorizontal: ESPACIADO.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ESPACIADO.md,
  },
  logo: {
    flexShrink: 0,
    justifyContent: "center",
  },
  navegacion: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.lg,
  },
  enlace: {
    paddingVertical: ESPACIADO.sm,
  },
  textoEnlace: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontFamily: FUENTES.extrabold,
  },
  buscador: {
    flex: 1,
    maxWidth: 280,
    minWidth: 150,
    height: 44,
    paddingHorizontal: ESPACIADO.md,
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.xs,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: RADIO.completo,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  campoBusqueda: {
    flex: 1,
    minWidth: 0,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FUENTES.medio,
    paddingVertical: ESPACIADO.xs,
  },
  accion: {
    flexShrink: 0,
    minHeight: 44,
    paddingHorizontal: ESPACIADO.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.xs,
  },
  accionDestacada: {
    backgroundColor: COLORES.acento,
    borderRadius: RADIO.completo,
    paddingHorizontal: ESPACIADO.md,
    minHeight: 42,
  },
  iconoAccionContenedor: {
    position: "relative",
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  contadorCarrito: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 17,
    height: 17,
    borderRadius: RADIO.full,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  textoContador: {
    color: COLORES.acentoOscuro,
    fontSize: 10,
    fontFamily: FUENTES.extrabold,
  },
  textoAccionDestacada: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FUENTES.extrabold,
  },
  textoAccion: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontFamily: FUENTES.extrabold,
  },
});
