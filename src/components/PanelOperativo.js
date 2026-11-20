import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../constants/theme";
import Icono from "./Icono";
import LogoMarca from "./LogoMarca";

export default function PanelOperativo({
  navigation,
  user,
  signOut,
  rol,
  descripcion,
  color,
  colorSuave,
  accesos,
}) {
  const { width } = useWindowDimensions();
  const mobile = width < 600;
  const columnas = mobile ? 1 : width < 1024 ? 2 : 3;
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1200);
  const espacio = ESPACIADO.md;
  const anchoTarjeta = (anchoContenido - espacio * (columnas - 1)) / columnas;
  const nombre = user?.nombre?.trim().split(/\s+/)[0] || "equipo";

  return (
    <ScrollView
      style={estilos.pantalla}
      contentContainerStyle={estilos.contenidoScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={[estilos.contenido, { maxWidth: anchoContenido }]}>
        <LinearGradient
          colors={["#3B2A3E", COLORES.primarioOscuro]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={estilos.hero}
        >
          <View style={estilos.heroBrillo} />

          <View style={[estilos.heroBarra, mobile && estilos.heroBarraMobile]}>
            <View style={estilos.identidad}>
              <LogoMarca ancho={108} />
              <Text style={[estilos.rol, { color }]}>{rol}</Text>
            </View>
            <TouchableOpacity
              onPress={signOut}
              style={estilos.botonSalir}
              activeOpacity={0.75}
              accessibilityRole="button"
            >
              <Icono nombre="log-out-outline" tamaño={16} color="#F4EBF0" />
              <Text style={estilos.textoSalir}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>

          <View style={estilos.filaKicker}>
            <View style={[estilos.heroPunto, { backgroundColor: color }]} />
            <Text style={estilos.kicker}>PANEL {rol.toUpperCase()}</Text>
          </View>
          <Text style={estilos.saludo}>Hola, {nombre}.</Text>
          <Text style={estilos.descripcionHero}>{descripcion}</Text>
        </LinearGradient>

        <View style={estilos.seccionEncabezado}>
          <View>
            <Text style={estilos.sobreTitulo}>TU ESPACIO DE TRABAJO</Text>
            <Text style={estilos.tituloSeccion}>Accesos rápidos</Text>
          </View>
          <Text style={estilos.contador}>
            {String(accesos.length).padStart(2, "0")} opciones
          </Text>
        </View>

        <View style={estilos.grilla}>
          {accesos.map((acceso) => (
            <TouchableOpacity
              key={acceso.pantalla}
              style={[
                estilos.tarjeta,
                { width: anchoTarjeta, borderTopColor: color },
              ]}
              onPress={() => navigation.navigate(acceso.pantalla)}
              activeOpacity={0.84}
              accessibilityRole="button"
            >
              <View style={estilos.tarjetaCabecera}>
                <View
                  style={[estilos.iconoFondo, { backgroundColor: colorSuave }]}
                >
                  <Icono nombre={acceso.icono} tamaño={22} color={color} />
                </View>
                <Icono nombre="arrow-forward" tamaño={18} color={color} />
              </View>
              <Text style={estilos.tituloTarjeta}>{acceso.titulo}</Text>
              <Text style={estilos.descripcionTarjeta}>
                {acceso.descripcion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={estilos.pie}>YORUMANGA · {rol.toUpperCase()}</Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenidoScroll: {
    alignItems: "center",
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.xl,
  },
  contenido: {
    width: "100%",
  },
  hero: {
    overflow: "hidden",
    borderRadius: RADIO.xl,
    padding: ESPACIADO.xl,
    marginBottom: ESPACIADO.xl,
    ...SOMBRAS.md,
  },
  heroBrillo: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: RADIO.completo,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  heroBarra: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ESPACIADO.xl,
  },
  heroBarraMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: ESPACIADO.md,
  },
  identidad: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: ESPACIADO.sm,
  },
  rol: {
    fontSize: 11,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
    borderRadius: RADIO.completo,
    paddingHorizontal: ESPACIADO.sm + 2,
    paddingVertical: 4,
  },
  botonSalir: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.xs,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.sm,
    borderRadius: RADIO.completo,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  textoSalir: {
    color: "#F4EBF0",
    fontSize: 13,
    fontFamily: FUENTES.semibold,
  },
  filaKicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.xs,
  },
  heroPunto: {
    width: 8,
    height: 8,
    borderRadius: RADIO.completo,
  },
  kicker: {
    color: "#D8CDD7",
    fontSize: 12,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 2.2,
  },
  saludo: {
    color: COLORES.superficie,
    fontSize: 46,
    fontFamily: FUENTES.display,
    letterSpacing: 0.5,
  },
  descripcionHero: {
    color: "#D6CDD5",
    fontSize: 15,
    fontFamily: FUENTES.medio,
    lineHeight: 23,
    marginTop: ESPACIADO.sm,
    maxWidth: 540,
  },
  seccionEncabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: ESPACIADO.md,
  },
  sobreTitulo: {
    color: COLORES.textoAtenuado,
    fontSize: 11,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 1.8,
    marginBottom: ESPACIADO.xs,
  },
  tituloSeccion: {
    color: COLORES.texto,
    fontSize: 30,
    fontFamily: FUENTES.display,
    letterSpacing: 0.4,
  },
  contador: {
    color: COLORES.textoSecundario,
    fontSize: 12,
    fontFamily: FUENTES.semibold,
    marginBottom: 4,
  },
  grilla: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: ESPACIADO.md,
  },
  tarjeta: {
    minHeight: 176,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    borderTopWidth: 3,
    padding: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  tarjetaCabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: ESPACIADO.md,
  },
  iconoFondo: {
    width: 46,
    height: 46,
    borderRadius: RADIO.md,
    alignItems: "center",
    justifyContent: "center",
  },
  tituloTarjeta: {
    color: COLORES.texto,
    fontSize: 17,
    fontFamily: FUENTES.bold,
  },
  descripcionTarjeta: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.medio,
    lineHeight: 19,
    marginTop: ESPACIADO.xs,
  },
  pie: {
    color: COLORES.textoAtenuado,
    fontSize: 10,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 1.4,
    marginTop: ESPACIADO.xl,
    textAlign: "center",
  },
});
