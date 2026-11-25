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
import {
  correoValido,
  validarCamposObligatorios,
  validarContrasena,
  validarErrorCorreo,
} from "../../utils/validaciones";
import Icono from "../../components/Icono";
import LogoMarca from "../../components/LogoMarca";

const ROLES = [
  { valor: "cliente",   etiqueta: "Cliente",   icono: "person",        descripcion: "Comprá mangas online" },
  { valor: "vendedor",  etiqueta: "Vendedor",   icono: "cash",          descripcion: "Ventas en mostrador" },
  { valor: "deposito",  etiqueta: "Depósito",   icono: "cube",          descripcion: "Stock y proveedores" },
  { valor: "admin",     etiqueta: "Admin",      icono: "settings",      descripcion: "Gestión total" },
];

export default function PantallaRegistro({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [campoEnfocado, setCampoEnfocado] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [rolSeleccionado, setRolSeleccionado] = useState("cliente");
  const { signUp } = useAuth();

  const manejarRegistro = async () => {
    const errorRequerido = validarCamposObligatorios([
      { nombre: "Nombre", valor: nombre },
      { nombre: "Correo electrónico", valor: correo },
      { nombre: "Contraseña", valor: contrasena },
      { nombre: "Confirmar contraseña", valor: confirmarContrasena },
    ]);
    if (errorRequerido) {
      setMensaje({ tipo: "error", texto: errorRequerido });
      return;
    }
    const errorCorreo = validarErrorCorreo(correo);
    if (errorCorreo) {
      setMensaje({
        tipo: "error",
        texto: errorCorreo,
      });
      return;
    }
    if (contrasena !== confirmarContrasena) {
      setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden." });
      return;
    }
    const errorPass = validarContrasena(contrasena);
    if (errorPass) {
      setMensaje({ tipo: "error", texto: errorPass });
      return;
    }
    setMensaje(null);
    setCargando(true);
    try {
      const { error } = await signUp(
        correo.trim(),
        contrasena,
        nombre.trim(),
        rolSeleccionado
      );
      if (error) {
        console.error("signUp error:", error);
        setMensaje({
          tipo: "error",
          texto:
            error.message || "No se pudo crear la cuenta. Intentá nuevamente.",
        });
      } else {
        const rolLabel = ROLES.find((r) => r.valor === rolSeleccionado)?.etiqueta || rolSeleccionado;
        setMensaje({
          tipo: "exito",
          texto: `Cuenta creada como ${rolLabel}. Si se solicita confirmación de correo, revisá tu bandeja; después iniciá sesión.`,
        });
      }
    } catch (e) {
      console.error("manejarRegistro exception:", e);
      setMensaje({
        tipo: "error",
        texto: e.message || "No se pudo crear la cuenta. Intentá nuevamente.",
      });
    } finally {
      setCargando(false);
    }
  };

  const cambiarCampo = (actualizar) => (valor) => {
    actualizar(valor);
    setMensaje(null);
  };

  const renderCampo = (etiqueta, valor, alCambiar, propiedadesExtra = {}) => (
    <View style={estilos.grupoCampo} key={etiqueta}>
      <Text style={estilos.etiquetaCampo}>{etiqueta}</Text>
      <TextInput
        style={[
          estilos.entrada,
          campoEnfocado === etiqueta && estilos.entradaEnfocada,
        ]}
        placeholder={etiqueta}
        placeholderTextColor={COLORES.textoAtenuado}
        value={valor}
        onChangeText={cambiarCampo(alCambiar)}
        onFocus={() => setCampoEnfocado(etiqueta)}
        onBlur={() => setCampoEnfocado(null)}
        {...propiedadesExtra}
      />
    </View>
  );

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
          <Text style={estilos.logoSlogan}>Creá tu cuenta</Text>
        </View>

        <View style={estilos.tarjeta}>
          <Text style={estilos.tituloPrincipal}>Registro</Text>

          {mensaje && (
            <View
              style={[
                estilos.mensaje,
                mensaje.tipo === "error"
                  ? estilos.mensajeError
                  : estilos.mensajeExito,
              ]}
            >
              <Text
                style={[
                  estilos.textoMensaje,
                  mensaje.tipo === "error"
                    ? estilos.textoMensajeError
                    : estilos.textoMensajeExito,
                ]}
              >
                {mensaje.texto}
              </Text>
            </View>
          )}

          {renderCampo("Nombre", nombre, setNombre)}
          {renderCampo("Correo electrónico", correo, setCorreo, {
            autoCapitalize: "none",
            keyboardType: "email-address",
          })}

          <View style={estilos.grupoCampo}>
            <Text style={estilos.etiquetaCampo}>Tipo de cuenta</Text>
            <View style={estilos.filaRoles}>
              {ROLES.map((rol) => {
                const activo = rolSeleccionado === rol.valor;
                return (
                  <TouchableOpacity
                    key={rol.valor}
                    style={[estilos.tarjetaRol, activo && estilos.tarjetaRolActiva]}
                    onPress={() => setRolSeleccionado(rol.valor)}
                    activeOpacity={0.75}
                  >
                    <Icono
                      nombre={rol.icono}
                      tamaño={22}
                      color={activo ? COLORES.primario : COLORES.textoAtenuado}
                    />
                    <Text style={[estilos.textoRol, activo && estilos.textoRolActivo]}>
                      {rol.etiqueta}
                    </Text>
                    <Text style={[estilos.descripcionRol, activo && estilos.descripcionRolActiva]}>
                      {rol.descripcion}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={estilos.grupoCampo}>
            <Text style={estilos.etiquetaCampo}>Contraseña</Text>
            <View style={estilos.filaEntrada}>
              <TextInput
                style={[estilos.entrada, { flex: 1, marginBottom: 0 }]}
                placeholder="Contraseña"
                placeholderTextColor={COLORES.textoAtenuado}
                value={contrasena}
                onChangeText={cambiarCampo(setContrasena)}
                secureTextEntry={!verContrasena}
                autoCapitalize="none"
                onFocus={() => setCampoEnfocado("Contraseña")}
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
          </View>

          <View style={estilos.grupoCampo}>
            <Text style={estilos.etiquetaCampo}>Confirmar contraseña</Text>
            <View style={estilos.filaEntrada}>
              <TextInput
                style={[estilos.entrada, { flex: 1, marginBottom: 0 }]}
                placeholder="Confirmar contraseña"
                placeholderTextColor={COLORES.textoAtenuado}
                value={confirmarContrasena}
                onChangeText={cambiarCampo(setConfirmarContrasena)}
                secureTextEntry={!verConfirmar}
                autoCapitalize="none"
                onFocus={() => setCampoEnfocado("Confirmar contraseña")}
                onBlur={() => setCampoEnfocado(null)}
              />
              <TouchableOpacity
                style={estilos.botonOjo}
                onPress={() => setVerConfirmar(!verConfirmar)}
              >
                <Icono
                  nombre={verConfirmar ? "eye-off" : "eye"}
                  tamaño={18}
                  color={COLORES.primario}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[estilos.boton, cargando && estilos.botonDeshabilitado]}
            onPress={manejarRegistro}
            disabled={cargando}
            activeOpacity={0.85}
          >
            <Text style={estilos.textoBoton}>
              {cargando ? "Registrando..." : "Crear cuenta"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.contenedorEnlace}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={estilos.textoEnlace}>
              ¿Ya tenés cuenta?{" "}
              <Text style={estilos.textoEnlaceNegrita}>Iniciá sesión</Text>
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
    paddingVertical: ESPACIADO.xxl,
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
    maxWidth: 460,
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
  mensaje: {
    borderRadius: RADIO.sm,
    borderWidth: 1,
    padding: ESPACIADO.md,
    marginBottom: ESPACIADO.md,
  },
  mensajeError: {
    backgroundColor: COLORES.errorClaro,
    borderColor: COLORES.error,
  },
  mensajeExito: {
    backgroundColor: COLORES.exitoClaro,
    borderColor: COLORES.exito,
  },
  textoMensaje: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FUENTES.medio,
  },
  textoMensajeError: {
    color: COLORES.error,
  },
  textoMensajeExito: {
    color: COLORES.exito,
  },
  grupoCampo: {
    marginBottom: ESPACIADO.md,
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
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    fontSize: 15,
    fontFamily: FUENTES.medio,
  },
  entradaEnfocada: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.superficie,
  },
  filaRoles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ESPACIADO.sm,
  },
  tarjetaRol: {
    flex: 1,
    minWidth: "44%",
    alignItems: "center",
    padding: ESPACIADO.md,
    borderRadius: RADIO.md,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.fondo,
    gap: ESPACIADO.xs,
  },
  tarjetaRolActiva: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primarioTinte,
  },
  textoRol: {
    fontSize: 13,
    fontFamily: FUENTES.extrabold,
    color: COLORES.textoSecundario,
    textAlign: "center",
  },
  textoRolActivo: {
    color: COLORES.primario,
  },
  descripcionRol: {
    fontSize: 11,
    fontFamily: FUENTES.medio,
    color: COLORES.textoAtenuado,
    textAlign: "center",
  },
  descripcionRolActiva: {
    color: COLORES.primarioClaro,
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
  },
  botonOjo: {
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: 10,
  },
});
