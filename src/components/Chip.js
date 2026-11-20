import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icono from "./Icono";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../constants/theme";

/**
 * Chip pill reutilizable para filtros y categorías.
 */
export default function Chip({
  texto,
  icono,
  activo = false,
  alPresionar,
  compacto = false,
  estilo,
}) {
  return (
    <TouchableOpacity
      onPress={alPresionar}
      disabled={!alPresionar}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      style={[
        estilos.chip,
        compacto && estilos.compacto,
        activo && estilos.activo,
        estilo,
      ]}
    >
      {icono ? (
        <Icono
          nombre={icono}
          tamaño={compacto ? 13 : 15}
          color={activo ? "#FFFFFF" : COLORES.primario}
        />
      ) : null}
      <Text
        style={[
          estilos.texto,
          compacto && estilos.textoCompacto,
          activo && estilos.textoActivo,
        ]}
      >
        {texto}
      </Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  chip: {
    minHeight: 42,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.xs,
    borderRadius: RADIO.completo,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.xs,
    ...SOMBRAS.sm,
  },
  compacto: {
    minHeight: 36,
    paddingHorizontal: ESPACIADO.sm + 2,
  },
  activo: {
    backgroundColor: COLORES.primario,
    borderColor: COLORES.primario,
  },
  texto: {
    color: COLORES.textoSecundario,
    fontSize: 14,
    fontFamily: FUENTES.semibold,
  },
  textoCompacto: {
    fontSize: 13,
  },
  textoActivo: {
    color: "#FFFFFF",
  },
});
