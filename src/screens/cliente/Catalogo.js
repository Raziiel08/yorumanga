import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icono from "../../components/Icono";
import Chip from "../../components/Chip";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import { productsService } from "../../services/productos";
import { useCart } from "../../context/ContextoCarrito";
import { useResponsive } from "../../hooks/useResponsivo";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { GENEROS_MANGA } from "../../constants/generos";
import TarjetaProducto from "../../components/TarjetaProducto";
import PiePagina from "../../components/PiePagina";

const PARAMETROS_INICIALES = {
  busqueda: "",
  genero: "",
  soloOfertas: false,
  soloDestacados: false,
  soloNovedades: false,
  orden: "recientes",
};

export default function PantallaCatalogo({ navigation, route }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [soloNovedades, setSoloNovedades] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [buscadorEnfocado, setBuscadorEnfocado] = useState(false);
  const { addItem } = useCart();
  const { width, esMobile, columnas, anchoMaxContenido } = useResponsive();
  const columnasCatalogo = esMobile && width < 380 ? 1 : columnas;
  const orden = route?.params?.orden || "recientes";

  const cargar = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");
    try {
      const datos =
        orden === "mas-vendidos"
          ? await productsService.getBestSelling(8)
          : await productsService.getAll(true);
      setProductos(datos || []);
    } catch (error) {
      setErrorCarga(error.message || "No se pudieron cargar los mangas.");
    } finally {
      setCargando(false);
    }
  }, [orden]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  useEffect(() => {
    if (!route?.params) return;
    if (route.params.busqueda !== undefined) setBusqueda(route.params.busqueda);
    if (route.params.genero !== undefined) setCategoria(route.params.genero);
    if (route.params.soloOfertas !== undefined)
      setSoloOfertas(route.params.soloOfertas);
    if (route.params.soloDestacados !== undefined)
      setSoloDestacados(route.params.soloDestacados);
    if (route.params.soloNovedades !== undefined) {
      setSoloNovedades(route.params.soloNovedades);
    } else if (
      route.params.orden === "recientes" &&
      !route.params.busqueda &&
      !route.params.genero &&
      !route.params.soloOfertas &&
      !route.params.soloDestacados
    ) {
      setSoloNovedades(true);
    }
  }, [route?.params]);

  const termino = busqueda.trim().toLocaleLowerCase();
  const listaBase = soloNovedades ? productos.slice(0, 10) : productos;
  const filtrados = listaBase.filter((producto) => {
    const coincideTexto = [
      producto.titulo,
      producto.genero,
      producto.autor,
    ].some((valor) => (valor || "").toLocaleLowerCase().includes(termino));
    const coincideCategoria = !categoria || producto.genero === categoria;
    const coincideOferta =
      !soloOfertas ||
      Number(producto.precio_anterior) > Number(producto.precio);
    const coincideDestacado = !soloDestacados || producto.destacado === true;
    return (
      coincideTexto && coincideCategoria && coincideOferta && coincideDestacado
    );
  });

  const tituloPantalla = soloNovedades
    ? "Novedades"
    : orden === "mas-vendidos"
      ? "Más vendidos"
      : soloOfertas
        ? "Ofertas"
        : soloDestacados
          ? "Mangas destacados"
          : "Explorá el catálogo";

  const descripcionPantalla = soloNovedades
    ? "Los últimos títulos incorporados a la tienda."
    : orden === "mas-vendidos"
      ? "Los mangas más elegidos por los lectores."
      : soloOfertas
        ? "Aprovechá los tomos con precio especial."
        : soloDestacados
          ? "Selección destacada para tu colección."
          : "Encontrá tu próxima historia y sumala a tu colección.";

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoria("");
    setSoloOfertas(false);
    setSoloDestacados(false);
    setSoloNovedades(false);
    navigation.setParams(PARAMETROS_INICIALES);
  };

  return (
    <View style={styles.contenedor}>
      <ScrollView
        style={styles.lista}
        contentContainerStyle={styles.contenidoScroll}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={cargando}
            onRefresh={cargar}
            tintColor={COLORES.primario}
          />
        }
      >
        <View style={[styles.contenido, { maxWidth: anchoMaxContenido }]}>
          {/* Encabezado descriptivo de la tienda */}
          <EncabezadoPantalla
            kicker="TIENDA YORUMANGA"
            titulo={tituloPantalla}
            descripcion={descripcionPantalla}
          />

          {/* Barra de búsqueda interactiva */}
          <View
            style={[
              styles.contenedorBuscador,
              buscadorEnfocado && styles.contenedorBuscadorEnfocado,
            ]}
          >
            <Icono
              nombre="search"
              tamaño={19}
              color={buscadorEnfocado ? COLORES.primario : COLORES.textoAtenuado}
            />
            <TextInput
              style={styles.buscador}
              accessibilityLabel="Buscar por manga, género o autor"
              placeholder="Buscar por título, género o autor..."
              placeholderTextColor={COLORES.textoAtenuado}
              value={busqueda}
              onChangeText={setBusqueda}
              onFocus={() => setBuscadorEnfocado(true)}
              onBlur={() => setBuscadorEnfocado(false)}
              returnKeyType="search"
            />
            {busqueda.length > 0 && (
              <TouchableOpacity
                accessibilityLabel="Limpiar búsqueda"
                onPress={() => setBusqueda("")}
                style={styles.botonLimpiar}
              >
                <Icono
                  nombre="close"
                  tamaño={16}
                  color={COLORES.textoSecundario}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Fila de Filtros por Género y Novedades */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filaFiltrosScroll}
            contentContainerStyle={styles.filaFiltros}
          >
            <Chip
              texto="Todos"
              activo={!categoria && !soloOfertas && !soloDestacados && !soloNovedades}
              alPresionar={() => {
                setCategoria("");
                setSoloOfertas(false);
                setSoloDestacados(false);
                setSoloNovedades(false);
              }}
            />
            <Chip
              texto="Novedades"
              icono="sparkles"
              activo={soloNovedades}
              alPresionar={() => {
                const nuevoValor = !soloNovedades;
                setSoloNovedades(nuevoValor);
                if (nuevoValor) {
                  setSoloOfertas(false);
                  setSoloDestacados(false);
                  setCategoria("");
                }
              }}
            />
            {GENEROS_MANGA.map((genero) => (
              <Chip
                key={genero.nombre}
                texto={`${genero.icono} ${genero.nombre}`}
                activo={categoria === genero.nombre}
                alPresionar={() => {
                  setSoloNovedades(false);
                  setCategoria(categoria === genero.nombre ? "" : genero.nombre);
                }}
              />
            ))}
            <Chip
              texto="Ofertas"
              icono="pricetag"
              activo={soloOfertas}
              alPresionar={() => {
                setSoloOfertas(!soloOfertas);
                if (!soloOfertas) setSoloNovedades(false);
              }}
            />
            <Chip
              texto="Destacados"
              icono="star"
              activo={soloDestacados}
              alPresionar={() => {
                setSoloDestacados(!soloDestacados);
                if (!soloDestacados) setSoloNovedades(false);
              }}
            />
          </ScrollView>

          {/* Resumen numérico y botón de limpiar */}
          <View style={styles.resumenResultados}>
            <Text style={styles.contadorResultados}>
              {cargando
                ? "Actualizando catálogo…"
                : `${filtrados.length} manga${filtrados.length === 1 ? "" : "s"}`}
            </Text>
            {(busqueda ||
              categoria ||
              soloOfertas ||
              soloDestacados ||
              soloNovedades) && (
              <TouchableOpacity onPress={limpiarFiltros}>
                <Text style={styles.limpiarFiltros}>Limpiar filtros</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Grilla de mangas */}
          {filtrados.length > 0 ? (
            <View key={columnasCatalogo} style={styles.grilla}>
              {Array.from(
                { length: Math.ceil(filtrados.length / columnasCatalogo) },
                (_, indiceFila) => (
                  <View key={`fila-${indiceFila}`} style={styles.fila}>
                    {filtrados
                      .slice(
                        indiceFila * columnasCatalogo,
                        (indiceFila + 1) * columnasCatalogo,
                      )
                      .map((item) => (
                        <View
                          key={String(item.id)}
                          style={{ width: `${100 / columnasCatalogo}%` }}
                        >
                          <TarjetaProducto
                            producto={item}
                            onAbrir={() =>
                              navigation.navigate("ProductoDetalle", {
                                product: item,
                              })
                            }
                            onAgregar={() => addItem(item)}
                          />
                        </View>
                      ))}
                  </View>
                ),
              )}
            </View>
          ) : (
            <View style={styles.contenedorVacio}>
              <View style={styles.iconoVacioContenedor}>
                <Icono
                  nombre={
                    errorCarga
                      ? "alert-circle"
                      : cargando
                        ? "library"
                        : "search"
                  }
                  tamaño={34}
                  color={errorCarga ? COLORES.error : COLORES.primarioLight}
                />
              </View>
              <Text style={styles.textoVacio}>
                {errorCarga
                  ? "No pudimos cargar estos mangas."
                  : cargando
                    ? "Cargando catálogo…"
                    : busqueda || categoria || soloOfertas || soloDestacados
                      ? "No hay mangas que coincidan con esos filtros."
                      : "No hay productos disponibles."}
              </Text>
              {errorCarga ? (
                <TouchableOpacity
                  onPress={cargar}
                  style={styles.botonReintentar}
                >
                  <Text style={styles.textoBotonReintentar}>Reintentar</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          <PiePagina navigation={navigation} esMobile={esMobile} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  lista: {
    flex: 1,
  },
  contenidoScroll: {
    flexGrow: 1,
  },
  contenido: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: ESPACIADO.lg,
    paddingTop: ESPACIADO.lg,
  },
  contenedorBuscador: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.completo,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    paddingHorizontal: ESPACIADO.md,
    marginBottom: ESPACIADO.sm,
    gap: ESPACIADO.sm,
    ...SOMBRAS.sm,
  },
  contenedorBuscadorEnfocado: {
    borderColor: COLORES.primario,
  },
  buscador: {
    flex: 1,
    minWidth: 0,
    color: COLORES.texto,
    paddingVertical: 15,
    fontSize: 15,
    fontFamily: FUENTES.medio,
  },
  botonLimpiar: {
    padding: ESPACIADO.xs,
  },
  filaFiltrosScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: ESPACIADO.xs,
  },
  filaFiltros: {
    gap: ESPACIADO.sm,
    paddingVertical: ESPACIADO.xs,
    paddingRight: ESPACIADO.lg,
  },
  resumenResultados: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: ESPACIADO.xs,
  },
  contadorResultados: {
    color: COLORES.textoSecundario,
    fontSize: 14,
    fontFamily: FUENTES.bold,
  },
  limpiarFiltros: {
    color: COLORES.primario,
    fontSize: 13,
    fontFamily: FUENTES.extrabold,
  },
  grilla: {
    width: "100%",
  },
  fila: {
    flexDirection: "row",
  },
  contenedorVacio: {
    alignItems: "center",
    marginTop: ESPACIADO.xxl,
    paddingHorizontal: ESPACIADO.md,
  },
  iconoVacioContenedor: {
    width: 76,
    height: 76,
    borderRadius: RADIO.full,
    backgroundColor: COLORES.primarioTinte,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ESPACIADO.md,
  },
  textoVacio: {
    color: COLORES.textoSecundario,
    textAlign: "center",
    fontSize: 15,
    fontFamily: FUENTES.bold,
  },
  botonReintentar: {
    marginTop: ESPACIADO.md,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.sm,
    borderRadius: RADIO.md,
    backgroundColor: COLORES.primario,
  },
  textoBotonReintentar: {
    color: "#FFFFFF",
    fontFamily: FUENTES.extrabold,
  },
});
