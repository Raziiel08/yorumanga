import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VendedorHomeScreen from "../screens/vendedor/PanelVendedor";
import VentasScreen from "../screens/vendedor/Ventas";
import NuevaVentaScreen from "../screens/vendedor/NuevaVenta";
import ClientesScreen from "../screens/vendedor/Clientes";
import ClienteFormScreen from "../screens/vendedor/FormCliente";
import ProductosVendedorScreen from "../screens/vendedor/ProductosVendedor";
import { COLORS, FONTS } from "../constants/theme";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function VendedorTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontSize: 17,
          fontFamily: FONTS.extrabold,
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: FONTS.bold,
        },
      }}
    >
      <Tab.Screen name="Panel" component={VendedorHomeScreen} />
      <Tab.Screen name="Ventas" component={VentasScreen} />
      <Tab.Screen name="Clientes" component={ClientesScreen} />
      <Tab.Screen name="Productos" component={ProductosVendedorScreen} />
    </Tab.Navigator>
  );
}
export default function VendedorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontSize: 17,
          fontFamily: FONTS.extrabold,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="VendedorTabs"
        component={VendedorTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NuevaVenta"
        component={NuevaVentaScreen}
        options={{
          title: "Nueva Venta",
        }}
      />
      <Stack.Screen
        name="ClienteForm"
        component={ClienteFormScreen}
        options={{
          title: "Cliente",
        }}
      />
    </Stack.Navigator>
  );
}
