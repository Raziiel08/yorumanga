import React from 'react';
import { useAuth } from '../../context/ContextoAuth';
import PanelOperativo from '../../components/PanelOperativo';

const ACCESOS = [
  { titulo: 'Ver ventas', pantalla: 'Ventas', icono: 'trending-up', descripcion: 'Revisá las ventas registradas.' },
  { titulo: 'Nueva venta', pantalla: 'NuevaVenta', icono: 'add', descripcion: 'Cargá una venta en pocos pasos.' },
  { titulo: 'Clientes', pantalla: 'Clientes', icono: 'person-add', descripcion: 'Encontrá y administrá clientes.' },
  { titulo: 'Productos', pantalla: 'Productos', icono: 'library', descripcion: 'Consultá el catálogo disponible.' },
];

export default function PantallaVendedorInicio({ navigation }) {
  const { user, signOut } = useAuth();

  return (
    <PanelOperativo
      navigation={navigation}
      user={user}
      signOut={signOut}
      rol="Ventas"
      descripcion="Atendé a tus clientes y llevá cada venta con claridad."
      color="#B9673E"
      colorSuave="#F7E8DE"
      accesos={ACCESOS}
    />
  );
}
