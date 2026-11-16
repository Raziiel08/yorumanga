import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icono from '../../components/Icono';
import Etiqueta from '../../components/Etiqueta';
import Campo from '../../components/Campo';
import Boton from '../../components/Boton';
import { useAuth } from '../../context/ContextoAuth';
import { supabase } from '../../config/supabase';
import { COLORES, ESPACIADO, FUENTES, RADIO, SOMBRAS } from '../../constants/theme';

export default function PantallaPerfil({ navigation }) {
  const { user, signOut } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [guardando, setGuardando] = useState(false);
  const [guardadoOk, setGuardadoOk] = useState(false);
  const [error, setError] = useState('');
  const [errorSalida, setErrorSalida] = useState(false);

  const guardarPerfil = async () => {
    if (!user) return;
    setGuardando(true);
    setError('');
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ nombre })
        .eq('id', user.id);
      if (error) throw error;
      setGuardadoOk(true);
      setTimeout(() => setGuardadoOk(false), 2200);
    } catch (e) {
      setError(e.message || 'No se pudieron guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  };

  const cerrarSesion = async () => {
    const errorSalida = await signOut();
    if (errorSalida) {
      setErrorSalida(true);
      setTimeout(() => setErrorSalida(false), 3000);
    }
  };

  const iniciales = (user?.nombre || user?.email || '?')
    .split(' ')
    .map((palabra) => palabra[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <ScrollView style={estilos.contenedor} showsVerticalScrollIndicator>
      <View style={estilos.seccionAvatar}>
        <View style={estilos.avatar}>
          <Text style={estilos.textoAvatar}>{iniciales}</Text>
        </View>
        <Text style={estilos.nombreUsuario}>{user?.nombre || 'Usuario'}</Text>
        <Etiqueta texto={user?.rol || 'cliente'} variante="primarioSuave" />
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Cuenta</Text>
        <View style={estilos.tarjetaInfo}>
          <View style={estilos.filaInfo}>
            <View style={estilos.filaInfoEtiqueta}>
              <Icono nombre="mail-outline" tamaño={17} color={COLORES.primario} />
              <Text style={estilos.etiquetaInfo}>Email</Text>
            </View>
            <Text style={estilos.valorInfo}>{user?.email}</Text>
          </View>
          <View style={estilos.separador} />
          <View style={estilos.filaInfo}>
            <View style={estilos.filaInfoEtiqueta}>
              <Icono nombre="shield-outline" tamaño={17} color={COLORES.primario} />
              <Text style={estilos.etiquetaInfo}>Rol</Text>
            </View>
            <Text style={estilos.valorInfo}>{user?.rol}</Text>
          </View>
        </View>
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Editar perfil</Text>
        <Campo
          etiqueta="Nombre"
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
        />
        {error ? (
          <Text style={estilos.textoError}>
            {error}
          </Text>
        ) : null}
        <Boton
          titulo={guardadoOk ? '✓ Guardado' : guardando ? 'Guardando...' : 'Guardar perfil'}
          alPresionar={guardarPerfil}
          cargando={guardando}
          icono={guardadoOk ? 'checkmark' : 'save-outline'}
        />
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Mis actividades</Text>
        <TouchableOpacity
          style={estilos.botonNavegacion}
          onPress={() => navigation.navigate('MisPedidos')}
          activeOpacity={0.8}
        >
          <View style={estilos.iconoNavegacion}>
            <Icono nombre="receipt-outline" tamaño={19} color={COLORES.primario} />
          </View>
          <Text style={estilos.textoNavegacion}>Mis Pedidos</Text>
          <Icono nombre="chevron-forward" tamaño={18} color={COLORES.textoAtenuado} />
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.botonNavegacion}
          onPress={() => navigation.navigate('MisSolicitudes')}
          activeOpacity={0.8}
        >
          <View style={estilos.iconoNavegacion}>
            <Icono nombre="document-text-outline" tamaño={19} color={COLORES.primario} />
          </View>
          <Text style={estilos.textoNavegacion}>Mis Solicitudes</Text>
          <Icono nombre="chevron-forward" tamaño={18} color={COLORES.textoAtenuado} />
        </TouchableOpacity>
      </View>

      {errorSalida ? (
        <Text style={[estilos.textoError, { textAlign: 'center' }]}>
          No se pudo cerrar sesión. Probá de nuevo.
        </Text>
      ) : null}
      <TouchableOpacity style={estilos.botonCerrarSesion} onPress={cerrarSesion} activeOpacity={0.8}>
        <Icono nombre="log-out-outline" tamaño={18} color={COLORES.error} />
        <Text style={estilos.textoCerrarSesion}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={{ height: ESPACIADO.xxl }} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    backgroundColor: COLORES.fondo,
    padding: ESPACIADO.lg,
  },
  seccionAvatar: {
    alignItems: 'center',
    padding: ESPACIADO.xl,
    marginBottom: ESPACIADO.lg,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.xl,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    ...SOMBRAS.sm,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: RADIO.full,
    backgroundColor: COLORES.primario,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ESPACIADO.sm,
    borderWidth: 3,
    borderColor: COLORES.primarioTinte,
    ...SOMBRAS.md,
  },
  textoAvatar: {
    color: '#FFFFFF',
    fontSize: 30,
    fontFamily: FUENTES.display,
    letterSpacing: 1,
  },
  nombreUsuario: {
    fontSize: 24,
    fontFamily: FUENTES.display,
    letterSpacing: 0.6,
    color: COLORES.texto,
    marginBottom: ESPACIADO.xs,
  },
  seccion: {
    marginBottom: ESPACIADO.xl,
  },
  tituloSeccion: {
    fontSize: 13,
    fontFamily: FUENTES.extrabold,
    color: COLORES.textoAtenuado,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: ESPACIADO.md,
  },
  tarjetaInfo: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    overflow: 'hidden',
    ...SOMBRAS.sm,
  },
  filaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ESPACIADO.md,
    gap: ESPACIADO.sm,
  },
  filaInfoEtiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.xs,
  },
  etiquetaInfo: {
    color: COLORES.textoSecundario,
    fontSize: 15,
    fontFamily: FUENTES.bold,
  },
  valorInfo: {
    color: COLORES.texto,
    fontSize: 15,
    fontFamily: FUENTES.medio,
    maxWidth: '60%',
    textAlign: 'right',
  },
  separador: {
    height: 1,
    backgroundColor: COLORES.bordeSuave,
  },
  botonNavegacion: {
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    borderRadius: RADIO.lg,
    padding: ESPACIADO.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.md,
    marginBottom: ESPACIADO.sm,
    ...SOMBRAS.sm,
  },
  iconoNavegacion: {
    width: 40,
    height: 40,
    borderRadius: RADIO.md,
    backgroundColor: COLORES.primarioTinte,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoNavegacion: {
    flex: 1,
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
  },
  textoError: {
    color: COLORES.error,
    fontFamily: FUENTES.bold,
    fontSize: 12,
    marginTop: ESPACIADO.xs,
    marginBottom: ESPACIADO.sm,
  },
  botonCerrarSesion: {
    minHeight: 52,
    borderRadius: RADIO.md,
    borderWidth: 1.5,
    borderColor: COLORES.error + '40',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: COLORES.errorClaro,
  },
  textoCerrarSesion: {
    color: COLORES.error,
    fontFamily: FUENTES.extrabold,
    fontSize: 14,
  },
});
