import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Image,
} from "react-native";
import Entrada from "../../components/Campo";
import Boton from "../../components/Boton";
import Icono from "../../components/Icono";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import { productsService } from "../../services/productos";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { Alert } from "../../utils/alertas";

export default function ProductoFormScreen({ route, navigation }) {
  const product = route?.params?.product;
  const [titulo, setTitulo] = useState(product?.titulo || "");
  const [autor, setAutor] = useState(product?.autor || "");
  const [precio, setPrecio] = useState(product?.precio?.toString() || "");
  const [precioAnterior, setPrecioAnterior] = useState(
    product?.precio_anterior?.toString() || "",
  );
  const [genero, setGenero] = useState(product?.genero || "");
  const [editorial, setEditorial] = useState(product?.editorial || "");
  const [descripcion, setDescripcion] = useState(product?.descripcion || "");
  const [imagen, setImagen] = useState(product?.imagen || "");
  const [destacado, setDestacado] = useState(product?.destacado ?? false);
  const [activo, setActivo] = useState(product?.activo ?? true);
  const [cargando, setCargando] = useState(false);

  const save = async () => {
    if (!titulo.trim() || !genero.trim()) {
      Alert.alert("Error", "Título y género son obligatorios");
      return;
    }
    const precioNum = parseFloat(precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      Alert.alert("Error", "Precio inválido");
      return;
    }
    const precioAnteriorNum = precioAnterior.trim()
      ? parseFloat(precioAnterior)
      : null;
    if (
      precioAnteriorNum !== null &&
      (!Number.isFinite(precioAnteriorNum) || precioAnteriorNum <= precioNum)
    ) {
      Alert.alert(
        "Error",
        "El precio anterior debe ser mayor que el precio actual",
      );
      return;
    }
    setCargando(true);
    try {
      const payload = {
        titulo: titulo.trim(),
        autor: autor.trim() || null,
        precio: precioNum,
        precio_anterior: precioAnteriorNum,
        genero: genero.trim(),
        editorial: editorial.trim() || undefined,
        descripcion: descripcion.trim() || undefined,
        imagen: imagen.trim() || undefined,
        destacado,
        activo,
      };
      if (product) {
        await productsService.update(product.id, payload);
      } else {
        await productsService.create(payload);
      }
      Alert.alert("Éxito", "Producto guardado");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setCargando(false);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contenidoScroll}
    >
      <EncabezadoPantalla
        kicker={product ? "EDITAR" : "ALTA"}
        titulo={product ? "Editar producto" : "Nuevo producto"}
        descripcion="Completá los datos del manga tal como van a verse en el catálogo."
        estilo={styles.encabezado}
      />

      <Entrada
        etiqueta="Título"
        placeholder="Ej. One Piece"
        value={titulo}
        onChangeText={setTitulo}
      />
      <Entrada
        etiqueta="Autor"
        placeholder="Nombre del autor"
        value={autor}
        onChangeText={setAutor}
      />
      <Entrada
        etiqueta="Precio"
        placeholder="Ej. 10000"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <Entrada
        etiqueta="Precio anterior (opcional)"
        placeholder="Solo para ofertas"
        value={precioAnterior}
        onChangeText={setPrecioAnterior}
        keyboardType="numeric"
      />
      <Entrada
        etiqueta="Género"
        placeholder="Ej. Shonen"
        value={genero}
        onChangeText={setGenero}
      />
      <Entrada
        etiqueta="Editorial"
        placeholder="Editorial del manga"
        value={editorial}
        onChangeText={setEditorial}
      />
      <Entrada
        etiqueta="Imagen"
        placeholder="URL de portada"
        value={imagen}
        onChangeText={setImagen}
        autoCapitalize="none"
      />

      {imagen ? (
        <View style={styles.coverPreviewContainer}>
          <Image source={{ uri: imagen }} style={styles.coverPreview} />
          <TouchableOpacity
            onPress={() => setImagen("")}
            style={styles.quitarPortada}
          >
            <Icono
              nombre="close-circle-outline"
              tamaño={15}
              color={COLORES.error}
            />
            <Text style={styles.quitarPortadaTexto}>Quitar portada</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Entrada
        etiqueta="Descripción"
        placeholder="Descripción breve del producto"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <View style={styles.tarjetaInterruptores}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Activo</Text>
          <Switch
            value={activo}
            onValueChange={setActivo}
            trackColor={{
              true: COLORES.primario,
            }}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>
            Mostrar como destacado en Inicio
          </Text>
          <Switch
            value={destacado}
            onValueChange={setDestacado}
            trackColor={{
              true: COLORES.primario,
            }}
          />
        </View>
      </View>

      <Boton
        titulo={product ? "Guardar cambios" : "Crear producto"}
        icono="checkmark"
        tamaño="lg"
        alPresionar={save}
        cargando={cargando}
        estilo={styles.botonGuardar}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
    backgroundColor: COLORES.fondo,
  },
  contenidoScroll: {
    padding: ESPACIADO.lg,
    paddingBottom: ESPACIADO.xxl,
  },
  encabezado: {
    marginBottom: ESPACIADO.lg,
  },
  coverPreviewContainer: {
    alignItems: "flex-start",
    marginBottom: ESPACIADO.md,
  },
  coverPreview: {
    width: 100,
    height: 140,
    borderRadius: RADIO.sm,
    backgroundColor: COLORES.superficieAlterna,
    marginBottom: ESPACIADO.xs,
    ...SOMBRAS.sm,
  },
  quitarPortada: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  quitarPortadaTexto: {
    color: COLORES.error,
    fontFamily: FUENTES.bold,
    fontSize: 12,
  },
  tarjetaInterruptores: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    padding: ESPACIADO.md,
    marginBottom: ESPACIADO.lg,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ESPACIADO.xs,
  },
  switchLabel: {
    color: COLORES.texto,
    fontFamily: FUENTES.semibold,
    fontSize: 15,
    flex: 1,
    paddingRight: ESPACIADO.md,
  },
  botonGuardar: {
    marginTop: ESPACIADO.xs,
  },
});
