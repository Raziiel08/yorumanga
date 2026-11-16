import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icono from './Icono';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../constants/theme';

/**
 * Banner de error inline para reemplazar las alertas nativas de
 * carga / API. Muestra el mensaje y un botón "Reintentar" opcional.
 */
export default function AvisoError({ mensaje, alReintentar, estilo }) {
  if (!mensaje) return null;
  return (
    <View style={[estilos.banner, estilo]}>
      <Icono nombre="alert-circle" tamaño={18} color={COLORES.error} />
      <Text style={estilos.texto} numberOfLines={3}>{mensaje}</Text>
      {alReintentar ? (
        <TouchableOpacity
          onPress={alReintentar}
          style={estilos.botonReintentar}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Icono nombre="refresh" tamaño={14} color="#FFFFFF" />
          <Text style={estilos.textoReintentar}>Reintentar</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.errorClaro,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.error,
    padding: ESPACIADO.sm + 2,
    marginBottom: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  texto: {
    flex: 1,
    color: COLORES.error,
    fontFamily: FUENTES.bold,
    fontSize: 13,
    lineHeight: 18,
  },
  botonReintentar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORES.error,
    borderRadius: RADIO.completo,
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: ESPACIADO.xs,
  },
  textoReintentar: {
    color: '#FFFFFF',
    fontFamily: FUENTES.extrabold,
    fontSize: 12,
  },
});
