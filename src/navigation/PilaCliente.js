import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icono from "../components/Icono";
import LogoMarca from "../components/LogoMarca";
import HomeScreen from "../screens/cliente/Inicio";
import CatalogoScreen from "../screens/cliente/Catalogo";
import ProductoDetalleScreen from "../screens/cliente/DetalleProducto";
import CarritoScreen from "../screens/cliente/Carrito";
import PerfilScreen from "../screens/cliente/Perfil";
import SolicitarMangaScreen from "../screens/cliente/SolicitarManga";
import RecomendadorIA from "../screens/cliente/RecomendadorIA";
import MisPedidosScreen from "../screens/cliente/MisPedidos";
import MisSolicitudesScreen from "../screens/cliente/MisSolicitudes";
import PagoScreen from "../screens/cliente/Pago";
import EncabezadoEscritorio from "../components/EncabezadoEscritorio";
import { useResponsive } from "../hooks/useResponsivo";
import { COLORS, FUENTES } from "../constants/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PANTALLAS_TAB = {
  Inicio: { activo: "home", inactivo: "home-outline" },
  Catálogo: { activo: "grid", inactivo: "grid-outline" },
  Carrito: { activo: "cart", inactivo: "cart-outline" },
  Perfil: { activo: "person", inactivo: "person-outline" },
};

function HomeTabs() {
  const { esEscritorio } = useResponsive();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: !esEscritorio,
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontFamily: FUENTES.extrabold,
          fontSize: 18,
        },
        headerTitle: () => <LogoMarca ancho={104} />,
        headerShadowVisible: false,
        tabBarStyle: {
          display: esEscritorio ? "none" : "flex",
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          minHeight: 76,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: FUENTES.extrabold,
          marginTop: 2,
        },
      }}
    >
      {Object.entries(PANTALLAS_TAB).map(([nombre, iconos]) => (
        <Tab.Screen
          key={nombre}
          name={nombre}
          component={
            nombre === "Inicio"
              ? HomeScreen
              : nombre === "Catálogo"
                ? CatalogoScreen
                : nombre === "Carrito"
                  ? CarritoScreen
                  : PerfilScreen
          }
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icono
                nombre={focused ? iconos.activo : iconos.inactivo}
                tamaño={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function ClienteStack() {
  const { esEscritorio } = useResponsive();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontFamily: FUENTES.extrabold,
          fontSize: 17,
        },
        headerShadowVisible: false,
        header: esEscritorio
          ? (props) => <EncabezadoEscritorio {...props} />
          : undefined,
      }}
    >
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{
          headerShown: esEscritorio,
        }}
      />
      <Stack.Screen
        name="ProductoDetalle"
        component={ProductoDetalleScreen}
        options={{
          title: "Detalle del Manga",
        }}
      />
      <Stack.Screen
        name="SolicitarManga"
        component={SolicitarMangaScreen}
        options={{
          title: "Solicitar Manga",
        }}
      />
      <Stack.Screen
        name="RecomendadorIA"
        component={RecomendadorIA}
        options={{
          title: "Recomendador con IA",
        }}
      />
      <Stack.Screen
        name="MisPedidos"
        component={MisPedidosScreen}
        options={{
          title: "Mis Pedidos",
        }}
      />
      <Stack.Screen
        name="MisSolicitudes"
        component={MisSolicitudesScreen}
        options={{
          title: "Mis Solicitudes",
        }}
      />
      <Stack.Screen
        name="Pago"
        component={PagoScreen}
        options={{
          title: "Pago Seguro",
        }}
      />
    </Stack.Navigator>
  );
}
