import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Alert } from "../../utils/alertas";
import { salesService } from "../../services/ventas";
import { ordersService } from "../../services/pedidos";
import { aiService } from "../../services/ia";
import { resumirActividad } from "../../utils/reportes";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { formatearMoneda } from "../../utils/moneda";
import Icono from "../../components/Icono";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import Boton from "../../components/Boton";

export default function ReportesScreen() {
  const [report, setReport] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const { width } = useWindowDimensions();
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1080);

  const generar = async () => {
    setCargando(true);
    try {
      const [sales, orders] = await Promise.all([
        salesService.getAll(),
        ordersService.getAll(),
      ]);
      const {
        totalVentas,
        totalPedidos,
        productosMasVendidos,
        ventasRecientes,
      } = resumirActividad(sales, orders);
      const r = await aiService.generateReport({
        totalVentas,
        totalPedidos,
        productosMasVendidos,
        ventasRecientes,
      });
      setReport(r);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setCargando(false);
    }
  };
  const enviarChat = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const reply = await aiService.chatAssistant(chatInput);
      setChatReply(reply);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setChatLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <EncabezadoPantalla
          kicker="ANÁLISIS"
          titulo="Reportes e IA"
          descripcion="Generá informes del negocio y consultale al asistente."
          estilo={styles.encabezado}
        />
        <ScrollView
          style={styles.lista}
          contentContainerStyle={styles.contenidoLista}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
        >
          <Boton
            titulo="Generar informe"
            icono="sparkles"
            cargando={cargando}
            alPresionar={generar}
          />

          {report && (
            <View style={styles.card}>
              <View style={styles.cardCabecera}>
                <Icono
                  nombre="document-text"
                  tamaño={20}
                  color={COLORES.primario}
                />
                <Text style={styles.cardTitulo}>Resumen</Text>
              </View>
              <Text style={styles.cardTexto}>{report.resumen}</Text>
              <View style={styles.metricas}>
                <View style={styles.metrica}>
                  <Text style={styles.metricaValor}>
                    {formatearMoneda(report.total_ventas)}
                  </Text>
                  <Text style={styles.metricaEtiqueta}>Ventas totales</Text>
                </View>
                <View style={styles.metrica}>
                  <Text style={styles.metricaValor}>
                    {report.total_pedidos}
                  </Text>
                  <Text style={styles.metricaEtiqueta}>Pedidos online</Text>
                </View>
              </View>
              <Text style={styles.subtituloSeccion}>Más vendidos</Text>
              {report.productos_mas_vendidos.map((p, i) => (
                <View key={i} style={styles.itemFila}>
                  <View style={styles.itemPunto} />
                  <Text style={styles.itemTexto}>
                    {p.titulo}: {p.cantidad}
                  </Text>
                </View>
              ))}
              <Text style={styles.subtituloSeccion}>Recomendaciones</Text>
              {report.recomendaciones.map((r, i) => (
                <View key={i} style={styles.itemFila}>
                  <Icono
                    nombre="bulb-outline"
                    tamaño={14}
                    color={COLORES.acentoOscuro}
                  />
                  <Text style={styles.itemTexto}>{r}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.cardCabecera}>
              <Icono
                nombre="chatbubbles"
                tamaño={20}
                color={COLORES.primario}
              />
              <Text style={styles.cardTitulo}>Asistente IA</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Preguntale algo al asistente..."
              placeholderTextColor={COLORES.textoAtenuado}
              value={chatInput}
              onChangeText={setChatInput}
            />
            <Boton
              titulo="Consultar"
              icono="send"
              cargando={chatLoading}
              alPresionar={enviarChat}
            />
            {chatReply ? (
              <View style={styles.respuestaChat}>
                <Text style={styles.cardTexto}>{chatReply}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    padding: ESPACIADO.lg,
  },
  encabezado: {
    marginBottom: ESPACIADO.md,
  },
  lista: {
    flex: 1,
    minHeight: 0,
  },
  contenidoLista: {
    paddingBottom: ESPACIADO.xxl,
  },
  card: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.md,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    marginBottom: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  cardCabecera: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.sm,
  },
  cardTitulo: {
    color: COLORES.texto,
    fontSize: 24,
    fontFamily: FUENTES.display,
    letterSpacing: 0.4,
  },
  cardTexto: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 14,
    lineHeight: 21,
  },
  metricas: {
    flexDirection: "row",
    gap: ESPACIADO.md,
    marginTop: ESPACIADO.md,
  },
  metrica: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    padding: ESPACIADO.md,
  },
  metricaValor: {
    color: COLORES.primario,
    fontFamily: FUENTES.display,
    fontSize: 26,
    letterSpacing: 0.4,
  },
  metricaEtiqueta: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.semibold,
    fontSize: 12,
    marginTop: 2,
  },
  subtituloSeccion: {
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
    marginTop: ESPACIADO.lg,
    marginBottom: ESPACIADO.xs,
  },
  itemFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.sm,
    paddingVertical: 4,
  },
  itemPunto: {
    width: 6,
    height: 6,
    borderRadius: RADIO.completo,
    backgroundColor: COLORES.acento,
  },
  itemTexto: {
    flex: 1,
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORES.fondo,
    color: COLORES.texto,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: 13,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    marginBottom: ESPACIADO.md,
    minHeight: 50,
    fontSize: 15,
    fontFamily: FUENTES.medio,
  },
  respuestaChat: {
    marginTop: ESPACIADO.md,
    padding: ESPACIADO.md,
    backgroundColor: COLORES.primarioTinte,
    borderRadius: RADIO.md,
  },
});
