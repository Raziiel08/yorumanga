import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width } = useWindowDimensions();
  const esMobile = width < 768;
  const esTablet = width >= 768 && width < 1024;
  const esEscritorio = width >= 1024;
  const columnas = esMobile ? 2 : esTablet ? 3 : width >= 1440 ? 5 : 4;
  const anchoMaxContenido = esEscritorio ? 1360 : '100%';
  return { width, esMobile, esTablet, esEscritorio, columnas, anchoMaxContenido };
}
