export function resumirActividad(sales, orders) {
  const ventasCompletadas = sales.filter((sale) => sale.estado === 'completada');
  const pedidosCompletados = orders.filter((order) => order.estado === 'completado');
  const pedidosNoCancelados = orders.filter((order) => order.estado !== 'cancelado');
  const productos = new Map();

  const contarItems = (items = []) => {
    for (const item of items) {
      const productoId = item.producto_id;
      const cantidad = Number(item.cantidad) || 0;
      const producto = productos.get(productoId) || {
        titulo: item.product?.titulo || productoId,
        cantidad: 0,
      };
      producto.cantidad += cantidad;
      productos.set(productoId, producto);
    }
  };

  for (const sale of ventasCompletadas) contarItems(sale.items);
  for (const order of pedidosCompletados) contarItems(order.items);

  return {
    totalVentas: ventasCompletadas.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0)
      + pedidosCompletados.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
    totalPedidos: pedidosNoCancelados.length,
    productosMasVendidos: [...productos.values()]
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5),
    ventasRecientes: ventasCompletadas.length,
  };
}
