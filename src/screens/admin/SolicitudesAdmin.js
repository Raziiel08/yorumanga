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
import { supabase } from "../../config/supabase";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { Alert } from "../../utils/alertas";
import Icono from "../../components/Icono";
import Etiqueta from "../../components/Etiqueta";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";

const ESTADOS = ["pendiente", "visto", "agregado"];
const VARIANTE_ESTADO = {
  pendiente: "advertencia",
  visto: "info",
  agregado: "exito",
};
const NOMBRE_ESTADO = {
  pendiente: "Pendiente",
  visto: "Visto",
  agregado: "Agregado",
};

export default function SolicitudesAdminScreen() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { width } = useWindowDimensions();
  const columnas = width < 768 ? 1 : width < 1024 ? 2 : 3;
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1360);

  const load = useCallback(async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from("solicitudes_manga")
        .select("*, user:usuarios(*)")
        .order("creado_en", {
          ascending: false,
        });
      if (error) throw error;
      setItems(data);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setCargando(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const changeStatus = async (id, estado) => {
    try {
      const { error } = await supabase
        .from("solicitudes_manga")
        .update({
          estado,
          actualizado_en: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
      load();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };
  const filas = Math.ceil(items.length / columnas);

  return (
    <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <EncabezadoPantalla
          kicker="BANDEJA"
          titulo="Solicitudes de manga"
          descripcion="Respondé los pedidos de mangas que no están en catálogo."
          estilo={styles.encabezado}
        />
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
          {items.length > 0 ? (
            Array.from({ length: filas }, (_, indiceFila) => (
              <View key={`fila-${indiceFila}`} style={styles.fila}>
                {items
                  .slice(indiceFila * columnas, (indiceFila + 1) * columnas)
                  .map((item) => (
                    <View
                      key={item.id}
                      style={[styles.celda, { width: `${100 / columnas}%` }]}
                    >
                      <View style={styles.card}>
                        <View style={styles.cardCabecera}>
                          <Text style={styles.cardTitle} numberOfLines={2}>
                            {item.titulo_solicitado}
                          </Text>
                          <Etiqueta
                            texto={NOMBRE_ESTADO[item.estado] || item.estado}
                            variante={VARIANTE_ESTADO[item.estado] || "neutro"}
                          />
                        </View>
                        <Text style={styles.cardText} numberOfLines={1}>
                          Solicita:{" "}
                          {item.user?.nombre ||
                            item.user?.email ||
                            item.usuario_id}
                        </Text>
                        {item.observaciones && (
                          <Text
                            style={styles.cardObservacion}
                            numberOfLines={3}
                          >
                            “{item.observaciones}”
                          </Text>
                        )}
                        <View style={styles.acciones}>
                          {ESTADOS.map((estado) => (
                            <TouchableOpacity
                              key={estado}
                              style={[
                                styles.chipEstado,
                                item.estado === estado &&
                                  styles.chipEstadoActual,
                              ]}
                              onPress={() => changeStatus(item.id, estado)}
                            >
                              <Text
                                style={[
                                  styles.chipEstadoTexto,
                                  item.estado === estado &&
                                    styles.chipEstadoTextoActual,
                                ]}
                              >
                                {NOMBRE_ESTADO[estado]}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            ))
          ) : (
            <View style={styles.vacio}>
              <View style={styles.vacioIcono}>
                <Icono
                  nombre={cargando ? "mail" : "mail-open"}
                  tamaño={34}
                  color={COLORES.primarioClaro}
                />
              </View>
              <Text style={styles.vacioTexto}>
                {cargando
                  ? "Cargando solicitudes…"
                  : "No hay solicitudes pendientes."}
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
  encabezado: {
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
  cardText: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 13,
    marginTop: 2,
  },
  cardObservacion: {
    color: COLORES.texto,
    fontFamily: FUENTES.medio,
    fontSize: 13,
    lineHeight: 19,
    marginTop: ESPACIADO.sm,
    padding: ESPACIADO.sm,
    backgroundColor: COLORES.fondo,
    borderRadius: RADIO.sm,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
  },
  acciones: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ESPACIADO.xs,
    marginTop: ESPACIADO.sm,
    paddingTop: ESPACIADO.sm,
    borderTopWidth: 1,
    borderTopColor: COLORES.bordeSuave,
  },
  chipEstado: {
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: 6,
    borderRadius: RADIO.completo,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficieAlterna,
  },
  chipEstadoActual: {
    backgroundColor: COLORES.primario,
    borderColor: COLORES.primario,
  },
  chipEstadoTexto: {
    color: COLORES.primario,
    fontFamily: FUENTES.bold,
    fontSize: 12,
  },
  chipEstadoTextoActual: {
    color: "#FFFFFF",
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
