import React from "react";
import { useAuth } from "../../context/ContextoAuth";
import PanelOperativo from "../../components/PanelOperativo";

const ACCESOS = [
  {
    titulo: "Stock",
    pantalla: "Stock",
    icono: "cube",
    descripcion: "Controlá existencias y registrá movimientos.",
  },
  {
    titulo: "Productos",
    pantalla: "Productos",
    icono: "library",
    descripcion: "Consultá los productos del catálogo.",
  },
  {
    titulo: "Proveedores",
    pantalla: "Proveedores",
    icono: "car",
    descripcion: "Organizá contactos y entregas.",
  },
];

export default function PantallaDepositoInicio({ navigation }) {
  const { user, signOut } = useAuth();

  return (
    <PanelOperativo
      navigation={navigation}
      user={user}
      signOut={signOut}
      rol="Depósito"
      descripcion="Inventario y productos al día, para que cada manga encuentre su lugar."
      color="#438271"
      colorSuave="#E1EFE9"
      accesos={ACCESOS}
    />
  );
}
