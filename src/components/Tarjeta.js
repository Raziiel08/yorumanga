import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORES, ESPACIADO, RADIO, SOMBRAS } from "../constants/theme";

export default function Tarjeta({
  hijos,
  children,
  estilo,
  elevada = false,
  ...props
}) {
  return (
    <View
      style={[
        estilos.tarjeta,
        elevada ? estilos.elevada : estilos.plana,
        estilo,
      ]}
      {...props}
    >
      {children ?? hijos}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    padding: ESPACIADO.lg,
    marginBottom: ESPACIADO.md,
  },
  plana: {
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
  },
  elevada: {
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.sm,
  },
});
