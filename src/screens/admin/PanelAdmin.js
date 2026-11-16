import React from 'react';
import { useAuth } from '../../context/ContextoAuth';
import PanelOperativo from '../../components/PanelOperativo';

const ACCESOS = [
  { titulo: 'Productos', pantalla: 'Productos', icono: 'library', descripcion: 'Gestioná el catálogo y sus publicaciones.' },
  { titulo: 'Pedidos', pantalla: 'Pedidos', icono: 'bag-handle', descripcion: 'Revisá y procesá los pedidos de clientes.' },
  { titulo: 'Solicitudes', pantalla: 'Solicitudes', icono: 'mail', descripcion: 'Respondé pedidos de mangas fuera de catálogo.' },
  { titulo: 'Usuarios', pantalla: 'Usuarios', icono: 'people', descripcion: 'Administrá las cuentas y sus roles.' },
  { titulo: 'Ventas', pantalla: 'Ventas', icono: 'trending-up', descripcion: 'Consultá el historial de ventas.' },
  { titulo: 'Nueva venta', pantalla: 'NuevaVenta', icono: 'add', descripcion: 'Registrá una venta presencial.' },
  { titulo: 'Clientes', pantalla: 'Clientes', icono: 'person-add', descripcion: 'Buscá y organizá la base de clientes.' },
  { titulo: 'Stock', pantalla: 'Stock', icono: 'cube', descripcion: 'Controlá existencias y movimientos.' },
  { titulo: 'Proveedores', pantalla: 'Proveedores', icono: 'car', descripcion: 'Mantené los datos de proveedores.' },
  { titulo: 'Reportes e IA', pantalla: 'Reportes', icono: 'sparkles', descripcion: 'Explorá resultados y análisis del negocio.' },
];

export default function PantallaAdminInicio({ navigation }) {
  const { user, signOut } = useAuth();

  return (
    <PanelOperativo
      navigation={navigation}
      user={user}
      signOut={signOut}
      rol="Administración"
      descripcion="Todo el movimiento de la tienda, organizado en un solo lugar."
      color="#684563"
      colorSuave="#F1E8EF"
      accesos={ACCESOS}
    />
  );
}
