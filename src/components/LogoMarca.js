import React from 'react';
import { Image } from 'react-native';

export default function LogoMarca({ ancho = 160, estilo }) {
  return (
    <Image
      source={require('../assets/yorumanga-logo.png')}
      resizeMode="contain"
      accessibilityLabel="YORUMANGA"
      style={[
        {
          width: ancho,
          height: ancho * (397 / 616),
        },
        estilo,
      ]}
    />
  );
}
