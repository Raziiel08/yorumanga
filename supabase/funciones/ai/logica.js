const cabecerasCors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function respuestaJson(cuerpo, estado = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { ...cabecerasCors, "Content-Type": "application/json" },
  });
}

function respuestaError(mensaje, estado = 400) {
  return respuestaJson({ error: mensaje }, estado);
}

function leerEntorno(nombre, valorPorDefecto = "") {
  return Deno.env.get(nombre) || valorPorDefecto;
}

async function consultarRest(ruta, opciones = {}) {
  const url = leerEntorno("SUPABASE_URL");
  const clave = leerEntorno("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !clave) {
    throw new Error(
      "Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en la Edge Function",
    );
  }
  const respuesta = await fetch(`${url}/rest/v1/${ruta}`, {
    ...opciones,
    headers: {
      apikey: clave,
      Authorization: `Bearer ${clave}`,
      "Content-Type": "application/json",
      ...(opciones.headers || {}),
    },
  });
  if (!respuesta.ok) {
    const detalle = (await respuesta.text()).slice(0, 300);
    throw new Error(`Error de base de datos (${respuesta.status}): ${detalle}`);
  }
  return respuesta.json();
}

async function llamarGemini(sistema, mensaje, forzarJson) {
  const clave = leerEntorno("GEMINI_API_KEY");
  if (!clave) {
    throw new Error(
      "Falta GEMINI_API_KEY. Configurala con: supabase secrets set GEMINI_API_KEY=tu_clave",
    );
  }
  const modelo = leerEntorno("GEMINI_MODEL", "gemini-2.0-flash");
  const configuracionGeneracion = {
    temperature: 0.6,
    maxOutputTokens: forzarJson ? 1024 : 512,
  };
  if (forzarJson) configuracionGeneracion.responseMimeType = "application/json";

  const respuesta = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent?key=${encodeURIComponent(clave)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sistema }] },
        contents: [{ role: "user", parts: [{ text: mensaje }] }],
        generationConfig: configuracionGeneracion,
      }),
    },
  );

  const datosGemini = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const detalle =
      datosGemini?.error?.message || JSON.stringify(datosGemini).slice(0, 300);
    throw new Error(`Gemini respondió ${respuesta.status}: ${detalle}`);
  }
  if (datosGemini?.promptFeedback?.blockReason) {
    throw new Error("La consulta fue bloqueada por el proveedor de IA.");
  }
  const texto = (datosGemini?.candidates?.[0]?.content?.parts || [])
    .map((parte) => parte.text || "")
    .join("")
    .trim();
  if (!texto) throw new Error("La respuesta de IA vino vacía.");
  return texto;
}

