import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORES, ESPACIADO, FUENTES, RADIO } from '../constants/theme';

const VARIANTES = {
  acento: { fondo: COLORES.acento, texto: '#FFFFFF' },
  acentoSuave: { fondo: COLORES.acentoTinte, texto: COLORES.acentoOscuro },
  primario: { fondo: COLORES.primario, texto: '#FFFFFF' },
  primarioSuave: { fondo: COLORES.primarioTinte, texto: COLORES.primario },
  exito: { fondo: COLORES.exitoClaro, texto: COLORES.exito },
  advertencia: { fondo: COLORES.advertenciaClara, texto: COLORES.advertencia },
  error: { fondo: COLORES.errorClaro, texto: COLORES.error },
  info: { fondo: COLORES.infoClaro, texto: COLORES.info },
  neutro: { fondo: COLORES.superficieAlterna, texto: COLORES.textoSecundario },
};

/**
 * Etiqueta (badge) reutilizable: "OFERTA", estados de pedidos, stock, etc.
 */
export default function Etiqueta({ texto, variante = 'neutro', estilo, estiloTexto }) {
  const paleta = VARIANTES[variante] || VARIANTES.neutro;
  return (
    <View style={[estilos.etiqueta, { backgroundColor: paleta.fondo }, estilo]}>
      <Text style={[estilos.texto, { color: paleta.texto }, estiloTexto]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: 3,
    borderRadius: RADIO.completo,
  },
  texto: {
    fontSize: 10,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 0.8,
  },
});
