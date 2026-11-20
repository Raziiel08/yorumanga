import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { clientsService } from "../../services/clientes";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { Alert } from "../../utils/alertas";
import Icono from "../../components/Icono";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import Boton from "../../components/Boton";

export default function ClientesScreen({ navigation }) {
  const [clients, setClients] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const { width } = useWindowDimensions();
  const columnas = width < 768 ? 1 : width < 1024 ? 2 : 3;
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1360);

  const load = useCallback(async () => {
    setCargando(true);
    try {
      setClients(await clientsService.getAll());
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setCargando(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation, load]);
  const remove = async (id) => {
    Alert.alert("Confirmar", "¿Eliminar cliente?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await clientsService.remove(id);
            load();
          } catch (e) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  const filtrados = clients.filter((cliente) => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return true;
    return (
      (cliente.nombre || "").toLowerCase().includes(texto) ||
      (cliente.email || "").toLowerCase().includes(texto)
    );
  });
  const filas = Math.ceil(filtrados.length / columnas);

  return (
    <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <View style={styles.encabezadoFila}>
          <EncabezadoPantalla
            kicker="BASE DE CLIENTES"
            titulo="Clientes"
            descripcion="Encontrá y administrá los clientes del local."
            estilo={styles.encabezado}
          />
          <Boton
            titulo="Nuevo cliente"
            icono="add"
            alPresionar={() => navigation.navigate("ClienteForm", {})}
            estilo={styles.accionPrincipal}
          />
        </View>

        <View style={styles.buscador}>
          <Icono nombre="search" tamaño={18} color={COLORES.textoAtenuado} />
          <TextInput
            style={styles.campoBusqueda}
            placeholder="Buscar por nombre o correo…"
            placeholderTextColor={COLORES.textoAtenuado}
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda ? (
            <TouchableOpacity onPress={() => setBusqueda("")}>
              <Icono
                nombre="close"
                tamaño={16}
                color={COLORES.textoSecundario}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          style={styles.lista}
          contentContainerStyle={styles.contenidoLista}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={cargando}
              onRefresh={load}
              tintColor={COLORES.primario}
            />
          }
        >
          {filtrados.length > 0 ? (
            Array.from({ length: filas }, (_, indiceFila) => (
              <View key={`fila-${indiceFila}`} style={styles.fila}>
                {filtrados
                  .slice(indiceFila * columnas, (indiceFila + 1) * columnas)
                  .map((item) => (
                    <View
                      key={item.id}
                      style={[styles.celda, { width: `${100 / columnas}%` }]}
                    >
                      <View style={styles.card}>
                        <View style={styles.cardCabecera}>
                          <View style={styles.avatar}>
                            <Text style={styles.avatarTexto}>
                              {(item.nombre || "?").charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={styles.cardTitle} numberOfLines={1}>
                              {item.nombre}
                            </Text>
                            <Text style={styles.cardText} numberOfLines={1}>
                              {item.email || "Sin correo"}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.acciones}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("ClienteForm", {
                                client: item,
                              })
                            }
                            style={styles.accionEditar}
                          >
                            <Icono
                              nombre="create-outline"
                              tamaño={15}
                              color={COLORES.primario}
                            />
                            <Text style={styles.link}>Editar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => remove(item.id)}
                            style={styles.accionPeligro}
                          >
                            <Icono
                              nombre="trash-outline"
                              tamaño={15}
                              color={COLORES.error}
                            />
                            <Text style={styles.linkPeligro}>Eliminar</Text>
                          </TouchableOpacity>
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
                  nombre={cargando ? "people" : busqueda ? "search" : "people"}
                  tamaño={34}
                  color={COLORES.primarioClaro}
                />
              </View>
              <Text style={styles.vacioTexto}>
                {cargando
                  ? "Cargando clientes…"
                  : busqueda
                    ? "Ningún cliente coincide con la búsqueda."
                    : "Todavía no hay clientes cargados."}
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
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.completo,
    borderWidth: 1,
    borderColor: COLORES.borde,
    paddingHorizontal: ESPACIADO.md,
    marginBottom: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  campoBusqueda: {
    flex: 1,
    minWidth: 0,
    color: COLORES.texto,
    fontSize: 14,
    fontFamily: FUENTES.medio,
    paddingVertical: ESPACIADO.sm + 4,
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
    alignItems: "center",
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: RADIO.completo,
    backgroundColor: COLORES.primarioTinte,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTexto: {
    color: COLORES.primario,
    fontFamily: FUENTES.extrabold,
    fontSize: 16,
  },
  cardTitle: {
    color: COLORES.texto,
    fontFamily: FUENTES.bold,
    fontSize: 15,
  },
  cardText: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 13,
  },
  acciones: {
    flexDirection: "row",
    gap: ESPACIADO.md,
    paddingTop: ESPACIADO.sm,
    borderTopWidth: 1,
    borderTopColor: COLORES.bordeSuave,
  },
  accionEditar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  accionPeligro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  link: {
    color: COLORES.primario,
    fontFamily: FUENTES.bold,
    fontSize: 13,
  },
  linkPeligro: {
    color: COLORES.error,
    fontFamily: FUENTES.bold,
    fontSize: 13,
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
