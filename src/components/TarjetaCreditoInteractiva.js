import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icono from "./Icono";
import { COLORES, FUENTES, RADIO, SOMBRAS } from "../constants/theme";

/**
 * Detecta la marca de la tarjeta según los primeros dígitos
 */
export function detectarMarcaTarjeta(numero) {
  const limpio = (numero || "").replace(/\D/g, "");
  if (/^4/.test(limpio)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(limpio)) return "mastercard";
  if (/^3[47]/.test(limpio)) return "amex";
  if (/^(5895|6042)/.test(limpio)) return "cabal";
  if (/^589562/.test(limpio)) return "naranja";
  return "generica";
}

/**
 * Formatea número de tarjeta en grupos de 4 (o 4-6-5 para Amex)
 */
export function formatearNumeroTarjeta(valor, marca = "generica") {
  const limpio = (valor || "").replace(/\D/g, "").slice(0, marca === "amex" ? 15 : 16);
  if (marca === "amex") {
    const parte1 = limpio.slice(0, 4);
    const parte2 = limpio.slice(4, 10);
    const parte3 = limpio.slice(10, 15);
    return [parte1, parte2, parte3].filter(Boolean).join(" ");
  }
  return limpio.match(/.{1,4}/g)?.join(" ") || limpio;
}

/**
 * Formatea fecha MM/AA
 */
export function formatearExpiracion(valor) {
  const limpio = (valor || "").replace(/\D/g, "").slice(0, 4);
  if (limpio.length >= 3) {
    return `${limpio.slice(0, 2)}/${limpio.slice(2, 4)}`;
  }
  return limpio;
}

