import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Alert } from '../../utils/alertas';
import Entrada from '../../components/Campo';
import Boton from '../../components/Boton';
import Icono from '../../components/Icono';
import EncabezadoPantalla from '../../components/EncabezadoPantalla';
import { stockService } from '../../services/stock';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';

export default function MovimientoStockScreen({
  route,
  navigation
}) {
  const product = route.params.product;
  const [tipo, setTipo] = useState('entrada');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [cargando, setCargando] = useState(false);
  const save = async () => {
    const qty = parseInt(cantidad, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Cantidad inválida');
      return;
    }
    if (!motivo.trim()) {
      Alert.alert('Error', 'El motivo es obligatorio');
      return;
    }
    setCargando(true);
    try {
      if (tipo === 'entrada') {
        await stockService.registerEntry(product.id, qty, motivo);
      } else {
        await stockService.registerExit(product.id, qty, motivo);
      }
      Alert.alert('Éxito', 'Movimiento registrado');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setCargando(false);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contenidoScroll}
      showsVerticalScrollIndicator
      keyboardShouldPersistTaps="handled"
    >
      <EncabezadoPantalla
        kicker="MOVIMIENTO DE STOCK"
        titulo={product.titulo}
        descripcion="Registrá una entrada o salida de unidades."
        estilo={styles.encabezado}
      />

      <View style={styles.tarjetaStock}>
        <Icono nombre="cube" tamaño={20} color={COLORES.primario} />
        <Text style={styles.tarjetaStockTexto}>Stock actual</Text>
        <Text style={styles.tarjetaStockValor}>{product.stock}</Text>
      </View>

      <View style={styles.filaTipo}>
        <TouchableOpacity
          style={[styles.botonTipo, tipo === 'entrada' && styles.botonTipoActivo]}
          onPress={() => setTipo('entrada')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityState={{ selected: tipo === 'entrada' }}
        >
          <Icono
            nombre="arrow-down-circle"
            tamaño={20}
            color={tipo === 'entrada' ? '#FFFFFF' : COLORES.exito}
          />
          <Text
            style={[
              styles.textoTipo,
              tipo === 'entrada' && styles.textoTipoActivo,
            ]}
          >
            Entrada
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonTipo, tipo === 'salida' && styles.botonTipoActivoSalida]}
          onPress={() => setTipo('salida')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityState={{ selected: tipo === 'salida' }}
        >
          <Icono
            nombre="arrow-up-circle"
            tamaño={20}
            color={tipo === 'salida' ? '#FFFFFF' : COLORES.error}
          />
          <Text
            style={[
              styles.textoTipo,
              tipo === 'salida' && styles.textoTipoActivo,
            ]}
          >
            Salida
          </Text>
        </TouchableOpacity>
      </View>

      <Entrada etiqueta="Cantidad" placeholder="Unidades a mover" value={cantidad} onChangeText={setCantidad} keyboardType="numeric" />
      <Entrada etiqueta="Motivo" placeholder="Descripción del movimiento" value={motivo} onChangeText={setMotivo} />

      <Boton
        titulo="Registrar"
        icono="checkmark"
        tamaño="lg"
        alPresionar={save}
        cargando={cargando}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    backgroundColor: COLORES.fondo,
  },
  contenidoScroll: {
    padding: ESPACIADO.lg,
    paddingBottom: ESPACIADO.xxl,
  },
  encabezado: {
    marginBottom: ESPACIADO.md,
  },
  tarjetaStock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    padding: ESPACIADO.md,
    marginBottom: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  tarjetaStockTexto: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    flex: 1,
  },
  tarjetaStockValor: {
    color: COLORES.primario,
    fontFamily: FUENTES.display,
    fontSize: 26,
    letterSpacing: 0.4,
  },
  filaTipo: {
    flexDirection: 'row',
    gap: ESPACIADO.md,
    marginBottom: ESPACIADO.md,
  },
  botonTipo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIADO.xs,
    padding: ESPACIADO.md,
    borderRadius: RADIO.md,
    backgroundColor: COLORES.superficie,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
  },
  botonTipoActivo: {
    backgroundColor: COLORES.exito,
    borderColor: COLORES.exito,
  },
  botonTipoActivoSalida: {
    backgroundColor: COLORES.error,
    borderColor: COLORES.error,
  },
  textoTipo: {
    color: COLORES.texto,
    fontFamily: FUENTES.bold,
    fontSize: 15,
  },
  textoTipoActivo: {
    color: '#FFFFFF',
  },
});
