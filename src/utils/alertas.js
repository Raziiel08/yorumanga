import { Alert as NativeAlert, Platform } from "react-native";

function mostrarAlertaWeb(titulo, mensaje, botones) {
  const texto = [titulo, mensaje].filter(Boolean).join("\n\n");
  const opciones = Array.isArray(botones) ? botones : [];

  if (opciones.length === 0) {
    globalThis.alert(texto);
    return;
  }

  if (opciones.length === 1) {
    globalThis.alert(texto);
    opciones[0].onPress?.();
    return;
  }

  const cancelar = opciones.find((boton) => boton.style === "cancel");
  const acciones = opciones.filter((boton) => boton !== cancelar);
  if (acciones.length === 1) {
    if (globalThis.confirm(texto)) acciones[0].onPress?.();
    else cancelar?.onPress?.();
    return;
  }

  const lista = acciones
    .map((boton, indice) => `${indice + 1}. ${boton.text}`)
    .join("\n");
  const respuesta = globalThis.prompt(
    `${texto}\n\n${lista}\n\nIngresá el número de una opción:`,
  );
  if (respuesta === null) {
    cancelar?.onPress?.();
    return;
  }

  const opcion = acciones[Number(respuesta) - 1];
  if (opcion) opcion.onPress?.();
  else globalThis.alert("Opción inválida. No se realizó ningún cambio.");
}

export const Alert = {
  alert(titulo, mensaje, botones) {
    if (Platform.OS === "web") {
      mostrarAlertaWeb(titulo, mensaje, botones);
      return;
    }

    NativeAlert.alert(titulo, mensaje, botones);
  },
};
