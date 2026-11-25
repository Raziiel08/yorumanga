import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIADO, FUENTES } from "../constants/theme";

export default function EncabezadoPantalla({
  kicker,
  titulo,
  descripcion,
  estilo,
  centro,
}) {
  return (
    <View style={[estilos.contenedor, centro && estilos.centro, estilo]}>
      {kicker ? <Text style={estilos.kicker}>{kicker}</Text> : null}
      <Text style={estilos.titulo}>{titulo}</Text>
      {descripcion ? (
        <Text style={estilos.descripcion}>{descripcion}</Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    marginBottom: ESPACIADO.lg,
  },
  centro: {
    alignItems: "center",
  },
  kicker: {
    color: COLORES.acentoOscuro,
    fontSize: 12,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 2.2,
    marginBottom: ESPACIADO.xs,
  },
  titulo: {
    color: COLORES.texto,
    fontSize: 34,
    fontFamily: FUENTES.display,
    letterSpacing: 0.5,
  },
  descripcion: {
    color: COLORES.textoSecundario,
    fontSize: 15,
    fontFamily: FUENTES.medio,
    lineHeight: 22,
    marginTop: ESPACIADO.xs,
    maxWidth: 560,
  },
});
