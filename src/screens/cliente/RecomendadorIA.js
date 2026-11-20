import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icono from "../../components/Icono";
import Etiqueta from "../../components/Etiqueta";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import { productsService } from "../../services/productos";
import { aiService } from "../../services/ia";
import { useCart } from "../../context/ContextoCarrito";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { Alert } from "../../utils/alertas";

export default function RecomendadorIA({ navigation }) {
  const [preferencias, setPreferencias] = useState("");
  const [results, setResults] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [enfocado, setEnfocado] = useState(false);
  const [error, setError] = useState("");
  const [agregados, setAgregados] = useState({});
  const { addItem } = useCart();

  const buscar = async () => {
    if (!preferencias.trim()) {
      setError("Escribí qué te gusta leer para poder recomendarte.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const recs = await aiService.recommendProducts(preferencias);
      setResults(recs);
    } catch (e) {
      setError(e.message || "No se pudieron generar recomendaciones.");
    } finally {
      setCargando(false);
    }
  };

  const agregar = async (rec, indice) => {
    if (!rec.producto_id) return;
    try {
      const products = await productsService.getAll(true);
      const p = products.find((x) => x.id === rec.producto_id);
      if (p && p.stock > 0) {
        addItem(p);
        setAgregados((actuales) => ({ ...actuales, [indice]: true }));
        setTimeout(
          () => setAgregados((actuales) => ({ ...actuales, [indice]: false })),
          1800,
        );
      }
    } catch (e) {
      setError(e.message || "No se pudo agregar al carrito.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <EncabezadoPantalla
        kicker="ASISTENTE DE LECTURA"
        titulo="Recomendador IA"
        descripcion="Contanos qué te gusta y te sugerimos tu próximo manga. En la versión gratuita, Google puede usar tus consultas para mejorar sus servicios."
      />

      <View style={styles.tarjetaConsulta}>
        <View
          style={[
            styles.contenedorInput,
            enfocado && styles.contenedorInputEnfocado,
          ]}
        >
          <Icono nombre="sparkles" tamaño={17} color={COLORES.acentoOscuro} />
          <TextInput
            style={styles.input}
            placeholder="Ej: me gustan los shounen de acción"
            placeholderTextColor={COLORES.textoAtenuado}
            value={preferencias}
            onChangeText={setPreferencias}
            onFocus={() => setEnfocado(true)}
            onBlur={() => setEnfocado(false)}
            multiline
          />
        </View>
        <TouchableOpacity
          style={[styles.btn, cargando && styles.btnCargando]}
          onPress={buscar}
          disabled={cargando}
          activeOpacity={0.85}
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.filaBoton}>
              <Icono nombre="sparkles" tamaño={16} color="#FFFFFF" />
              <Text style={styles.btnText}>Recomendar</Text>
            </View>
          )}
        </TouchableOpacity>
        {error ? (
          <View style={styles.avisoError}>
            <Icono nombre="alert-circle" tamaño={15} color={COLORES.error} />
            <Text style={styles.textoAvisoError} numberOfLines={3}>
              {error}
            </Text>
          </View>
        ) : null}
      </View>

      <FlatList
        data={results}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            {item.imagen ? (
              <Image
                source={{ uri: item.imagen }}
                style={styles.cover}
                accessibilityLabel={`Portada de ${item.titulo}`}
              />
            ) : (
              <View style={[styles.cover, styles.coverVacia]}>
                <Icono
                  nombre="book"
                  tamaño={22}
                  color={COLORES.primarioLight}
                />
              </View>
            )}
            <View style={styles.contenidoCard}>
              <View style={styles.filaTitulo}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                {item.en_catalogo && (
                  <Etiqueta texto="EN CATÁLOGO" variante="exito" />
                )}
              </View>
              {item.genero ? (
                <Text style={styles.cardGenero}>Género: {item.genero}</Text>
              ) : null}
              <Text style={styles.cardRazon}>{item.razon}</Text>
              {item.en_catalogo && (
                <TouchableOpacity
                  style={[
                    styles.smallBtn,
                    agregados[index] && styles.smallBtnAgregado,
                  ]}
                  onPress={() => agregar(item, index)}
                  activeOpacity={0.85}
                >
                  <Icono
                    nombre={agregados[index] ? "checkmark" : "cart"}
                    tamaño={14}
                    color="#FFFFFF"
                  />
                  <Text style={styles.smallBtnText}>
                    {agregados[index] ? "Agregado" : "Agregar al carrito"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.contenedorVacio}>
            <View style={styles.iconoVacioContenedor}>
              <Icono
                nombre="sparkles-outline"
                tamaño={30}
                color={COLORES.primarioLight}
              />
            </View>
            <Text style={styles.empty}>
              {results.length === 0 && !cargando
                ? 'Contá tus preferencias y presioná "Recomendar".'
                : "Buscando recomendaciones…"}
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
    backgroundColor: COLORES.fondo,
    padding: ESPACIADO.lg,
  },
  tarjetaConsulta: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.md,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    marginBottom: ESPACIADO.lg,
    ...SOMBRAS.sm,
  },
  contenedorInput: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.fondo,
    borderRadius: RADIO.md,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.sm,
    marginBottom: ESPACIADO.sm,
  },
  contenedorInputEnfocado: {
    borderColor: COLORES.primario,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: COLORES.texto,
    fontSize: 15,
    fontFamily: FUENTES.medio,
    minHeight: 44,
    textAlignVertical: "top",
  },
  btn: {
    minHeight: 48,
    backgroundColor: COLORES.primario,
    borderRadius: RADIO.md,
    alignItems: "center",
    justifyContent: "center",
    ...SOMBRAS.sm,
  },
  btnCargando: {
    opacity: 0.7,
  },
  filaBoton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnText: {
    color: "#FFFFFF",
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
  },
  lista: {
    paddingBottom: ESPACIADO.xxl,
  },
  card: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.md,
    borderRadius: RADIO.lg,
    marginBottom: ESPACIADO.sm,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    flexDirection: "row",
    gap: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  cover: {
    width: 68,
    height: 95,
    borderRadius: RADIO.sm,
    backgroundColor: COLORES.superficieAlterna,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
  },
  coverVacia: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORES.primarioTinte,
  },
  contenidoCard: {
    flex: 1,
    minWidth: 0,
  },
  filaTitulo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: ESPACIADO.sm,
  },
  cardTitle: {
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
  cardGenero: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.bold,
    marginTop: 2,
  },
  cardRazon: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontFamily: FUENTES.medio,
    lineHeight: 19,
    marginTop: ESPACIADO.xs,
  },
  smallBtn: {
    marginTop: ESPACIADO.sm,
    alignSelf: "flex-start",
    backgroundColor: COLORES.primario,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.xs + 2,
    borderRadius: RADIO.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallBtnText: {
    color: "#FFFFFF",
    fontFamily: FUENTES.extrabold,
    fontSize: 13,
  },
  contenedorVacio: {
    alignItems: "center",
    paddingVertical: ESPACIADO.xl,
  },
  iconoVacioContenedor: {
    width: 72,
    height: 72,
    borderRadius: RADIO.full,
    backgroundColor: COLORES.primarioTinte,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ESPACIADO.sm,
  },
  empty: {
    color: COLORES.textoSecundario,
    textAlign: "center",
    fontFamily: FUENTES.bold,
    maxWidth: 300,
  },
});
