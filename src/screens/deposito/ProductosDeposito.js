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
import { productsService } from "../../services/productos";
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

export default function ProductosDepositoScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { width } = useWindowDimensions();
  const columnas = width < 768 ? 1 : width < 1024 ? 2 : 3;
  const anchoContenido = Math.min(width - ESPACIADO.lg * 2, 1360);

  const load = useCallback(async () => {
    setCargando(true);
    try {
      setProducts(await productsService.getAll());
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
    Alert.alert(
      "Confirmar",
      "El producto dejará de aparecer en el catálogo, pero conservará su historial.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Desactivar",
          style: "destructive",
          onPress: async () => {
            try {
              await productsService.remove(id);
              load();
            } catch (e) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ],
    );
  };
  const filas = Math.ceil(products.length / columnas);

  return (
    <View style={styles.container}>
      <View style={[styles.contenido, { maxWidth: anchoContenido }]}>
        <View style={styles.encabezadoFila}>
          <EncabezadoPantalla
            kicker="CATÁLOGO"
            titulo="Productos"
            descripcion="Consultá y actualizá los productos del catálogo."
            estilo={styles.encabezado}
          />
          <Boton
            titulo="Nuevo producto"
            icono="add"
            alPresionar={() => navigation.navigate("ProductoForm", {})}
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
          {products.length > 0 ? (
            Array.from({ length: filas }, (_, indiceFila) => (
              <View key={`fila-${indiceFila}`} style={styles.fila}>
                {products
                  .slice(indiceFila * columnas, (indiceFila + 1) * columnas)
                  .map((item) => (
                    <View
                      key={item.id}
                      style={[styles.celda, { width: `${100 / columnas}%` }]}
                    >
                      <View style={styles.card}>
                        <View style={styles.cardCabecera}>
                          <Text style={styles.cardTitle} numberOfLines={2}>
                            {item.titulo}
                          </Text>
                          <Etiqueta
                            texto={item.activo ? "Activo" : "Inactivo"}
                            variante={item.activo ? "exito" : "neutro"}
                          />
                        </View>
                        <Text style={styles.cardPrecio}>
                          {formatearMoneda(item.precio)}
                        </Text>
                        <View style={styles.datosFila}>
                          <Text style={styles.cardText}>
                            Stock: {item.stock}
                          </Text>
                          <Text style={styles.cardText}>
                            {item.genero || "Sin género"}
                          </Text>
                        </View>
                        <View style={styles.acciones}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("ProductoForm", {
                                product: item,
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
                            <Text style={styles.linkPeligro}>Desactivar</Text>
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
                  nombre={cargando ? "library" : "search"}
                  tamaño={34}
                  color={COLORES.primarioClaro}
                />
              </View>
              <Text style={styles.vacioTexto}>
                {cargando
                  ? "Cargando productos…"
                  : "No hay productos cargados."}
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
  },
  datosFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ESPACIADO.sm,
    marginTop: ESPACIADO.xs,
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
