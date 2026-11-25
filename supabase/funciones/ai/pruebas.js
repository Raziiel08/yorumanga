import { manejador } from "./logica.js";

const fetchOriginal = globalThis.fetch;
const clavesEntorno = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GEMINI_API_KEY",
  "GEMINI_MODEL",
];
const entornoOriginal = new Map(
  clavesEntorno.map((clave) => [clave, Deno.env.get(clave)]),
);

const PRODUCTOS = [
  {
    id: "prod-1",
    titulo: "Naruto Vol. 1",
    genero: "Shounen",
    imagen: null,
    stock: 3,
    precio: 1000,
  },
];

const responder = (datos) =>
  new Response(JSON.stringify(datos), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

function configurar() {
  Deno.env.set("SUPABASE_URL", "https://demo.supabase.co");
  Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "service-role-de-prueba");
  Deno.env.set("GEMINI_API_KEY", "clave-de-prueba");
  Deno.env.set("GEMINI_MODEL", "gemini-2.0-flash");

  globalThis.fetch = async (entrada, opciones) => {
    const url = String(entrada);
    if (url.includes("generativelanguage.googleapis.com")) {
      const sistema =
        JSON.parse(opciones.body)?.systemInstruction?.parts?.[0]?.text || "";
      if (sistema.includes("recomendador")) {
        return responder({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify([
                      {
                        producto_id: "prod-1",
                        razon: "Acción y ninjas",
                        stock: 999,
                      },
                      { producto_id: "producto-inventado", razon: "Otro" },
                    ]),
                  },
                ],
              },
            },
          ],
        });
      }
      if (sistema.includes("analista")) {
        return responder({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      resumen: "Resumen de prueba",
                      recomendaciones: ["Reponer Naruto"],
                    }),
                  },
                ],
              },
            },
          ],
        });
      }
      return responder({
        candidates: [
          { content: { parts: [{ text: "Hola, soy el asistente." }] } },
        ],
      });
    }

    if (url.includes("/rest/v1/productos?")) return responder(PRODUCTOS);
    if (url.includes("/rest/v1/ventas?")) {
      return responder([
        { total: 1000, estado: "completada" },
        { total: 500, estado: "pendiente" },
      ]);
    }
    if (url.includes("/rest/v1/pedidos?")) {
      return responder([
        { total: 2000, estado: "completado" },
        { total: 300, estado: "cancelado" },
      ]);
    }
    if (url.includes("/rest/v1/items_venta?")) {
      return responder([
        {
          cantidad: 2,
          productos: { titulo: "Naruto Vol. 1" },
          ventas: { estado: "completada" },
        },
      ]);
    }
    if (url.includes("/rest/v1/items_pedido?")) {
      return responder([
        {
          cantidad: 1,
          productos: { titulo: "Naruto Vol. 1" },
          pedidos: { estado: "completado" },
        },
      ]);
    }
    return responder([]);
  };
}

function restaurar() {
  globalThis.fetch = fetchOriginal;
  for (const [clave, valor] of entornoOriginal) {
    if (valor === undefined) Deno.env.delete(clave);
    else Deno.env.set(clave, valor);
  }
}

const solicitud = (cuerpo) =>
  new Request("https://demo.supabase.co/functions/v1/ai", {
    method: "POST",
    headers: {
      Authorization: "Bearer token-de-prueba",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cuerpo),
  });

Deno.test("preflight CORS", async () => {
  const respuesta = await manejador(
    new Request("https://demo.supabase.co/functions/v1/ai", {
      method: "OPTIONS",
    }),
  );
  if (respuesta.status !== 204) throw new Error("Debe responder 204");
  if (respuesta.headers.get("Access-Control-Allow-Origin") !== "*") {
    throw new Error("Falta CORS");
  }
});

Deno.test("rechaza solicitudes sin sesión", async () => {
  const respuesta = await manejador(
    new Request("https://demo.supabase.co/functions/v1/ai", {
      method: "POST",
      body: JSON.stringify({ type: "chat", message: "hola" }),
    }),
  );
  if (respuesta.status !== 401) throw new Error("Debe responder 401");
});

Deno.test("rechaza un tipo desconocido", async () => {
  configurar();
  try {
    const respuesta = await manejador(solicitud({ type: "otro" }));
    if (respuesta.status !== 400) throw new Error("Debe responder 400");
  } finally {
    restaurar();
  }
});

Deno.test("recomienda solo productos reales con stock de la BD", async () => {
  configurar();
  try {
    const respuesta = await manejador(
      solicitud({ type: "recommend", preferencias: "ninjas" }),
    );
    const datos = await respuesta.json();
    const resultados = JSON.parse(datos.content);
    if (resultados.length !== 1) throw new Error("Debe descartar el ID inventado");
    if (resultados[0].producto_id !== "prod-1") throw new Error("ID incorrecto");
    if (resultados[0].stock !== 3) throw new Error("El stock debe venir de la BD");
    if (resultados[0].titulo !== "Naruto Vol. 1") {
      throw new Error("El título debe venir de la BD");
    }
  } finally {
    restaurar();
  }
});

Deno.test("el informe usa métricas calculadas en servidor", async () => {
  configurar();
  try {
    const respuesta = await manejador(solicitud({ type: "report" }));
    const datos = await respuesta.json();
    const informe = JSON.parse(datos.content);
    if (informe.totalVentas !== 3000) throw new Error("Total de ventas mal");
    if (informe.totalPedidos !== 1) throw new Error("Total de pedidos mal");
    if (informe.productosMasVendidos[0].cantidad !== 3) {
      throw new Error("Más vendidos mal");
    }
    if (informe.resumen !== "Resumen de prueba") throw new Error("Sin resumen");
  } finally {
    restaurar();
  }
});

Deno.test("el chat devuelve texto plano", async () => {
  configurar();
  try {
    const respuesta = await manejador(
      solicitud({ type: "chat", message: "¿qué vendés?" }),
    );
    const datos = await respuesta.json();
    if (datos.content !== "Hola, soy el asistente.") {
      throw new Error("Respuesta de chat incorrecta");
    }
  } finally {
    restaurar();
  }
});
