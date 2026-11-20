import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminHomeScreen from "../screens/admin/PanelAdmin";
import ProductosAdminScreen from "../screens/admin/ProductosAdmin";
import ProductoFormScreen from "../screens/admin/FormProducto";
import PedidosAdminScreen from "../screens/admin/PedidosAdmin";
import SolicitudesAdminScreen from "../screens/admin/SolicitudesAdmin";
import UsuariosAdminScreen from "../screens/admin/UsuariosAdmin";
import VentasScreen from "../screens/vendedor/Ventas";
import NuevaVentaScreen from "../screens/vendedor/NuevaVenta";
import ClientesScreen from "../screens/vendedor/Clientes";
import ClienteFormScreen from "../screens/vendedor/FormCliente";
import StockScreen from "../screens/deposito/Stock";
import MovimientoStockScreen from "../screens/deposito/MovimientoStock";
import ProductosDepositoScreen from "../screens/deposito/ProductosDeposito";
import ProveedoresScreen from "../screens/deposito/Proveedores";
import ProveedorFormScreen from "../screens/deposito/FormProveedor";
import ReportesScreen from "../screens/admin/Reportes";
import { COLORS, FONTS } from "../constants/theme";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function AdminTabs() {
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
      <Tab.Screen name="Panel" component={AdminHomeScreen} />
      <Tab.Screen name="Productos" component={ProductosAdminScreen} />
      <Tab.Screen name="Pedidos" component={PedidosAdminScreen} />
      <Tab.Screen name="Solicitudes" component={SolicitudesAdminScreen} />
    </Tab.Navigator>
  );
}
export default function AdminStack() {
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
        name="AdminTabs"
        component={AdminTabs}
        options={{
          headerShown: false,
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
        name="Usuarios"
        component={UsuariosAdminScreen}
        options={{
          title: "Usuarios",
        }}
      />
      <Stack.Screen
        name="Ventas"
        component={VentasScreen}
        options={{
          title: "Ventas",
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
        name="Clientes"
        component={ClientesScreen}
        options={{
          title: "Clientes",
        }}
      />
      <Stack.Screen
        name="ClienteForm"
        component={ClienteFormScreen}
        options={{
          title: "Cliente",
        }}
      />
      <Stack.Screen
        name="Stock"
        component={StockScreen}
        options={{
          title: "Stock",
        }}
      />
      <Stack.Screen
        name="MovimientoStock"
        component={MovimientoStockScreen}
        options={{
          title: "Movimiento",
        }}
      />
      <Stack.Screen
        name="ProductosDeposito"
        component={ProductosDepositoScreen}
        options={{
          title: "Productos (Depósito)",
        }}
      />
      <Stack.Screen
        name="Proveedores"
        component={ProveedoresScreen}
        options={{
          title: "Proveedores",
        }}
      />
      <Stack.Screen
        name="ProveedorForm"
        component={ProveedorFormScreen}
        options={{
          title: "Proveedor",
        }}
      />
      <Stack.Screen
        name="Reportes"
        component={ReportesScreen}
        options={{
          title: "Reportes",
        }}
      />
    </Stack.Navigator>
  );
}