export default function TarjetaCreditoInteractiva({
  numero = "",
  nombre = "",
  expiracion = "",
  cvv = "",
  volteada = false,
  onAlternarGiro,
  tipoTarjeta = "crédito", // 'crédito' | 'débito'
}) {
  const animacionGiro = useRef(new Animated.Value(volteada ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animacionGiro, {
      toValue: volteada ? 1 : 0,
      friction: 8,
      tension: 20,
      useNativeDriver: false,
    }).start();
  }, [volteada]);

  const marca = detectarMarcaTarjeta(numero);

  // Formato visual para mostrar los números en la tarjeta
  const digitosLimpios = (numero || "").replace(/\D/g, "");
  const mascaraBase = marca === "amex" ? "•••• •••••• •••••" : "•••• •••• •••• ••••";
  
  let numeroMostrado = mascaraBase;
  if (digitosLimpios.length > 0) {
    const formateado = formatearNumeroTarjeta(digitosLimpios, marca);
    numeroMostrado = formateado + mascaraBase.slice(formateado.length);
  }

  // Interpolaciones para rotación 3D
  const giroFrente = animacionGiro.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const giroDorso = animacionGiro.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const opacidadFrente = animacionGiro.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  const opacidadDorso = animacionGiro.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  // Renderizado del logo de la marca
  const renderLogoMarca = () => {
    switch (marca) {
      case "visa":
        return (
          <View style={estilos.logoVisa}>
            <Text style={estilos.textoVisa}>VISA</Text>
          </View>
        );
      case "mastercard":
        return (
          <View style={estilos.logoMastercard}>
            <View style={[estilos.circuloMC, estilos.circuloRojoMC]} />
            <View style={[estilos.circuloMC, estilos.circuloNaranjaMC]} />
          </View>
        );
      case "amex":
        return (
          <View style={estilos.logoAmex}>
            <Text style={estilos.textoAmex}>AMEX</Text>
          </View>
        );
      case "cabal":
        return (
          <View style={estilos.logoCabal}>
            <Text style={estilos.textoCabal}>CABAL</Text>
          </View>
        );
      case "naranja":
        return (
          <View style={estilos.logoNaranja}>
            <Text style={estilos.textoNaranja}>NARANJA</Text>
          </View>
        );
      default:
        return (
          <View style={estilos.logoGenerico}>
            <Icono nombre="card" tamaño={20} color="#FFFFFF" />
            <Text style={estilos.textoGenerico}>YORU CARD</Text>
          </View>
        );
    }
  };

  return (
    <View style={estilos.contenedorPrincipal}>
      {/* Tarjeta con Flip interactivo */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onAlternarGiro}
        accessibilityRole="button"
        accessibilityLabel={`Tarjeta de ${tipoTarjeta}. Tocar para ${volteada ? "ver el frente" : "ver el dorso"}`}
        style={estilos.areaTarjeta}
      >
        {/* CARA FRONTAL */}
        <Animated.View
          style={[
            estilos.caraTarjeta,
            {
              transform: [{ rotateY: giroFrente }],
              opacity: opacidadFrente,
              zIndex: volteada ? 0 : 2,
            },
          ]}
          pointerEvents={volteada ? "none" : "auto"}
        >
          <LinearGradient
            colors={["#261B29", "#442A41", "#5C3155"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={estilos.gradienteTarjeta}
          >
            {/* Decoración de ondas de fondo */}
            <View style={estilos.adornoCirculo1} />
            <View style={estilos.adornoCirculo2} />

            {/* Cabecera: Tipo, Chip y Contactless */}
            <View style={estilos.filaCabecera}>
              <View style={estilos.filaChip}>
                {/* Chip EMV Dorado */}
                <View style={estilos.chipEMV}>
                  <View style={estilos.chipLinea1} />
                  <View style={estilos.chipLinea2} />
                  <View style={estilos.chipCentro} />
                </View>
                {/* Símbolo Contactless (NFC) */}
                <View style={estilos.iconoContactless}>
                  <Icono nombre="wifi" tamaño={18} color="#E8D5B5" estilo={{ transform: [{ rotate: "90deg" }] }} />
                </View>
              </View>

              {/* Logo de la marca */}
              <View style={estilos.contenedorLogoMarca}>
                {renderLogoMarca()}
              </View>
            </View>

            {/* Número de Tarjeta */}
            <View style={estilos.contenedorNumero}>
              <Text style={estilos.textoNumeroTarjeta} numberOfLines={1}>
                {numeroMostrado}
              </Text>
            </View>

            {/* Pie: Titular y Expiración */}
            <View style={estilos.filaPie}>
              <View style={estilos.columnaTitular}>
                <Text style={estilos.etiquetaCampo}>TITULAR DE LA TARJETA</Text>
                <Text style={estilos.valorTitular} numberOfLines={1}>
                  {nombre.trim() ? nombre.toUpperCase() : "NOMBRE Y APELLIDO"}
                </Text>
              </View>

              <View style={estilos.columnaExpiracion}>
                <Text style={estilos.etiquetaCampo}>VENCE</Text>
                <Text style={estilos.valorExpiracion}>
                  {expiracion.trim() ? expiracion : "MM/AA"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* CARA DORSAL */}
        <Animated.View
          style={[
            estilos.caraTarjeta,
            {
              transform: [{ rotateY: giroDorso }],
              opacity: opacidadDorso,
              zIndex: volteada ? 2 : 0,
            },
          ]}
          pointerEvents={volteada ? "auto" : "none"}
        >
          <LinearGradient
            colors={["#1E1620", "#332032", "#472743"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[estilos.gradienteTarjeta, estilos.gradienteDorso]}
          >
            {/* Banda Magnética */}
            <View style={estilos.bandaMagnetica} />

            {/* Panel de Firma y CVV */}
            <View style={estilos.contenedorFirmaYCvv}>
              <View style={estilos.panelFirma}>
                <View style={estilos.lineasFirma1} />
                <View style={estilos.lineasFirma2} />
                <Text style={estilos.textoFirma}>Firma autorizada</Text>
              </View>
              <View style={estilos.cajaCvv}>
                <Text style={estilos.etiquetaCvv}>CVV</Text>
                <Text style={estilos.textoCvv}>
                  {cvv.trim() ? cvv : "•••"}
                </Text>
              </View>
            </View>

            {/* Holograma de Seguridad y Leyenda */}
            <View style={estilos.pieDorso}>
              <View style={estilos.holograma}>
                <Icono nombre="shield-checkmark" tamaño={16} color="#B3C5D7" />
                <Text style={estilos.textoHolograma}>SECURE</Text>
              </View>

              <Text style={estilos.leyendaAcademica}>
                Yorumanga Payments • Simulación académica protegida SSL
              </Text>

              {renderLogoMarca()}
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      {/* Botón rápido para voltear manualmente */}
      <TouchableOpacity
        style={estilos.botonVoltear}
        onPress={onAlternarGiro}
        activeOpacity={0.7}
      >
        <Icono nombre="sync-outline" tamaño={14} color={COLORES.primario} />
        <Text style={estilos.textoBotonVoltear}>
          {volteada ? "Ver frente de la tarjeta" : "Ver dorso (CVV)"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorPrincipal: {
    alignItems: "center",
    marginVertical: 12,
  },
  areaTarjeta: {
    width: 320,
    height: 196,
    position: "relative",
  },
  caraTarjeta: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    overflow: "hidden",
    ...SOMBRAS.media,
    backgroundColor: "#261B29",
  },
  gradienteTarjeta: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
    position: "relative",
  },
  gradienteDorso: {
    padding: 0,
    paddingBottom: 16,
    justifyContent: "flex-start",
  },
  adornoCirculo1: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  adornoCirculo2: {
    position: "absolute",
    left: 30,
    bottom: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(217, 134, 85, 0.06)",
  },
  filaCabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chipEMV: {
    width: 42,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#D4AF37",
    borderWidth: 1,
    borderColor: "#AA820A",
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  chipLinea1: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "#AA820A",
  },
  chipLinea2: {
    position: "absolute",
    height: "100%",
    width: 1,
    backgroundColor: "#AA820A",
  },
  chipCentro: {
    width: 18,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#AA820A",
    backgroundColor: "#E5C158",
  },
  iconoContactless: {
    opacity: 0.85,
  },
  contenedorLogoMarca: {
    minHeight: 28,
    justifyContent: "center",
  },
  logoVisa: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 4,
  },
  textoVisa: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    fontWeight: "900",
    color: "#1A1F71",
    letterSpacing: 1.5,
    fontStyle: "italic",
  },
  logoMastercard: {
    flexDirection: "row",
    alignItems: "center",
    width: 38,
    height: 24,
    position: "relative",
  },
  circuloMC: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: "absolute",
  },
  circuloRojoMC: {
    left: 0,
    backgroundColor: "#EB001B",
    opacity: 0.9,
  },
  circuloNaranjaMC: {
    right: 0,
    backgroundColor: "#F79E1B",
    opacity: 0.9,
  },
  logoAmex: {
    backgroundColor: "#0077A6",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  textoAmex: {
    fontFamily: FUENTES.bold,
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  logoCabal: {
    backgroundColor: "#008852",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textoCabal: {
    fontFamily: FUENTES.bold,
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  logoNaranja: {
    backgroundColor: "#FF6600",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textoNaranja: {
    fontFamily: FUENTES.bold,
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  logoGenerico: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  textoGenerico: {
    fontSize: 11,
    fontFamily: FUENTES.bold,
    fontWeight: "700",
    color: "#EDE2EA",
    letterSpacing: 0.5,
  },
  contenedorNumero: {
    marginVertical: 10,
  },
  textoNumeroTarjeta: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2.2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  filaPie: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  columnaTitular: {
    flex: 1,
    marginRight: 10,
  },
  columnaExpiracion: {
    alignItems: "flex-end",
  },
  etiquetaCampo: {
    color: "#C2B2C0",
    fontSize: 8.5,
    fontFamily: FUENTES.bold,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  valorTitular: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontFamily: FUENTES.bold,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  valorExpiracion: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: FUENTES.bold,
    fontWeight: "700",
    letterSpacing: 1,
  },
  // Dorso
  bandaMagnetica: {
    width: "100%",
    height: 38,
    backgroundColor: "#0D0A0E",
    marginTop: 18,
    marginBottom: 14,
  },
  contenedorFirmaYCvv: {
    flexDirection: "row",
    paddingHorizontal: 18,
    alignItems: "center",
    gap: 8,
  },
  panelFirma: {
    flex: 1,
    height: 34,
    backgroundColor: "#EDEDED",
    borderRadius: 3,
    paddingHorizontal: 8,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  lineasFirma1: {
    position: "absolute",
    width: "100%",
    height: 1,
    top: 10,
    backgroundColor: "#D0D0D0",
  },
  lineasFirma2: {
    position: "absolute",
    width: "100%",
    height: 1,
    top: 20,
    backgroundColor: "#D0D0D0",
  },
  textoFirma: {
    fontSize: 9,
    color: "#888888",
    fontStyle: "italic",
    textAlign: "right",
  },
  cajaCvv: {
    width: 54,
    height: 34,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  etiquetaCvv: {
    fontSize: 7,
    color: "#888888",
    fontWeight: "700",
    position: "absolute",
    top: 2,
    right: 4,
  },
  textoCvv: {
    fontSize: 13,
    fontWeight: "800",
    color: "#222222",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    letterSpacing: 1,
    marginTop: 4,
  },
  pieDorso: {
    marginTop: "auto",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  holograma: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  textoHolograma: {
    fontSize: 8,
    fontWeight: "800",
    color: "#B3C5D7",
    letterSpacing: 0.5,
  },
  leyendaAcademica: {
    fontSize: 8,
    color: "rgba(255, 255, 255, 0.4)",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  botonVoltear: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIO.completo,
    backgroundColor: COLORES.primarioTint,
  },
  textoBotonVoltear: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORES.primario,
    fontFamily: FUENTES.bold,
  },
});
