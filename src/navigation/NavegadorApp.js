import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../context/ContextoAuth";
import AuthStack from "./PilaAuth";
import ClienteStack from "./PilaCliente";
import AdminStack from "./PilaAdmin";
import VendedorStack from "./PilaVendedor";
import DepositoStack from "./PilaDeposito";
import { COLORS } from "../constants/theme";

const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    border: COLORS.border,
    card: COLORS.surface,
    primary: COLORS.primary,
    text: COLORS.text,
  },
};

export default function AppNavigator() {
  const { user, cargando } = useAuth();
  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const Navegacion = !user
    ? AuthStack
    : user.rol === "admin"
      ? AdminStack
      : user.rol === "vendedor"
        ? VendedorStack
        : user.rol === "deposito"
          ? DepositoStack
          : ClienteStack;

  return (
    <View style={estilos.fondo}>
      <View style={estilos.marco}>
        <NavigationContainer theme={temaNavegacion}>
          <Navegacion />
        </NavigationContainer>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  marco: {
    flex: 1,
    width: "100%",
    maxWidth: 1440,
    alignSelf: "center",
    backgroundColor: COLORS.background,
  },
  cargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
