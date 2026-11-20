import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import Icono from "./Icono";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../constants/theme";

export default function Boton({
  titulo,
  alPresionar,
  cargando = false,
  variante = "primario",
  deshabilitado = false,
  tamaño = "md",
  icono = null,
  estilo,
}) {
  const obtenerEstiloBoton = () => {
    if (variante === "secundario") return estilos.secundario;
    if (variante === "contorno") return estilos.contorno;
    if (variante === "peligro") return estilos.peligro;
    if (variante === "fantasma") return estilos.fantasma;
    if (variante === "acento") return estilos.acento;
    return estilos.primario;
  };

  const obtenerEstiloTexto = () => {
    if (variante === "contorno") return estilos.textoContorno;
    if (variante === "secundario") return estilos.textoSecundario;
    if (variante === "fantasma") return estilos.textoFantasma;
    return estilos.textoPrimario;
  };

  const obtenerEstiloTamaño = () => {
    if (tamaño === "sm") return estilos.tamañoChico;
    if (tamaño === "lg") return estilos.tamañoGrande;
    return {};
  };

  const esPrimario =
    variante === "primario" || variante === "peligro" || variante === "acento";
  const colorIcono = esPrimario ? "#FFFFFF" : COLORES.primario;
  const tamañoIcono = tamaño === "sm" ? 15 : tamaño === "lg" ? 20 : 17;

  return (
    <TouchableOpacity
      style={[
        estilos.boton,
        obtenerEstiloBoton(),
        obtenerEstiloTamaño(),
        esPrimario && !deshabilitado && !cargando ? SOMBRAS.sm : {},
        (deshabilitado || cargando) && estilos.deshabilitado,
        estilo,
      ]}
      onPress={alPresionar}
      disabled={deshabilitado || cargando}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      {cargando ? (
        <ActivityIndicator color={esPrimario ? "#FFFFFF" : COLORES.primario} />
      ) : (
        <View style={estilos.contenido}>
          {icono ? (
            <Icono nombre={icono} tamaño={tamañoIcono} color={colorIcono} />
          ) : null}
          <Text style={[estilos.texto, obtenerEstiloTexto()]}>{titulo}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  boton: {
    paddingHorizontal: ESPACIADO.lg,
    paddingVertical: ESPACIADO.sm + 4,
    borderRadius: RADIO.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  contenido: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.sm,
  },
  tamañoChico: {
    minHeight: 38,
    paddingVertical: ESPACIADO.sm,
    paddingHorizontal: ESPACIADO.md,
    borderRadius: RADIO.xs,
  },
  tamañoGrande: {
    minHeight: 56,
    paddingVertical: ESPACIADO.lg,
    borderRadius: RADIO.lg,
  },
  primario: {
    backgroundColor: COLORES.primario,
  },
  acento: {
    backgroundColor: COLORES.acento,
  },
  peligro: {
    backgroundColor: COLORES.error,
  },
  secundario: {
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  contorno: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORES.primario,
  },
  fantasma: {
    backgroundColor: "transparent",
  },
  texto: {},
  textoPrimario: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 0.3,
  },
  textoSecundario: {
    color: COLORES.texto,
    fontSize: 15,
    fontFamily: FUENTES.bold,
  },
  textoContorno: {
    color: COLORES.primario,
    fontSize: 15,
    fontFamily: FUENTES.extrabold,
  },
  textoFantasma: {
    color: COLORES.primario,
    fontSize: 15,
    fontFamily: FUENTES.extrabold,
  },
  deshabilitado: {
    opacity: 0.45,
  },
});
