import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLORES, ESPACIADO, FUENTES, RADIO } from "../constants/theme";

export default function Entrada({
  etiqueta,
  errorMensaje,
  estilo,
  estiloEntrada,
  ...props
}) {
  const [enfocado, setEnfocado] = useState(false);

  return (
    <View style={[estilos.contenedor, estilo]}>
      {etiqueta ? <Text style={estilos.etiqueta}>{etiqueta}</Text> : null}
      <TextInput
        style={[
          estilos.entrada,
          enfocado && estilos.entradaEnfocada,
          errorMensaje && estilos.entradaError,
          estiloEntrada,
        ]}
        placeholderTextColor={COLORES.textoAtenuado}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        {...props}
      />
      {errorMensaje ? (
        <Text style={estilos.textoError}>{errorMensaje}</Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    marginBottom: ESPACIADO.md,
  },
  etiqueta: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.bold,
    marginBottom: ESPACIADO.xs,
    letterSpacing: 0.1,
  },
  entrada: {
    backgroundColor: COLORES.superficie,
    color: COLORES.texto,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: 13,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    fontSize: 15,
    fontFamily: FUENTES.medio,
    minHeight: 50,
  },
  entradaEnfocada: {
    borderColor: COLORES.primario,
    borderWidth: 1.5,
    backgroundColor: COLORES.superficieElevada,
  },
  entradaError: {
    borderColor: COLORES.error,
    borderWidth: 1.5,
  },
  textoError: {
    color: COLORES.error,
    fontSize: 12,
    fontFamily: FUENTES.bold,
    marginTop: 4,
  },
});
