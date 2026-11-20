const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatearMoneda(importe) {
  return formatoMoneda.format(Number(importe));
}
