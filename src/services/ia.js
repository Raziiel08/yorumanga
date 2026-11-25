import { supabase } from "../config/supabase";

async function requestAI(type, payload) {
  const { data, error } = await supabase.functions.invoke("ai", {
    body: { type, ...payload },
  });
  if (error) {
    const response = error.context;
    if (response && typeof response.clone === "function") {
      let details;
      try {
        details = await response.clone().json();
      } catch {
        throw error;
      }
      if (typeof details?.error === "string") {
        throw new Error(details.error);
      }
    }
    throw error;
  }
  if (typeof data?.content !== "string" || !data.content.trim()) {
    throw new Error(
      "La respuesta de IA está vacía o tiene un formato inválido",
    );
  }
  return data.content.trim();
}

function extractJSON(text, opening, closing) {
  const start = text.indexOf(opening);
  const end = text.lastIndexOf(closing);
  if (start < 0 || end < start)
    throw new Error("La respuesta de IA no contiene JSON válido");
  return JSON.parse(text.slice(start, end + 1));
}

export const aiService = {
  async recommendProducts(preferencias) {
    const text = await requestAI("recommend", {
      preferencias: preferencias.trim(),
    });
    const recomendaciones = extractJSON(text, "[", "]");
    if (!Array.isArray(recomendaciones)) {
      throw new Error("La IA devolvió una lista de recomendaciones inválida");
    }

    return recomendaciones
      .slice(0, 5)
      .filter(
        (recomendacion) =>
          typeof recomendacion?.producto_id === "string" &&
          typeof recomendacion?.titulo === "string" &&
          Number(recomendacion.stock) > 0,
      )
      .map((recomendacion) => ({
        titulo: recomendacion.titulo,
        genero: recomendacion.genero || "",
        imagen: recomendacion.imagen || null,
        stock: Number(recomendacion.stock),
        razon:
          typeof recomendacion.razon === "string"
            ? recomendacion.razon.slice(0, 300)
            : "Coincide con tus preferencias.",
        en_catalogo: true,
        producto_id: recomendacion.producto_id,
      }));
  },

  async generateReport(data) {
    const text = await requestAI("report", { reportData: data });
    const report = extractJSON(text, "{", "}");
    if (
      typeof report.resumen !== "string" ||
      !Array.isArray(report.recomendaciones)
    ) {
      throw new Error("La IA devolvió un informe incompleto");
    }
    return {
      ...data,
      resumen: report.resumen.slice(0, 1200),
      recomendaciones: report.recomendaciones
        .filter((recommendation) => typeof recommendation === "string")
        .slice(0, 5)
        .map((recommendation) => recommendation.slice(0, 300)),
      total_ventas: report.totalVentas ?? data.totalVentas,
      total_pedidos: report.totalPedidos ?? data.totalPedidos,
      productos_mas_vendidos:
        report.productosMasVendidos ?? data.productosMasVendidos,
    };
  },

  async chatAssistant(message) {
    return requestAI("chat", { message: message.trim() });
  },
};
