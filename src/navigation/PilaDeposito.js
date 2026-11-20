import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DepositoHomeScreen from "../screens/deposito/PanelDeposito";
import StockScreen from "../screens/deposito/Stock";
import MovimientoStockScreen from "../screens/deposito/MovimientoStock";
import ProductosDepositoScreen from "../screens/deposito/ProductosDeposito";
import ProductoFormScreen from "../screens/admin/FormProducto";
import ProveedoresScreen from "../screens/deposito/Proveedores";
import ProveedorFormScreen from "../screens/deposito/FormProveedor";
import { COLORS, FONTS } from "../constants/theme";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function DepositoTabs() {
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
      <Tab.Screen name="Panel" component={DepositoHomeScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
      <Tab.Screen name="Productos" component={ProductosDepositoScreen} />
      <Tab.Screen name="Proveedores" component={ProveedoresScreen} />
    </Tab.Navigator>
  );
}
export default function DepositoStack() {
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
        name="DepositoTabs"
        component={DepositoTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MovimientoStock"
        component={MovimientoStockScreen}
        options={{
          title: "Movimiento de Stock",
        }}
      />
      <Stack.Screen
        name="ProductoForm"
        component={ProductoFormScreen}
        options={{
          title: "Producto",
        }}
      />
      <Stack.Screen
        name="ProveedorForm"
        component={ProveedorFormScreen}
        options={{
          title: "Proveedor",
        }}
      />
    </Stack.Navigator>
  );
}
