import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Icono from "./Icono";
import { COLORES, ESPACIADO, FUENTES, RADIO } from "../constants/theme";

/**
 * Botón de acción destructiva con confirmación inline:
 * primer toque → cambia a "¿Confirmar?" en rojo durante unos segundos;
 * segundo toque → ejecuta la acción. Sin popups.
 */
export default function ConfirmarBoton({
  texto = "Eliminar",
  textoConfirmar = "¿Confirmar?",
  icono = "trash-outline",
  alConfirmar,
  compacto = false,
  estilo,
  estiloTexto,
}) {
  const [pendiente, setPendiente] = useState(false);
  const timeout = useRef(null);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const manejarPresion = () => {
    if (!pendiente) {
      setPendiente(true);
      timeout.current = setTimeout(() => setPendiente(false), 4000);
      return;
    }
    clearTimeout(timeout.current);
    setPendiente(false);
    alConfirmar?.();
  };

  return (
    <TouchableOpacity
      onPress={manejarPresion}
      activeOpacity={0.8}
      accessibilityRole="button"
      style={[
        estilos.boton,
        compacto && estilos.compacto,
        pendiente && estilos.pendiente,
        estilo,
      ]}
    >
      <Icono
        nombre={pendiente ? "warning-outline" : icono}
        tamaño={15}
        color={pendiente ? "#FFFFFF" : COLORES.error}
      />
      <Text
        style={[
          estilos.texto,
          pendiente && estilos.textoPendiente,
          estiloTexto,
        ]}
      >
        {pendiente ? textoConfirmar : texto}
      </Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  boton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: ESPACIADO.xs,
    borderRadius: RADIO.completo,
    borderWidth: 1,
    borderColor: COLORES.errorClaro,
    backgroundColor: COLORES.errorClaro,
  },
  compacto: {
    paddingHorizontal: ESPACIADO.xs,
  },
  pendiente: {
    backgroundColor: COLORES.error,
    borderColor: COLORES.error,
  },
  texto: {
    color: COLORES.error,
    fontFamily: FUENTES.bold,
    fontSize: 13,
  },
  textoPendiente: {
    color: "#FFFFFF",
  },
});
