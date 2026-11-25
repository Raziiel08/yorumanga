import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORES } from "../constants/theme";

export default function Icono({
  nombre,
  tamaño = 20,
  color = COLORES.texto,
  estilo,
}) {
  return <Ionicons name={nombre} size={tamaño} color={color} style={estilo} />;
}
