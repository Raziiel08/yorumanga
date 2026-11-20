export const DOMINIOS_POPULARES_PERMITIDOS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "live.com",
  "icloud.com",
  "hotmail.com.ar",
  "outlook.com.ar",
  "yahoo.com.ar",
];

export function correoValido(email) {
  if (!email || typeof email !== "string") return false;
  const correoLimpio = email.trim().toLowerCase();

  const partes = correoLimpio.split("@");
  if (partes.length !== 2) return false;
  const usuario = partes[0].trim();
  const dominio = partes[1].trim();

  // Validar caracteres básicos del usuario antes del @
  if (!usuario || !/^[a-zA-Z0-9._%+-]+$/.test(usuario)) {
    return false;
  }

  // El dominio DEBE estar en la lista de dominios populares permitidos
  return DOMINIOS_POPULARES_PERMITIDOS.includes(dominio);
}

export function validarErrorCorreo(email) {
  if (!email || !String(email).trim()) {
    return "Tenés que ingresar un correo electrónico.";
  }
  const correoLimpio = String(email).trim().toLowerCase();

  if (!correoLimpio.includes("@")) {
    return "El correo debe contener '@' (ej: usuario@gmail.com).";
  }

  const partes = correoLimpio.split("@");
  if (partes.length !== 2 || !partes[0].trim()) {
    return "Ingresá el nombre de usuario antes del '@'.";
  }
  if (!partes[1].trim()) {
    return "Ingresá el dominio después del '@' (ej: @gmail.com).";
  }

  const dominio = partes[1].trim();

  // Si escribió gmail sin .com o mal
  if (dominio === "gmail" || (dominio.startsWith("gmail") && dominio !== "gmail.com")) {
    return "El correo de Gmail debe ser '@gmail.com'.";
  }
  if (dominio === "hotmail" || (dominio.startsWith("hotmail") && !["hotmail.com", "hotmail.com.ar"].includes(dominio))) {
    return "El correo de Hotmail debe ser '@hotmail.com'.";
  }
  if (dominio === "outlook" || (dominio.startsWith("outlook") && !["outlook.com", "outlook.com.ar"].includes(dominio))) {
    return "El correo de Outlook debe ser '@outlook.com'.";
  }
  if (dominio === "yahoo" || (dominio.startsWith("yahoo") && !["yahoo.com", "yahoo.com.ar"].includes(dominio))) {
    return "El correo de Yahoo debe ser '@yahoo.com'.";
  }

  if (!dominio.endsWith(".com") && !dominio.endsWith(".com.ar")) {
    return "El correo debe terminar en '.com' (ej: @gmail.com, @hotmail.com, @outlook.com).";
  }

  if (!DOMINIOS_POPULARES_PERMITIDOS.includes(dominio)) {
    return "Solo se permiten dominios de correo populares (@gmail.com, @hotmail.com, @outlook.com, @yahoo.com, @live.com, @icloud.com).";
  }

  return null;
}

export function validarCamposObligatorios(campos) {
  const campoVacio = campos.find(({ valor }) => !String(valor ?? "").trim());
  return campoVacio
    ? `Tenés que completar el campo ${campoVacio.nombre}.`
    : null;
}

export function validarContrasena(password) {
  if (!password || password.length < 6)
    return "La contraseña debe tener al menos 6 caracteres.";
  return null;
}
