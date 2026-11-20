import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORES } from "../constants/theme";

/**
 * Ícono del sistema de diseño (Ionicons).
 * `nombre` usa los nombres de Ionicons: "home", "grid", "cart", "person",
 * "search", "sparkles", "book", "chevron-forward", "trash", etc.
 */
export default function Icono({
  nombre,
  tamaño = 20,
  color = COLORES.texto,
  estilo,
}) {
  return <Ionicons name={nombre} size={tamaño} color={color} style={estilo} />;
}
