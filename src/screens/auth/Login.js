import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/ContextoAuth";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { correoValido, validarErrorCorreo } from "../../utils/validaciones";
import { Alert } from "../../utils/alertas";
import Icono from "../../components/Icono";
import LogoMarca from "../../components/LogoMarca";

export default function PantallaLogin({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [campoEnfocado, setCampoEnfocado] = useState(null);
  const { signIn } = useAuth();

  const manejarLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    const errorCorreo = validarErrorCorreo(correo);
    if (errorCorreo) {
      Alert.alert("Correo electrónico inválido", errorCorreo);
      return;
    }
    setCargando(true);
    const { error } = await signIn(correo, contrasena);
    setCargando(false);
    if (error) Alert.alert("Error", error.message);
  };

  return (
    <KeyboardAvoidingView
      style={estilos.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.encabezado}>
          <View style={estilos.logoContenedor}>
            <LogoMarca ancho={158} />
          </View>
          <Text style={estilos.logoSlogan}>Tu tienda de mangas físicos</Text>
        </View>

        <View style={estilos.tarjeta}>
          <Text style={estilos.tituloPrincipal}>Iniciar sesión</Text>

          <Text style={estilos.etiquetaCampo}>Correo electrónico</Text>
          <TextInput
            style={[
              estilos.entrada,
              campoEnfocado === "correo" && estilos.entradaEnfocada,
            ]}
            placeholder="usuario@email.com"
            placeholderTextColor={COLORES.textoAtenuado}
            value={correo}
            onChangeText={setCorreo}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setCampoEnfocado("correo")}
            onBlur={() => setCampoEnfocado(null)}
          />

          <Text style={estilos.etiquetaCampo}>Contraseña</Text>
          <View style={estilos.filaEntrada}>
            <TextInput
              style={[
                estilos.entrada,
                { flex: 1, marginBottom: 0 },
                campoEnfocado === "contrasena" && estilos.entradaEnfocada,
              ]}
              placeholder="••••••••"
              placeholderTextColor={COLORES.textoAtenuado}
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry={!verContrasena}
              onFocus={() => setCampoEnfocado("contrasena")}
              onBlur={() => setCampoEnfocado(null)}
            />
            <TouchableOpacity
              style={estilos.botonOjo}
              onPress={() => setVerContrasena(!verContrasena)}
            >
              <Icono
                nombre={verContrasena ? "eye-off" : "eye"}
                tamaño={18}
                color={COLORES.primario}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[estilos.boton, cargando && estilos.botonDeshabilitado]}
            onPress={manejarLogin}
            disabled={cargando}
            activeOpacity={0.85}
          >
            <Text style={estilos.textoBoton}>
              {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.contenedorEnlace}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={estilos.textoEnlace}>
              ¿No tenés cuenta?{" "}
              <Text style={estilos.textoEnlaceNegrita}>Registrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: ESPACIADO.lg,
  },
  encabezado: {
    alignItems: "center",
    marginBottom: ESPACIADO.xl,
  },
  logoContenedor: {
    backgroundColor: COLORES.primarioOscuro,
    borderRadius: RADIO.lg,
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: ESPACIADO.xs,
    marginBottom: ESPACIADO.xs,
    overflow: "hidden",
  },
  logoSlogan: {
    fontSize: 14,
    color: COLORES.textoSecundario,
    marginTop: ESPACIADO.xs,
    letterSpacing: 0.5,
  },
  tarjeta: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.xl,
    borderRadius: RADIO.xl,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.md,
  },
  tituloPrincipal: {
    fontSize: 30,
    fontFamily: FUENTES.display,
    letterSpacing: 0.8,
    color: COLORES.texto,
    marginBottom: ESPACIADO.lg,
  },
  etiquetaCampo: {
    fontSize: 13,
    fontFamily: FUENTES.bold,
    color: COLORES.textoSecundario,
    marginBottom: ESPACIADO.xs,
    letterSpacing: 0.2,
  },
  entrada: {
    backgroundColor: COLORES.fondo,
    color: COLORES.texto,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: 14,
    borderRadius: RADIO.sm,
    marginBottom: ESPACIADO.md,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    fontSize: 15,
    fontFamily: FUENTES.medio,
  },
  entradaEnfocada: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.superficie,
  },
  boton: {
    backgroundColor: COLORES.primario,
    paddingVertical: ESPACIADO.md,
    borderRadius: RADIO.sm,
    alignItems: "center",
    marginTop: ESPACIADO.sm,
    ...SOMBRAS.sm,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  contenedorEnlace: {
    marginTop: ESPACIADO.lg,
    alignItems: "center",
  },
  textoEnlace: {
    color: COLORES.textoSecundario,
    fontSize: 14,
    fontFamily: FUENTES.medio,
  },
  textoEnlaceNegrita: {
    color: COLORES.primario,
    fontFamily: FUENTES.extrabold,
  },
  filaEntrada: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.md,
  },
  botonOjo: {
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: 10,
  },
  textoOjo: {
    color: COLORES.primario,
    fontWeight: "700",
    fontSize: 13,
  },
});
