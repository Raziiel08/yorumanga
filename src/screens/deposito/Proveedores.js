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
import { suppliersService } from "../../services/proveedores";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import Icono from "../../components/Icono";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import Boton from "../../components/Boton";

export default function ProveedoresScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { width } = useWindowDimensions();
  const columnas = width < 768 ? 1 : width < 1024 ? 2 : 3;
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1360);

  const load = useCallback(async () => {
    setCargando(true);
    try {
      setItems(await suppliersService.getAll());
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
  const remove = (id) => {
    Alert.alert("Confirmar", "¿Eliminar proveedor?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await suppliersService.remove(id);
            load();
          } catch (e) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };
  const filas = Math.ceil(items.length / columnas);

  return (
    <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <View style={styles.encabezadoFila}>
          <EncabezadoPantalla
            kicker="CADENA DE SUMINISTRO"
            titulo="Proveedores"
            descripcion="Organizá contactos y datos de entrega."
            estilo={styles.encabezado}
          />
          <Boton
            titulo="Nuevo proveedor"
            icono="add"
            alPresionar={() => navigation.navigate("ProveedorForm", {})}
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
                          <View style={styles.avatar}>
                            <Icono
                              nombre="car"
                              tamaño={20}
                              color={COLORES.primario}
                            />
                          </View>
                          <Text style={styles.cardTitle} numberOfLines={1}>
                            {item.nombre}
                          </Text>
                        </View>
                        {item.contacto ? (
                          <View style={styles.datoFila}>
                            <Icono
                              nombre="person-outline"
                              tamaño={14}
                              color={COLORES.textoSecundario}
                            />
                            <Text style={styles.cardText} numberOfLines={1}>
                              {item.contacto}
                            </Text>
                          </View>
                        ) : null}
                        {item.email ? (
                          <View style={styles.datoFila}>
                            <Icono
                              nombre="mail-outline"
                              tamaño={14}
                              color={COLORES.textoSecundario}
                            />
                            <Text style={styles.cardText} numberOfLines={1}>
                              {item.email}
                            </Text>
                          </View>
                        ) : null}
                        <View style={styles.acciones}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("ProveedorForm", {
                                supplier: item,
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
                  nombre={cargando ? "car" : "search"}
                  tamaño={34}
                  color={COLORES.primarioClaro}
                />
              </View>
              <Text style={styles.vacioTexto}>
                {cargando
                  ? "Cargando proveedores…"
                  : "Todavía no hay proveedores cargados."}
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
    alignItems: "center",
    gap: ESPACIADO.sm,
    marginBottom: ESPACIADO.xs,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: RADIO.completo,
    backgroundColor: COLORES.primarioTinte,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    flex: 1,
    color: COLORES.texto,
    fontFamily: FUENTES.bold,
    fontSize: 15,
  },
  datoFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  cardText: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medio,
    fontSize: 13,
    flexShrink: 1,
  },
  acciones: {
    flexDirection: "row",
    gap: ESPACIADO.md,
    marginTop: ESPACIADO.sm,
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
