import { manejador } from "./logica.js";

if (import.meta.main) Deno.serve(manejador);

export { manejador };