function extraerJson(texto, forma) {
  const limpio = texto.replace(/```(?:json)?/gi, "").trim();
  const apertura = forma === "arreglo" ? "[" : "{";
  const cierre = forma === "arreglo" ? "]" : "}";
  const inicio = limpio.indexOf(apertura);
  const fin = limpio.lastIndexOf(cierre);
  if (inicio < 0 || fin <= inicio) {
    throw new Error("La IA no devolvió JSON válido.");
  }
  return JSON.parse(limpio.slice(inicio, fin + 1));
}

async function recomendar(preferencias) {
  if (!preferencias) {
    return respuestaError("Contanos qué te gusta leer para recomendarte.");
  }

  const catalogo = await consultarRest(
    "productos?select=id,titulo,genero,imagen,stock,precio&activo=eq.true&stock=gt.0&order=creado_en.desc&limit=40",
  );
  if (catalogo.length === 0) {
    return respuestaJson({ content: "[]" });
  }

  const lista = catalogo
    .map(
      (producto) =>
        `- ${producto.id} | ${producto.titulo} | ${producto.genero || "sin género"} | stock ${producto.stock} | $${producto.precio}`,
    )
    .join("\n");
  const sistema =
    "Sos el recomendador de YORUMANGA, una tienda de mangas. Respondé SOLO un array JSON, sin texto ni markdown. " +
    'Cada elemento: {"producto_id": "uuid", "razon": "frase breve en español"}. ' +
    "Elegí como máximo 5 productos de la lista, usando exclusivamente IDs de la lista. Nunca inventes títulos, stock ni precios.";
  const mensaje = `Preferencias del cliente: ${preferencias}\n\nCatálogo disponible:\n${lista}\n\nDevolvé el array JSON con tus recomendaciones.`;

  const texto = await llamarGemini(sistema, mensaje, true);
  let sugerencias;
  try {
    sugerencias = extraerJson(texto, "arreglo");
  } catch {
    return respuestaError("La IA devolvió un formato inesperado. Reintentá.", 502);
  }
  if (!Array.isArray(sugerencias)) {
    return respuestaError("La IA devolvió un formato inesperado. Reintentá.", 502);
  }

  const porId = new Map(catalogo.map((producto) => [String(producto.id), producto]));
  const resultados = [];
  for (const sugerencia of sugerencias.slice(0, 10)) {
    const producto = porId.get(String(sugerencia?.producto_id || ""));
    if (!producto || Number(producto.stock) <= 0) continue;
    resultados.push({
      producto_id: producto.id,
      titulo: producto.titulo,
      genero: producto.genero || "",
      imagen: producto.imagen || null,
      stock: Number(producto.stock),
      razon:
        typeof sugerencia?.razon === "string" && sugerencia.razon.trim()
          ? sugerencia.razon.trim().slice(0, 300)
          : "Coincide con tus preferencias.",
      en_catalogo: true,
    });
    if (resultados.length === 5) break;
  }

  return respuestaJson({ content: JSON.stringify(resultados) });
}

async function generarInforme() {
  const [ventas, pedidos, itemsVenta, itemsPedido] = await Promise.all([
    consultarRest("ventas?select=total,estado"),
    consultarRest("pedidos?select=total,estado"),
    consultarRest(
      "items_venta?select=cantidad,productos(titulo),ventas!inner(estado)&ventas.estado=eq.completada",
    ),
    consultarRest(
      "items_pedido?select=cantidad,productos(titulo),pedidos!inner(estado)&pedidos.estado=eq.completado",
    ),
  ]);

  const total = (filas, estados) =>
    filas
      .filter((fila) => estados.includes(fila.estado))
      .reduce((suma, fila) => suma + (Number(fila.total) || 0), 0);

  const unidades = new Map();
  const contar = (articulos) => {
    for (const articulo of articulos || []) {
      const titulo = articulo.productos?.titulo || "Producto sin nombre";
      unidades.set(
        titulo,
        (unidades.get(titulo) || 0) + (Number(articulo.cantidad) || 0),
      );
    }
  };
  contar(itemsVenta);
  contar(itemsPedido);

  const metricas = {
    totalVentas:
      total(ventas, ["completada"]) + total(pedidos, ["completado"]),
    totalPedidos: pedidos.filter((pedido) => pedido.estado !== "cancelado").length,
    productosMasVendidos: [...unidades.entries()]
      .map(([titulo, cantidad]) => ({ titulo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5),
    ventasRecientes: ventas.filter((venta) => venta.estado === "completada").length,
  };

  const sistema =
    "Sos el analista de YORUMANGA. Respondé SOLO un objeto JSON: " +
    '{"resumen":"texto en español de hasta 4 frases","recomendaciones":["frase 1","frase 2","frase 3"]}. ' +
    "Usá únicamente los números que te dan. No inventes datos. Sugerencias concretas de reposición de stock.";
  const mensaje = `Métricas reales del negocio:\n${JSON.stringify(metricas, null, 2)}`;

  const texto = await llamarGemini(sistema, mensaje, true);
  let datosInforme;
  try {
    datosInforme = extraerJson(texto, "objeto");
  } catch {
    return respuestaError("La IA devolvió un informe con formato inválido.", 502);
  }
  const resumen =
    typeof datosInforme?.resumen === "string"
      ? datosInforme.resumen.slice(0, 1200)
      : "";
  const recomendaciones = Array.isArray(datosInforme?.recomendaciones)
    ? datosInforme.recomendaciones
        .filter((recomendacion) => typeof recomendacion === "string" && recomendacion.trim())
        .slice(0, 5)
        .map((recomendacion) => recomendacion.slice(0, 300))
    : [];
  if (!resumen) {
    return respuestaError("La IA devolvió un informe incompleto.", 502);
  }

  return respuestaJson({
    content: JSON.stringify({ resumen, recomendaciones, ...metricas }),
  });
}

async function responderChat(mensaje) {
  if (!mensaje) return respuestaError("Escribí una consulta para el asistente.");
  const sistema =
    "Sos el asistente de YORUMANGA, tienda de mangas físicos. Respondé en español, en menos de 120 palabras. " +
    "Ayudá con géneros, autores, pedidos, stock y sugerencias de lectura. Si no tenés un dato, decí que no lo tenés: nunca inventes stock, precios ni promociones.";
  const texto = await llamarGemini(sistema, mensaje, false);
  return respuestaJson({ content: texto });
}

export async function manejador(solicitud) {
  if (solicitud.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cabecerasCors });
  }
  if (solicitud.method !== "POST") {
    return respuestaError("Método no permitido.", 405);
  }
  if (!solicitud.headers.get("Authorization")) {
    return respuestaError("Se requiere una sesión válida.", 401);
  }

  let cuerpo;
  try {
    cuerpo = await solicitud.json();
  } catch {
    return respuestaError("El cuerpo de la solicitud no es JSON válido.");
  }

  const tipo = String(cuerpo?.type || "").toLowerCase();
  try {
    if (tipo === "recommend") {
      return await recomendar(String(cuerpo?.preferencias || "").trim().slice(0, 300));
    }
    if (tipo === "report") return await generarInforme();
    if (tipo === "chat") {
      return await responderChat(String(cuerpo?.message || "").trim().slice(0, 1000));
    }
    return respuestaError("Tipo de solicitud no soportado.", 400);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno de la IA.";
    return respuestaError(mensaje, 500);
  }
}
