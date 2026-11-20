import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { Alert } from "../../utils/alertas";
import { formatearMoneda } from "../../utils/moneda";
import { salesService } from "../../services/ventas";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import Icono from "../../components/Icono";
import Etiqueta from "../../components/Etiqueta";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import Boton from "../../components/Boton";

const VARIANTE_ESTADO = {
  completada: "exito",
  completado: "exito",
  anulada: "error",
  cancelada: "error",
  pendiente: "advertencia",
};

export default function VentasScreen({ navigation }) {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { width } = useWindowDimensions();
  const columnas = width < 768 ? 1 : width < 1024 ? 2 : 3;
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1360);

  const load = useCallback(async () => {
    setCargando(true);
    try {
      const data = await salesService.getAll();
      setVentas(data);
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudieron cargar las ventas");
    } finally {
      setCargando(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const filas = Math.ceil(ventas.length / columnas);

  return (
    <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <View style={styles.encabezadoFila}>
          <EncabezadoPantalla
            kicker="VENTAS PRESENCIALES"
            titulo="Ventas"
            descripcion="Historial de ventas registradas en el local."
            estilo={styles.encabezado}
          />
          <Boton
            titulo="Nueva venta"
            icono="add"
            alPresionar={() => navigation.navigate("NuevaVenta")}
            estilo={styles.accionPrincipal}
          />
        </View>
        <ScrollView
          style={styles.lista}
          contentContainerStyle={styles.contenidoLista}
          showsVerticalScrollIndicator
          refreshControl={
            <RefreshControl
              refreshing={cargando}
              onRefresh={load}
              tintColor={COLORES.primario}
            />
          }
        >
          {ventas.length > 0 ? (
            Array.from({ length: filas }, (_, indiceFila) => (
              <View key={`fila-${indiceFila}`} style={styles.fila}>
                {ventas
                  .slice(indiceFila * columnas, (indiceFila + 1) * columnas)
                  .map((item) => (
                    <View
                      key={item.id}
                      style={[styles.celda, { width: `${100 / columnas}%` }]}
                    >
                      <View style={styles.card}>
                        <View style={styles.cardCabecera}>
                          <Text style={styles.cardTitle}>
                            Venta #{item.id.slice(0, 8)}
                          </Text>
                          <Etiqueta
                            texto={item.estado || "Completada"}
                            variante={VARIANTE_ESTADO[item.estado] || "exito"}
                          />
                        </View>
                        <Text style={styles.cardPrecio}>
                          {formatearMoneda(item.total)}
                        </Text>
                        <Text style={styles.cardText}>
                          {new Date(item.creado_en).toLocaleString()}
                        </Text>
                        {item.cliente && (
                          <View style={styles.clienteFila}>
                            <Icono
                              nombre="person"
                              tamaño={14}
                              color={COLORES.textoSecundario}
                            />
                            <Text style={styles.cardText} numberOfLines={1}>
                              {item.cliente.nombre}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
              </View>
            ))
          ) : (
            <View style={styles.vacio}>
              <View style={styles.vacioIcono}>
                <Icono
                  nombre={cargando ? "trending-up" : "receipt-outline"}
                  tamaño={34}
                  color={COLORES.primarioClaro}
                />
              </View>
              <Text style={styles.vacioTexto}>
                {cargando
                  ? "Cargando ventas…"
                  : "No hay ventas registradas todavía."}
              </Text>
            </View>
          )}
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
  encabezadoFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: ESPACIADO.md,
    flexWrap: "wrap",
  },
  encabezado: {
    marginBottom: ESPACIADO.md,
  },
  accionPrincipal: {
    marginBottom: ESPACIADO.md,
  },
  lista: {
    flex: 1,
    minHeight: 0,
  },
  contenidoLista: {
    paddingBottom: ESPACIADO.xl,
  },
  fila: {
    flexDirection: "row",
    gap: ESPACIADO.md,
  },
  celda: {
    marginBottom: ESPACIADO.md,
  },
  card: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.md,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.sm,
  },
  cardCabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.xs,
  },
  cardTitle: {
    flex: 1,
    color: COLORES.texto,
    fontFamily: FUENTES.bold,
    fontSize: 15,
  },
  cardPrecio: {
    color: COLORES.primario,
    fontFamily: FUENTES.display,
    fontSize: 22,
    letterSpacing: 0.4,
    marginTop: ESPACIADO.xs,
  },
  cardText: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 13,
    marginTop: 2,
    flexShrink: 1,
  },
  clienteFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: ESPACIADO.xs,
  },
  vacio: {
    alignItems: "center",
    paddingVertical: ESPACIADO.xxl,
  },
  vacioIcono: {
    width: 72,
    height: 72,
    borderRadius: RADIO.completo,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  vacioTexto: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 14,
    textAlign: "center",
  },
});
