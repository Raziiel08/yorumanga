import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import Icono from "../../components/Icono";
import Etiqueta from "../../components/Etiqueta";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../context/ContextoAuth";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";

const ESTILOS_ESTADO = {
  pendiente: "advertencia",
  "en revision": "info",
  "en revisión": "info",
  aprobado: "exito",
  aceptada: "exito",
  rechazada: "error",
  rechazado: "error",
  disponible: "exito",
};

export default function MisSolicitudesScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      setError("Iniciá sesión para ver tus solicitudes");
      return;
    }
    setCargando(true);
    try {
      const { data, error: errorConsulta } = await supabase
        .from("solicitudes_manga")
        .select("*")
        .eq("usuario_id", user.id)
        .order("creado_en", { ascending: false });
      if (errorConsulta) throw errorConsulta;
      setItems(data || []);
      setError("");
    } catch (e) {
      console.error("Error cargando solicitudes:", e);
      setError("No se pudieron cargar las solicitudes.");
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
        kicker="TUS PEDIDOS ESPECIALES"
        titulo="Mis solicitudes"
        descripcion="Mangas que pediste sumar al catálogo y su estado."
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
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
              <Text style={styles.cardTitle}>{item.titulo_solicitado}</Text>
              <Etiqueta
                texto={item.estado}
                variante={
                  ESTILOS_ESTADO[(item.estado || "").toLowerCase()] || "neutro"
                }
              />
            </View>
            <Text style={styles.fecha}>
              Solicitado el{" "}
              {new Date(item.creado_en).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
            {item.observaciones ? (
              <View style={styles.observaciones}>
                <Icono
                  nombre="chatbubble-ellipses-outline"
                  tamaño={14}
                  color={COLORES.textoSecundario}
                />
                <Text style={styles.observacionesTexto}>
                  {item.observaciones}
                </Text>
              </View>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.contenedorVacio}>
            <View style={styles.iconoVacioContenedor}>
              <Icono
                nombre="document-text-outline"
                tamaño={32}
                color={COLORES.primarioLight}
              />
            </View>
            <Text style={styles.empty}>
              {cargando
                ? "Cargando solicitudes…"
                : "Todavía no enviaste ninguna solicitud."}
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
    alignItems: "flex-start",
    gap: ESPACIADO.sm,
  },
  cardTitle: {
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
    fontSize: 16,
    flex: 1,
    lineHeight: 21,
  },
  fecha: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.medio,
    marginTop: ESPACIADO.xs,
  },
  observaciones: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: ESPACIADO.sm,
    backgroundColor: COLORES.fondo,
    borderRadius: RADIO.sm,
    padding: ESPACIADO.sm,
  },
  observacionesTexto: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.medio,
    flex: 1,
    lineHeight: 18,
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
