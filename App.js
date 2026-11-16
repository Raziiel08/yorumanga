import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import {
  BebasNeue_400Regular,
} from '@expo-google-fonts/bebas-neue';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { AuthProvider } from './src/context/ContextoAuth';
import { CartProvider } from './src/context/ContextoCarrito';
import AppNavigator from './src/navigation/NavegadorApp';
import { COLORS } from './src/constants/theme';

export default function App() {
  const [fuentesCargadas] = useFonts({
    BebasNeue_400Regular,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fuentesCargadas) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={estilos.textoCargando}>Cargando YORUMANGA…</Text>
      </View>
    );
  }

  return <AuthProvider>
      <CartProvider>
        <StatusBar style="dark" backgroundColor={COLORS.background} />
        <AppNavigator />
      </CartProvider>
    </AuthProvider>;
}

const estilos = StyleSheet.create({
  cargando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: COLORS.background,
  },
  textoCargando: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
