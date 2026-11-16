import React, { useCallback, useMemo, useState } from 'react';
import {
  Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/ContextoAuth';
import { useCart } from '../../context/ContextoCarrito';
import { productsService } from '../../services/productos';
import { useResponsive } from '../../hooks/useResponsivo';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';
import { GENEROS_MANGA } from '../../constants/generos';
import TarjetaProducto from '../../components/TarjetaProducto';
import PiePagina from '../../components/PiePagina';

const PARAMETROS_CATALOGO = {
  busqueda: '',
  genero: '',
  soloOfertas: false,
  soloDestacados: false,
  orden: 'recientes',
};

function SeccionProductos({
  titulo,
  productos,
  columnas,
  mensajeVacio,
  cargando,
  error,
  onVerTodos,
  onReintentar,
  onAbrirProducto,
  onAgregarProducto,
}) {
  return (
    <View style={styles.seccion}>
      <View style={styles.encabezadoSeccion}>
        <Text style={styles.tituloSeccion}>{titulo}</Text>
        <TouchableOpacity onPress={onVerTodos} accessibilityRole="button" style={styles.enlaceSeccion}>
          <Text style={styles.textoEnlace}>Ver todos</Text>
          <Text style={styles.flechaEnlace}>→</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <View style={styles.estadoSeccion}>
          <Text style={styles.textoEstadoSeccion}>No se pudo cargar esta sección.</Text>
          <TouchableOpacity onPress={onReintentar}>
            <Text style={styles.textoEnlace}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : productos.length > 0 ? (
        <View style={styles.grilla}>
          {productos.map((producto) => (
            <View key={String(producto.id)} style={{ width: `${100 / columnas}%` }}>
              <TarjetaProducto
                producto={producto}
                onAbrir={() => onAbrirProducto(producto)}
                onAgregar={() => onAgregarProducto(producto)}
              />
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.textoEstadoSeccion}>
          {cargando ? 'Cargando mangas…' : mensajeVacio}
        </Text>
      )}
    </View>
  );
}

export default function PantallaInicio({ navigation }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { esMobile, columnas, anchoMaxContenido } = useResponsive();
  const { width } = useWindowDimensions();
  const columnasInicio = esMobile ? (width < 380 ? 1 : 2) : columnas;
  const [productos, setProductos] = useState([]);
  const [masVendidos, setMasVendidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorProductos, setErrorProductos] = useState(false);
  const [errorMasVendidos, setErrorMasVendidos] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setErrorProductos(false);
    setErrorMasVendidos(false);

    const [resultadoProductos, resultadoMasVendidos] = await Promise.allSettled([
      productsService.getAll(true),
      productsService.getBestSelling(8),
    ]);

    if (resultadoProductos.status === 'fulfilled') {
      setProductos(resultadoProductos.value || []);
    } else {
      console.error('Error al cargar productos de inicio:', resultadoProductos.reason);
      setErrorProductos(true);
      setProductos([]);
    }

    if (resultadoMasVendidos.status === 'fulfilled') {
      setMasVendidos(resultadoMasVendidos.value || []);
    } else {
      console.error('Error al cargar mangas más vendidos:', resultadoMasVendidos.reason);
      setErrorMasVendidos(true);
      setMasVendidos([]);
    }
    setCargando(false);
  }, []);

  useFocusEffect(useCallback(() => {
    cargar();
  }, [cargar]));

  const destacados = useMemo(
    () => productos.filter((producto) => producto.destacado === true).slice(0, 8),
    [productos],
  );
  const novedades = useMemo(() => productos.slice(0, 8), [productos]);
  const ofertas = useMemo(
    () => productos
      .filter((producto) => Number(producto.precio_anterior) > Number(producto.precio))
      .slice(0, 8),
    [productos],
  );
  const portadasHero = useMemo(
    () => productos.filter((producto) => producto.imagen).slice(0, 3),
    [productos],
  );

  const abrirCatalogo = (params = {}) => navigation.jumpTo('Catálogo', {
    ...PARAMETROS_CATALOGO,
    ...params,
  });

  const abrirProducto = (producto) => navigation.navigate('ProductoDetalle', { product: producto });

  const agregarAlCarrito = (producto) => {
    addItem(producto);
  };

  const columnasHero = [0, 1, 2];
  const portadaHeroCompacta = width < 380;
  const saludo = user?.nombre ? `Hola, ${user.nombre.split(' ')[0]}` : 'Bienvenido a YORUMANGA';

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenedorScroll}
      showsVerticalScrollIndicator
    >
      <View style={[styles.contenido, { maxWidth: anchoMaxContenido }]}>
        <LinearGradient
          colors={['#3B2A3E', COLORES.primarioOscuro]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, !esMobile && styles.heroAmplio]}
        >
          <View style={styles.heroBrillo} />
          <View style={styles.heroTexto}>
            <View style={styles.heroFilaKicker}>
              <View style={styles.heroPunto} />
              <Text style={styles.heroKicker}>{saludo.toUpperCase()} · MANGA FÍSICO</Text>
            </View>
            <Text style={styles.heroTitulo}>Historias que{'\n'}te atrapan.</Text>
            <Text style={styles.heroSubtitulo}>
              Explorá novedades, clásicos y encontrá tu próxima lectura favorita.
            </Text>
            <TouchableOpacity
              style={styles.heroBoton}
              onPress={() => abrirCatalogo()}
              activeOpacity={0.85}
            >
              <Text style={styles.heroTextoBoton}>Explorar catálogo</Text>
              <Text style={styles.heroFlecha}>→</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroPortadas}>
            {columnasHero.map((indice) => {
              const producto = portadasHero[indice];
              return producto ? (
                <Image
                  key={String(producto.id)}
                  source={{ uri: producto.imagen }}
                  accessibilityLabel={`Portada de ${producto.titulo}`}
                  style={[
                    styles.portadaHero,
                    portadaHeroCompacta && styles.portadaHeroCompacta,
                    indice === 1 && styles.portadaHeroCentro,
                    portadaHeroCompacta && indice === 1 && styles.portadaHeroCentroCompacta,
                  ]}
                />
              ) : (
                <View
                  key={`portada-vacia-${indice}`}
                  style={[
                    styles.portadaHero,
                    portadaHeroCompacta && styles.portadaHeroCompacta,
                    styles.portadaHeroVacia,
                    indice === 1 && styles.portadaHeroCentro,
                    portadaHeroCompacta && indice === 1 && styles.portadaHeroCentroCompacta,
                  ]}
                >
                  <Text style={styles.iconoPortadaHero}>📖</Text>
                  <Text style={styles.textoPortadaHero}>Próxima lectura</Text>
                </View>
              );
            })}
          </View>
        </LinearGradient>

        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Explorá por género</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filaChips}
          >
            {GENEROS_MANGA.map((genero) => (
              <TouchableOpacity
                key={genero.nombre}
                style={styles.chip}
                onPress={() => abrirCatalogo({ genero: genero.nombre })}
                activeOpacity={0.8}
              >
                <Text style={styles.iconoChip}>{genero.icono}</Text>
                <Text style={styles.textoChip}>{genero.nombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <SeccionProductos
          titulo="Destacados"
          productos={destacados}
          columnas={columnasInicio}
          cargando={cargando}
          error={errorProductos}
          mensajeVacio="Todavía no hay mangas seleccionados como destacados."
          onVerTodos={() => abrirCatalogo({ soloDestacados: true })}
          onReintentar={cargar}
          onAbrirProducto={abrirProducto}
          onAgregarProducto={agregarAlCarrito}
        />

        <SeccionProductos
          titulo="Novedades"
          productos={novedades}
          columnas={columnasInicio}
          cargando={cargando}
          error={errorProductos}
          mensajeVacio="Todavía no hay mangas en el catálogo."
          onVerTodos={() => abrirCatalogo({ orden: 'recientes' })}
          onReintentar={cargar}
          onAbrirProducto={abrirProducto}
          onAgregarProducto={agregarAlCarrito}
        />

        <SeccionProductos
          titulo="Más vendidos"
          productos={masVendidos}
          columnas={columnasInicio}
          cargando={cargando}
          error={errorMasVendidos}
          mensajeVacio="Aún no hay ventas completadas para mostrar."
          onVerTodos={() => abrirCatalogo({ orden: 'mas-vendidos' })}
          onReintentar={cargar}
          onAbrirProducto={abrirProducto}
          onAgregarProducto={agregarAlCarrito}
        />

        <SeccionProductos
          titulo="Ofertas"
          productos={ofertas}
          columnas={columnasInicio}
          cargando={cargando}
          error={errorProductos}
          mensajeVacio="Por ahora no hay mangas con descuento."
          onVerTodos={() => abrirCatalogo({ soloOfertas: true })}
          onReintentar={cargar}
          onAbrirProducto={abrirProducto}
          onAgregarProducto={agregarAlCarrito}
        />

        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>¿Qué te gustaría leer?</Text>
          <TouchableOpacity
            style={[styles.botonFuncion, styles.botonFuncionIA]}
            onPress={() => navigation.navigate('RecomendadorIA')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconoFuncionContenedor, styles.iconoFuncionIA]}>
              <Text style={styles.iconoFuncion}>✨</Text>
            </View>
            <View style={styles.contenidoFuncion}>
              <Text style={styles.tituloFuncion}>Recomendador con IA</Text>
              <Text style={styles.descripcionFuncion}>Encontrá tu próximo manga favorito</Text>
            </View>
            <Text style={styles.flechaFuncion}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonFuncion}
            onPress={() => navigation.navigate('SolicitarManga')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconoFuncionContenedor, styles.iconoFuncionLibro]}>
              <Text style={styles.iconoFuncion}>📖</Text>
            </View>
            <View style={styles.contenidoFuncion}>
              <Text style={styles.tituloFuncion}>Solicitar un manga</Text>
              <Text style={styles.descripcionFuncion}>¿No está en el catálogo? Pedilo</Text>
            </View>
            <Text style={styles.flechaFuncion}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PiePagina navigation={navigation} esMobile={esMobile} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenedorScroll: {
    alignItems: 'center',
  },
  contenido: {
    width: '100%',
    paddingHorizontal: ESPACIADO.lg,
    paddingTop: ESPACIADO.lg,
  },
  hero: {
    overflow: 'hidden',
    borderRadius: RADIO.xl,
    padding: ESPACIADO.lg,
    marginBottom: ESPACIADO.xl,
    ...SOMBRAS.lg,
  },
  heroBrillo: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(217, 134, 85, 0.22)',
  },
  heroAmplio: {
    minHeight: 300,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.lg,
    padding: ESPACIADO.xl,
  },
  heroTexto: {
    flex: 1,
    alignItems: 'flex-start',
  },
  heroFilaKicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: ESPACIADO.sm,
  },
  heroPunto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORES.acento,
  },
  heroKicker: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    fontFamily: FUENTES.extrabold,
    letterSpacing: 2.4,
  },
  heroTitulo: {
    color: '#FFFFFF',
    fontSize: 46,
    lineHeight: 50,
    fontFamily: FUENTES.display,
    letterSpacing: 1.5,
    marginBottom: ESPACIADO.sm,
  },
  heroSubtitulo: {
    maxWidth: 520,
    color: 'rgba(255,255,255,0.78)',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FUENTES.medio,
    marginBottom: ESPACIADO.md,
  },
  heroBoton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORES.acento,
    justifyContent: 'center',
    paddingHorizontal: ESPACIADO.lg,
    borderRadius: RADIO.md,
    ...SOMBRAS.sm,
  },
  heroTextoBoton: {
    color: '#FFFFFF',
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
    letterSpacing: 0.4,
  },
  heroFlecha: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FUENTES.extrabold,
  },
  heroPortadas: {
    height: 190,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIADO.sm,
    marginTop: ESPACIADO.md,
  },
  portadaHero: {
    width: 82,
    height: 126,
    borderRadius: RADIO.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.28)',
    transform: [{ rotate: '-5deg' }],
  },
  portadaHeroCompacta: {
    width: 60,
    height: 104,
  },
  portadaHeroCentro: {
    width: 96,
    height: 148,
    transform: [{ rotate: '0deg' }],
  },
  portadaHeroCentroCompacta: {
    width: 76,
    height: 126,
  },
  portadaHeroVacia: {
    padding: ESPACIADO.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255,255,255,0.22)',
  },
  iconoPortadaHero: {
    fontSize: 28,
    marginBottom: ESPACIADO.xs,
  },
  textoPortadaHero: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 10,
    fontFamily: FUENTES.bold,
    textAlign: 'center',
  },
  seccion: {
    marginBottom: ESPACIADO.xl,
  },
  encabezadoSeccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACIADO.md,
  },
  tituloSeccion: {
    color: COLORES.texto,
    fontSize: 24,
    fontFamily: FUENTES.display,
    letterSpacing: 1,
  },
  enlaceSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textoEnlace: {
    color: COLORES.primario,
    fontFamily: FUENTES.extrabold,
    fontSize: 14,
  },
  flechaEnlace: {
    color: COLORES.primario,
    fontSize: 15,
    fontFamily: FUENTES.extrabold,
  },
  filaChips: {
    gap: ESPACIADO.sm,
    paddingRight: ESPACIADO.lg,
  },
  chip: {
    minHeight: 46,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.sm,
    borderRadius: RADIO.completo,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.xs,
    ...SOMBRAS.sm,
  },
  iconoChip: {
    fontSize: 15,
  },
  textoChip: {
    color: COLORES.texto,
    fontSize: 14,
    fontFamily: FUENTES.extrabold,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  estadoSeccion: {
    minHeight: 68,
    padding: ESPACIADO.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
  },
  textoEstadoSeccion: {
    color: COLORES.textoSecundario,
    fontSize: 14,
    fontFamily: FUENTES.medio,
    lineHeight: 21,
    textAlign: 'center',
  },
  botonFuncion: {
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    padding: ESPACIADO.md,
    borderRadius: RADIO.lg,
    marginBottom: ESPACIADO.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.md,
    ...SOMBRAS.sm,
  },
  botonFuncionIA: {
    borderColor: COLORES.acentoTinte,
    backgroundColor: '#FFFBF6',
  },
  iconoFuncionContenedor: {
    width: 46,
    height: 46,
    borderRadius: RADIO.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoFuncionIA: {
    backgroundColor: COLORES.acentoTinte,
  },
  iconoFuncionLibro: {
    backgroundColor: COLORES.primarioTinte,
  },
  iconoFuncion: {
    fontSize: 22,
  },
  contenidoFuncion: {
    flex: 1,
  },
  tituloFuncion: {
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
    fontSize: 16,
  },
  descripcionFuncion: {
    color: COLORES.textoSecundario,
    fontSize: 14,
    fontFamily: FUENTES.medio,
    lineHeight: 20,
    marginTop: 2,
  },
  flechaFuncion: {
    color: COLORES.textoAtenuado,
    fontSize: 22,
    fontFamily: FUENTES.bold,
  },
});
