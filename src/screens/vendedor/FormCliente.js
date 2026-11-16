import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Alert } from '../../utils/alertas';
import Entrada from '../../components/Campo';
import Boton from '../../components/Boton';
import Icono from '../../components/Icono';
import EncabezadoPantalla from '../../components/EncabezadoPantalla';
import { clientsService } from '../../services/clientes';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';

export default function ClienteFormScreen({
  route,
  navigation
}) {
  const client = route?.params?.client;
  const [nombre, setNombre] = useState(client?.nombre || '');
  const [email, setEmail] = useState(client?.email || '');
  const [direccion, setDireccion] = useState(client?.direccion || '');
  const [cargando, setCargando] = useState(false);
  const save = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    setCargando(true);
    try {
      if (client) {
        await clientsService.update(client.id, {
          nombre,
          email,
          direccion
        });
      } else {
        await clientsService.create({
          nombre,
          email,
          direccion
        });
      }
      Alert.alert('Éxito', 'Cliente guardado');
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
      <View style={styles.tarjeta}>
        <EncabezadoPantalla
          kicker={client ? 'EDITAR' : 'ALTA'}
          titulo={client ? 'Editar cliente' : 'Nuevo cliente'}
          descripcion="Los datos se usan para asociar ventas presenciales."
          estilo={styles.encabezado}
        />
        <Entrada etiqueta="Nombre" placeholder="Nombre completo" value={nombre} onChangeText={setNombre} />
        <Entrada etiqueta="Correo electrónico" placeholder="cliente@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Entrada etiqueta="Dirección" placeholder="Dirección del cliente" value={direccion} onChangeText={setDireccion} />
        <Boton
          titulo={client ? 'Guardar cambios' : 'Crear cliente'}
          icono="checkmark"
          tamaño="lg"
          alPresionar={save}
          cargando={cargando}
        />
      </View>
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
  tarjeta: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    padding: ESPACIADO.lg,
    ...SOMBRAS.sm,
  },
  encabezado: {
    marginBottom: ESPACIADO.md,
  },
});
