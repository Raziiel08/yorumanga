import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icono from "../../components/Icono";
import EncabezadoPantalla from "../../components/EncabezadoPantalla";
import Campo from "../../components/Campo";
import Boton from "../../components/Boton";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../context/ContextoAuth";
import {
  COLORES,
  ESPACIADO,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";

export default function SolicitarMangaScreen({ navigation }) {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorTitulo, setErrorTitulo] = useState("");
  const [error, setError] = useState("");

  const save = async () => {
    if (!titulo.trim()) {
      setErrorTitulo("Ingresá el título del manga que buscás.");
      return;
    }
    if (!user) {
      setError("Iniciá sesión para enviar una solicitud.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const { error } = await supabase.from("solicitudes_manga").insert([
        {
          usuario_id: user.id,
          titulo_solicitado: titulo.trim(),
          observaciones: observaciones.trim() || null,
        },
      ]);
      if (error) throw error;
      navigation.goBack();
    } catch (e) {
      setError(e.message || "No se pudo enviar la solicitud.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contenidoScroll}
      keyboardShouldPersistTaps="handled"
    >
      <EncabezadoPantalla
        kicker="¿FALTA ALGO EN EL CATÁLOGO?"
        titulo="Solicitar manga"
        descripcion="Contanos qué manga buscás y lo sumamos a la tienda."
      />

      <View style={styles.tarjeta}>
        <View style={styles.filaInfo}>
          <View style={styles.iconoInfo}>
            <Icono nombre="book-outline" tamaño={20} color={COLORES.primario} />
          </View>
          <Text style={styles.textoInfo}>
            Revisamos cada solicitud y te avisamos cuando esté disponible.
          </Text>
        </View>

        <Campo
          etiqueta="Manga solicitado"
          placeholder="Título del manga"
          value={titulo}
          onChangeText={(texto) => {
            setTitulo(texto);
            if (errorTitulo) setErrorTitulo("");
          }}
          errorMensaje={errorTitulo}
        />
        <Campo
          etiqueta="Observaciones"
          placeholder="Editorial, edición u otro detalle (opcional)"
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          numberOfLines={3}
          style={styles.campoObservaciones}
        />
        {error ? <Text style={styles.textoError}>{error}</Text> : null}
        <Boton
          titulo="Enviar solicitud"
          alPresionar={save}
          cargando={cargando}
          icono="paper-plane-outline"
        />
      </View>
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
  },
  filaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.primarioTinte,
    borderRadius: RADIO.md,
    padding: ESPACIADO.md,
    marginBottom: ESPACIADO.lg,
  },
  iconoInfo: {
    width: 38,
    height: 38,
    borderRadius: RADIO.sm,
    backgroundColor: COLORES.superficie,
    alignItems: "center",
    justifyContent: "center",
  },
  textoInfo: {
    flex: 1,
    color: COLORES.primario,
    fontSize: 13,
    fontFamily: FUENTES.bold,
    lineHeight: 18,
  },
  tarjeta: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIADO.lg,
    borderRadius: RADIO.xl,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.sm,
  },
  campoObservaciones: {
    minHeight: 90,
  },
  textoError: {
    color: COLORES.error,
    fontFamily: FUENTES.bold,
    fontSize: 13,
    marginBottom: ESPACIADO.sm,
  },
});
