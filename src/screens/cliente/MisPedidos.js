import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import Icono from "../../components/Icono";
import Etiqueta from "../../components/Etiqueta";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import { ordersService } from "../../services/pedidos";
import { useAuth } from "../../context/ContextoAuth";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { formatearMoneda } from "../../utils/moneda";

const ESTILOS_ESTADO = {
  pendiente: "advertencia",
  confirmado: "info",
  preparacion: "info",
  enviado: "primarioSuave",
  entregado: "exito",
  completado: "exito",
  cancelado: "error",
  rechazado: "error",
};

export default function MisPedidosScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!user) return;
    setCargando(true);
    setError("");
    try {
      setOrders(await ordersService.getByUser(user.id));
    } catch (e) {
      console.error("Error cargando pedidos:", e);
      setError("No se pudieron cargar tus pedidos.");
    } finally {
      setCargando(false);
    }
  }, [user]);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <EncabezadoPantalla
        kicker="TU HISTORIAL"
        titulo="Mis pedidos"
        descripcion="Seguí el estado de cada pedido que realizaste."
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={orders}
        keyExtractor={(i) => i.id}
        refreshControl={
          <RefreshControl
            refreshing={cargando}
            onRefresh={load}
            tintColor={COLORES.primario}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.filaEncabezado}>
              <Text style={styles.cardTitle}>
                #{item.id.slice(0, 8).toUpperCase()}
              </Text>
              <Etiqueta
                texto={item.estado}
                variante={
                  ESTILOS_ESTADO[(item.estado || "").toLowerCase()] || "neutro"
                }
              />
            </View>
            <Text style={styles.cardText}>
              {new Date(item.creado_en).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" · "}
              {new Date(item.creado_en).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <View style={styles.separador} />
            <View style={styles.filaTotal}>
              <Text style={styles.etiquetaTotal}>Total</Text>
              <Text style={styles.total}>{formatearMoneda(item.total)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.contenedorVacio}>
            <View style={styles.iconoVacioContenedor}>
              <Icono
                nombre="receipt-outline"
                tamaño={32}
                color={COLORES.primarioLight}
              />
            </View>
            <Text style={styles.empty}>
              {cargando
                ? "Cargando pedidos…"
                : "Todavía no realizaste ningún pedido."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
    backgroundColor: COLORES.fondo,
    padding: ESPACIADO.lg,
  },
  error: {
    color: COLORES.error,
    fontFamily: FUENTES.bold,
    marginBottom: ESPACIADO.md,
  },
  card: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.md,
    borderRadius: RADIO.lg,
    marginBottom: ESPACIADO.sm,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.sm,
  },
  filaEncabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.xs,
  },
  cardTitle: {
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cardText: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.medio,
    marginTop: 2,
  },
  separador: {
    height: 1,
    backgroundColor: COLORES.bordeSuave,
    marginVertical: ESPACIADO.sm,
  },
  filaTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  etiquetaTotal: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.bold,
    marginBottom: 2,
  },
  total: {
    color: COLORES.primario,
    fontSize: 24,
    fontFamily: FUENTES.display,
    letterSpacing: 0.5,
  },
  contenedorVacio: {
    alignItems: "center",
    marginTop: ESPACIADO.xl,
  },
  iconoVacioContenedor: {
    width: 80,
    height: 80,
    borderRadius: RADIO.full,
    backgroundColor: COLORES.primarioTinte,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ESPACIADO.md,
  },
  empty: {
    color: COLORES.textoSecundario,
    textAlign: "center",
    marginTop: ESPACIADO.xs,
    fontFamily: FUENTES.bold,
  },
});
