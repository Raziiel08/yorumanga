import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Alert } from '../../utils/alertas';
import Entrada from '../../components/Campo';
import Boton from '../../components/Boton';
import EncabezadoPantalla from '../../components/EncabezadoPantalla';
import { suppliersService } from '../../services/proveedores';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';

export default function ProveedorFormScreen({
  route,
  navigation
}) {
  const supplier = route?.params?.supplier;
  const [nombre, setNombre] = useState(supplier?.nombre || '');
  const [contacto, setContacto] = useState(supplier?.contacto || '');
  const [email, setEmail] = useState(supplier?.email || '');
  const [direccion, setDireccion] = useState(supplier?.direccion || '');
  const [cargando, setCargando] = useState(false);
  const save = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    setCargando(true);
    try {
      const payload = {
        nombre,
        contacto,
        email,
        direccion
      };
      if (supplier) await suppliersService.update(supplier.id, payload);else await suppliersService.create(payload);
      Alert.alert('Éxito', 'Proveedor guardado');
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
          kicker={supplier ? 'EDITAR' : 'ALTA'}
          titulo={supplier ? 'Editar proveedor' : 'Nuevo proveedor'}
          descripcion="Los datos se usan para organizar entregas y contactos."
          estilo={styles.encabezado}
        />
        <Entrada etiqueta="Proveedor" placeholder="Nombre de la empresa" value={nombre} onChangeText={setNombre} />
        <Entrada etiqueta="Contacto" placeholder="Persona de contacto" value={contacto} onChangeText={setContacto} />
        <Entrada etiqueta="Correo electrónico" placeholder="proveedor@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Entrada etiqueta="Dirección" placeholder="Dirección del proveedor" value={direccion} onChangeText={setDireccion} />
        <Boton
          titulo={supplier ? 'Guardar cambios' : 'Crear proveedor'}
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
