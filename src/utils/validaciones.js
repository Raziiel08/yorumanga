export function correoValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function validarCamposObligatorios(campos) {
  const campoVacio = campos.find(({ valor }) => !String(valor ?? '').trim());
  return campoVacio ? `Tenés que completar el campo ${campoVacio.nombre}.` : null;
}

export function validarContrasena(password) {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe tener al menos una mayúscula';
  if (!/[0-9]/.test(password)) return 'La contraseña debe tener al menos un número';
  return null;
}
