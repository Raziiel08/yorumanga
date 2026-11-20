import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Alert } from "../../utils/alertas";
import Entrada from "../../components/Campo";
import Boton from "../../components/Boton";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import { suppliersService } from "../../services/proveedores";
import { validarErrorCorreo } from "../../utils/validaciones";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";

export default function ProveedorFormScreen({ route, navigation }) {
  const supplier = route?.params?.supplier;
  const [nombre, setNombre] = useState(supplier?.nombre || "");
  const [contacto, setContacto] = useState(supplier?.contacto || "");
  const [email, setEmail] = useState(supplier?.email || "");
  const [direccion, setDireccion] = useState(supplier?.direccion || "");
  const [cargando, setCargando] = useState(false);

  const save = async () => {
    const nombreLimpio = nombre.trim();
    const contactoLimpio = contacto.trim();
    const emailLimpio = email.trim();
    const direccionLimpia = direccion.trim();

    if (!nombreLimpio) {
      Alert.alert("Campo obligatorio", "Tenés que completar el nombre del proveedor.");
      return;
    }
    if (!contactoLimpio) {
      Alert.alert("Campo obligatorio", "Tenés que completar la persona o dato de contacto.");
      return;
    }
    if (!emailLimpio) {
      Alert.alert("Campo obligatorio", "Tenés que completar el correo electrónico.");
      return;
    }
    const errorCorreo = validarErrorCorreo(emailLimpio);
    if (errorCorreo) {
      Alert.alert("Correo electrónico inválido", errorCorreo);
      return;
    }
    if (!direccionLimpia) {
      Alert.alert("Campo obligatorio", "Tenés que completar la dirección del proveedor.");
      return;
    }

    setCargando(true);
    try {
      const payload = {
        nombre: nombreLimpio,
        contacto: contactoLimpio,
        email: emailLimpio,
        direccion: direccionLimpia,
      };
      if (supplier) await suppliersService.update(supplier.id, payload);
      else await suppliersService.create(payload);
      Alert.alert("Éxito", "Proveedor guardado correctamente");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudo guardar el proveedor.");
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
          kicker={supplier ? "EDITAR" : "ALTA"}
          titulo={supplier ? "Editar proveedor" : "Nuevo proveedor"}
          descripcion="Todos los campos son obligatorios para organizar entregas y contactos."
          estilo={styles.encabezado}
        />
        <Entrada
          etiqueta="Proveedor *"
          placeholder="Ej: Editorial Ivrea"
          value={nombre}
          onChangeText={setNombre}
        />
        <Entrada
          etiqueta="Persona de Contacto *"
          placeholder="Ej: Martín Rodríguez"
          value={contacto}
          onChangeText={setContacto}
        />
        <Entrada
          etiqueta="Correo electrónico * (.com)"
          placeholder="contacto@proveedor.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Entrada
          etiqueta="Dirección *"
          placeholder="Ej: Av. Belgrano 1234, CABA"
          value={direccion}
          onChangeText={setDireccion}
        />
        <Boton
          titulo={supplier ? "Guardar cambios" : "Crear proveedor"}
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
    backgroundColor: COLORES.fondo,
  },
  contenidoScroll: {
    padding: ESPACIADO.lg,
    paddingBottom: ESPACIADO.xxl,
    alignItems: "center",
  },
  tarjeta: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    padding: ESPACIADO.xl,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.md,
  },
  encabezado: {
    marginBottom: ESPACIADO.md,
  },
});
