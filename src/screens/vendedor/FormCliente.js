import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Alert } from "../../utils/alertas";
import Entrada from "../../components/Campo";
import Boton from "../../components/Boton";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import { clientsService } from "../../services/clientes";
import { validarErrorCorreo } from "../../utils/validaciones";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";

export default function ClienteFormScreen({ route, navigation }) {
  const client = route?.params?.client;
  const [nombre, setNombre] = useState(client?.nombre || "");
  const [email, setEmail] = useState(client?.email || "");
  const [direccion, setDireccion] = useState(client?.direccion || "");
  const [cargando, setCargando] = useState(false);

  const save = async () => {
    const nombreLimpio = nombre.trim();
    const emailLimpio = email.trim();
    const direccionLimpia = direccion.trim();

    if (!nombreLimpio) {
      Alert.alert("Campo obligatorio", "Tenés que completar el nombre del cliente.");
      return;
    }
    if (!emailLimpio) {
      Alert.alert("Campo obligatorio", "Tenés que completar el correo electrónico del cliente.");
      return;
    }
    const errorCorreo = validarErrorCorreo(emailLimpio);
    if (errorCorreo) {
      Alert.alert("Correo electrónico inválido", errorCorreo);
      return;
    }
    if (!direccionLimpia) {
      Alert.alert("Campo obligatorio", "Tenés que completar la dirección del cliente.");
      return;
    }

    setCargando(true);
    try {
      const payload = {
        nombre: nombreLimpio,
        email: emailLimpio,
        direccion: direccionLimpia,
      };
      if (client) {
        await clientsService.update(client.id, payload);
      } else {
        await clientsService.create(payload);
      }
      Alert.alert("Éxito", "Cliente guardado correctamente");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudo guardar el cliente.");
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
          kicker={client ? "EDITAR" : "ALTA"}
          titulo={client ? "Editar cliente" : "Nuevo cliente"}
          descripcion="Todos los campos son obligatorios para asociar ventas presenciales."
          estilo={styles.encabezado}
        />
        <Entrada
          etiqueta="Nombre completo *"
          placeholder="Ej: Juan Pérez"
          value={nombre}
          onChangeText={setNombre}
        />
        <Entrada
          etiqueta="Correo electrónico * (@gmail.com, etc.)"
          placeholder="juanperez@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Entrada
          etiqueta="Dirección *"
          placeholder="Ej: Av. Rivadavia 4567, CABA"
          value={direccion}
          onChangeText={setDireccion}
        />
        <Boton
          titulo={client ? "Guardar cambios" : "Crear cliente"}
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
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
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
