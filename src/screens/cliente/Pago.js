import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import Icono from "../../components/Icono";
import TarjetaCreditoInteractiva, {
  detectarMarcaTarjeta,
  formatearNumeroTarjeta,
  formatearExpiracion,
} from "../../components/TarjetaCreditoInteractiva";
import { useCart } from "../../context/ContextoCarrito";
import { useAuth } from "../../context/ContextoAuth";
import { useResponsive } from "../../hooks/useResponsivo";
import { ordersService } from "../../services/pedidos";
import {
  COLORES,
  FUENTES,
  RADIO,
  SOMBRAS,
} from "../../constants/theme";
import { formatearMoneda } from "../../utils/moneda";

const TARJETAS_DE_PRUEBA = [
  {
    tipo: "crédito",
    numero: "4532 8921 4455 8892",
    nombre: "USUARIO DE PRUEBA",
    expiracion: "11/28",
    cvv: "482",
    dni: "00000001",
    cuotas: 3,
    banco: "Visa Crédito (Banco Galicia)",
  },
  {
    tipo: "débito",
    numero: "5421 9832 1092 3411",
    nombre: "CLIENTE DEMO",
    expiracion: "08/29",
    cvv: "731",
    dni: "00000002",
    cuotas: 1,
    banco: "Mastercard Débito (Banco Nación)",
  },
];

export default function PantallaPago({ navigation }) {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const { esEscritorio, anchoMaxContenido } = useResponsive();

  const [tipoTarjeta, setTipoTarjeta] = useState("crédito");
  const [numero, setNumero] = useState("");
  const [nombre, setNombre] = useState(user?.user_metadata?.nombre || "");
  const [expiracion, setExpiracion] = useState("");
  const [cvv, setCvv] = useState("");
  const [dni, setDni] = useState("");
  const [cuotas, setCuotas] = useState(1);
  const [volteada, setVolteada] = useState(false);

  const [procesando, setProcesando] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const opcionesCuotas = [
    { cuotas: 1, texto: `1 pago de ${formatearMoneda(total)} (Sin interés)` },
    {
      cuotas: 3,
      texto: `3 cuotas de ${formatearMoneda(total / 3)} (Sin interés)`,
    },
    {
      cuotas: 6,
      texto: `6 cuotas de ${formatearMoneda(total / 6)} (Sin interés)`,
    },
  ];

  const manejarCambioNumero = (texto) => {
    const marca = detectarMarcaTarjeta(texto);
    const formateado = formatearNumeroTarjeta(texto, marca);
    setNumero(formateado);
    setErrorValidacion("");
  };

  const manejarCambioExpiracion = (texto) => {
    const formateado = formatearExpiracion(texto);
    setExpiracion(formateado);
    setErrorValidacion("");
  };

  const cargarTarjetaDemo = (tarjeta) => {
    setTipoTarjeta(tarjeta.tipo);
    setNumero(tarjeta.numero);
    setNombre(tarjeta.nombre);
    setExpiracion(tarjeta.expiracion);
    setCvv(tarjeta.cvv);
    setDni(tarjeta.dni);
    setCuotas(tarjeta.cuotas);
    setVolteada(false);
    setErrorValidacion("");
  };

  const validarCampos = () => {
    const digitos = numero.replace(/\D/g, "");
    if (digitos.length < 15) {
      return "Ingresá un número de tarjeta válido (15 o 16 dígitos).";
    }
    if (!nombre.trim() || nombre.trim().length < 3) {
      return "Ingresá el nombre y apellido completo que figura en la tarjeta.";
    }
    if (!/^\d{2}\/\d{2}$/.test(expiracion)) {
      return "Ingresá la fecha de vencimiento en formato MM/AA (ej. 11/28).";
    }
    const [mes, anio] = expiracion.split("/").map((v) => parseInt(v, 10));
    if (mes < 1 || mes > 12) {
      return "El mes de vencimiento debe estar entre 01 y 12.";
    }
    if (anio < 24) {
      return "La tarjeta ingresada se encuentra vencida.";
    }
    if (cvv.replace(/\D/g, "").length < 3) {
      return "Ingresá el código de seguridad CVV (3 o 4 dígitos al dorso).";
    }
    if (dni.replace(/\D/g, "").length < 7) {
      return "Ingresá el DNI del titular de la tarjeta (mínimo 7 dígitos).";
    }
    return null;
  };

  const ejecutarPago = async () => {
    if (items.length === 0) {
      setErrorValidacion("El carrito está vacío. Agregá productos antes de pagar.");
      return;
    }

    const error = validarCampos();
    if (error) {
      setErrorValidacion(error);
      return;
    }

    setProcesando(true);
    setErrorValidacion("");

    try {
      await new Promise((resolver) => setTimeout(resolver, 1500));

      const pedidoId = await ordersService.createOrder(items);

      const marca = detectarMarcaTarjeta(numero).toUpperCase();
      const ultimos4 = numero.replace(/\s+/g, "").slice(-4);
      const codigoOperacion = `YORU-${Math.floor(100000 + Math.random() * 900000)}`;

      setComprobante({
        pedidoId,
        codigoOperacion,
        marca,
        tipoTarjeta,
        ultimos4,
        titular: nombre.toUpperCase(),
        cuotas: tipoTarjeta === "crédito" ? cuotas : 1,
        total,
        fecha: new Date().toLocaleString("es-AR", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      });

      clear();
    } catch (e) {
      setErrorValidacion(e.message || "Error al registrar el pedido.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <ScrollView
      style={estilos.pantalla}
      contentContainerStyle={estilos.contenidoScroll}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[estilos.contenedor, { maxWidth: Math.min(anchoMaxContenido, 680) }]}>
        
        <View style={estilos.cabeceraSeguridad}>
          <View style={estilos.insigniaSimulacion}>
            <Icono nombre="information-circle-outline" tamaño={16} color={COLORES.info} />
            <Text style={estilos.textoSimulacion}>Checkout de demostración · sin cobro real</Text>
          </View>
          <Text style={estilos.subtituloSeguridad}>
            Simulación para entrega académica: no se envían datos a ningún banco ni se cifra información localmente
          </Text>
        </View>

        <View style={estilos.tarjetaResumen}>
          <TouchableOpacity
            style={estilos.cabeceraResumen}
            onPress={() => setMostrarResumen(!mostrarResumen)}
            activeOpacity={0.8}
          >
            <View style={estilos.filaResumenIcono}>
              <Icono nombre="cart-outline" tamaño={20} color={COLORES.primario} />
              <Text style={estilos.tituloResumen}>
                Total a pagar ({items.length} ítem{items.length !== 1 ? "s" : ""}):{" "}
                <Text style={estilos.montoDestacado}>{formatearMoneda(total)}</Text>
              </Text>
            </View>
            <Icono
              nombre={mostrarResumen ? "chevron-up" : "chevron-down"}
              tamaño={18}
              color={COLORES.textoSecundario}
            />
          </TouchableOpacity>

          {mostrarResumen && (
            <View style={estilos.cuerpoResumen}>
              {items.map((item) => (
                <View key={item.product.id} style={estilos.filaItemResumen}>
                  <Text style={estilos.nombreItemResumen} numberOfLines={1}>
                    {item.cantidad}x {item.product.titulo}
                  </Text>
                  <Text style={estilos.precioItemResumen}>
                    {formatearMoneda(item.product.precio * item.cantidad)}
                  </Text>
                </View>
              ))}
              <View style={estilos.separadorResumen} />
              <View style={estilos.filaEnvio}>
                <Text style={estilos.textoEnvio}>Envío digital / Retiro:</Text>
                <Text style={estilos.textoEnvioGratis}>¡GRATIS!</Text>
              </View>
            </View>
          )}
        </View>

        <View style={estilos.seccionDemos}>
          <Text style={estilos.etiquetaDemos}>⚡ Tarjetas de prueba para evaluación:</Text>
          <View style={estilos.filaBotonesDemo}>
            {TARJETAS_DE_PRUEBA.map((t, idx) => (
              <TouchableOpacity
                key={idx}
                style={estilos.botonDemo}
                onPress={() => cargarTarjetaDemo(t)}
                activeOpacity={0.8}
              >
                <Icono nombre="card" tamaño={14} color={COLORES.primario} />
                <Text style={estilos.textoBotonDemo}>
                  {t.tipo === "crédito" ? "Visa Crédito (3 cuotas)" : "Mastercard Débito"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TarjetaCreditoInteractiva
          numero={numero}
          nombre={nombre}
          expiracion={expiracion}
          cvv={cvv}
          volteada={volteada}
          onAlternarGiro={() => setVolteada(!volteada)}
          tipoTarjeta={tipoTarjeta}
        />

        <View style={estilos.selectorTipo}>
          <TouchableOpacity
            style={[
              estilos.opcionTipo,
              tipoTarjeta === "crédito" && estilos.opcionTipoActiva,
            ]}
            onPress={() => {
              setTipoTarjeta("crédito");
              setErrorValidacion("");
            }}
          >
            <Icono
              nombre="card-outline"
              tamaño={16}
              color={tipoTarjeta === "crédito" ? "#FFFFFF" : COLORES.texto}
            />
            <Text
              style={[
                estilos.textoOpcionTipo,
                tipoTarjeta === "crédito" && estilos.textoOpcionTipoActiva,
              ]}
            >
              Tarjeta de Crédito
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              estilos.opcionTipo,
              tipoTarjeta === "débito" && estilos.opcionTipoActiva,
            ]}
            onPress={() => {
              setTipoTarjeta("débito");
              setCuotas(1);
              setErrorValidacion("");
            }}
          >
            <Icono
              nombre="wallet-outline"
              tamaño={16}
              color={tipoTarjeta === "débito" ? "#FFFFFF" : COLORES.texto}
            />
            <Text
              style={[
                estilos.textoOpcionTipo,
                tipoTarjeta === "débito" && estilos.textoOpcionTipoActiva,
              ]}
            >
              Tarjeta de Débito
            </Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.formulario}>
          <View style={estilos.campo}>
            <Text style={estilos.etiqueta}>Número de la tarjeta</Text>
            <View style={estilos.contenedorInput}>
              <Icono nombre="card-outline" tamaño={20} color={COLORES.textoSecundario} />
              <TextInput
                style={estilos.input}
                placeholder="4532 0000 0000 0000"
                placeholderTextColor={COLORES.textoSilenciado}
                value={numero}
                onChangeText={manejarCambioNumero}
                keyboardType="numeric"
                maxLength={19}
                onFocus={() => setVolteada(false)}
              />
            </View>
          </View>

          <View style={estilos.campo}>
            <Text style={estilos.etiqueta}>Nombre y apellido del titular</Text>
            <View style={estilos.contenedorInput}>
              <Icono nombre="person-outline" tamaño={20} color={COLORES.textoSecundario} />
              <TextInput
                style={estilos.input}
                placeholder="Como figura en el plástico"
                placeholderTextColor={COLORES.textoSilenciado}
                value={nombre}
                onChangeText={(t) => {
                  setNombre(t.toUpperCase());
                  setErrorValidacion("");
                }}
                autoCapitalize="characters"
                onFocus={() => setVolteada(false)}
              />
            </View>
          </View>

          <View style={estilos.filaDoble}>
            <View style={[estilos.campo, { flex: 1 }]}>
              <Text style={estilos.etiqueta}>Vencimiento</Text>
              <View style={estilos.contenedorInput}>
                <Icono nombre="calendar-outline" tamaño={18} color={COLORES.textoSecundario} />
                <TextInput
                  style={estilos.input}
                  placeholder="MM/AA"
                  placeholderTextColor={COLORES.textoSilenciado}
                  value={expiracion}
                  onChangeText={manejarCambioExpiracion}
                  keyboardType="numeric"
                  maxLength={5}
                  onFocus={() => setVolteada(false)}
                />
              </View>
            </View>

            <View style={[estilos.campo, { flex: 1 }]}>
              <View style={estilos.filaEtiquetaCvv}>
                <Text style={estilos.etiqueta}>Código CVV</Text>
                <Text style={estilos.ayudaCvv}>(al dorso)</Text>
              </View>
              <View style={estilos.contenedorInput}>
                <Icono nombre="shield-outline" tamaño={18} color={COLORES.textoSecundario} />
                <TextInput
                  style={estilos.input}
                  placeholder="123"
                  placeholderTextColor={COLORES.textoSilenciado}
                  value={cvv}
                  onChangeText={(t) => {
                    setCvv(t.replace(/\D/g, "").slice(0, 4));
                    setErrorValidacion("");
                  }}
                  keyboardType="numeric"
                  maxLength={4}
                  onFocus={() => setVolteada(true)}
                  onBlur={() => setVolteada(false)}
                />
              </View>
            </View>
          </View>

          <View style={estilos.campo}>
            <Text style={estilos.etiqueta}>DNI del titular</Text>
            <View style={estilos.contenedorInput}>
              <Icono nombre="id-card-outline" tamaño={20} color={COLORES.textoSecundario} />
              <TextInput
                style={estilos.input}
                placeholder="Número de documento sin puntos"
                placeholderTextColor={COLORES.textoSilenciado}
                value={dni}
                onChangeText={(t) => {
                  setDni(t.replace(/\D/g, "").slice(0, 9));
                  setErrorValidacion("");
                }}
                keyboardType="numeric"
                maxLength={9}
                onFocus={() => setVolteada(false)}
              />
            </View>
          </View>

          {tipoTarjeta === "crédito" && (
            <View style={estilos.campo}>
              <Text style={estilos.etiqueta}>Plan de cuotas</Text>
              <View style={estilos.contenedorCuotas}>
                {opcionesCuotas.map((op) => (
                  <TouchableOpacity
                    key={op.cuotas}
                    style={[
                      estilos.itemCuota,
                      cuotas === op.cuotas && estilos.itemCuotaActivo,
                    ]}
                    onPress={() => setCuotas(op.cuotas)}
                    activeOpacity={0.8}
                  >
                    <Icono
                      nombre={cuotas === op.cuotas ? "radio-button-on" : "radio-button-off"}
                      tamaño={18}
                      color={cuotas === op.cuotas ? COLORES.primario : COLORES.textoSecundario}
                    />
                    <Text
                      style={[
                        estilos.textoCuota,
                        cuotas === op.cuotas && estilos.textoCuotaActivo,
                      ]}
                    >
                      {op.texto}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {errorValidacion ? (
            <View style={estilos.avisoError}>
              <Icono nombre="alert-circle" tamaño={18} color={COLORES.error} />
              <Text style={estilos.textoError}>{errorValidacion}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              estilos.botonPagar,
              (procesando || items.length === 0) && estilos.botonDeshabilitado,
            ]}
            onPress={ejecutarPago}
            disabled={procesando || items.length === 0}
            activeOpacity={0.85}
          >
            {procesando ? (
              <View style={estilos.filaProcesando}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={estilos.textoBotonPagar}>
                  Registrando pedido (simulación)...
                </Text>
              </View>
            ) : (
              <View style={estilos.filaProcesando}>
                <Icono nombre="checkmark-done-circle" tamaño={22} color="#FFFFFF" />
                <Text style={estilos.textoBotonPagar}>
                  Pagar {formatearMoneda(total)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={estilos.leyendaPie}>
            🔒 Al pagar aceptás los términos y condiciones de Yorumanga. La transacción está cifrada.
          </Text>
        </View>
      </View>

      <Modal
        visible={!!comprobante}
        transparent={true}
        animationType="fade"
      >
        <View style={estilos.fondoModal}>
          <View style={estilos.tarjetaComprobante}>
            <View style={estilos.iconoExito}>
              <Icono nombre="checkmark" tamaño={36} color="#FFFFFF" />
            </View>

            <Text style={estilos.tituloExito}>¡Pago Aprobado!</Text>
            <Text style={estilos.subtituloExito}>
              Tu pedido ha sido procesado con éxito y registrado en el sistema.
            </Text>

            <View style={estilos.ticket}>
              <View style={estilos.filaTicket}>
                <Text style={estilos.etiquetaTicket}>Operación:</Text>
                <Text style={estilos.valorTicketDestacado}>{comprobante?.codigoOperacion}</Text>
              </View>
              <View style={estilos.filaTicket}>
                <Text style={estilos.etiquetaTicket}>Medio de pago:</Text>
                <Text style={estilos.valorTicket}>
                  {comprobante?.marca} terminada en **** {comprobante?.ultimos4}
                </Text>
              </View>
              <View style={estilos.filaTicket}>
                <Text style={estilos.etiquetaTicket}>Plan:</Text>
                <Text style={estilos.valorTicket}>
                  {comprobante?.cuotas === 1
                    ? "1 pago (Débito/Contado)"
                    : `${comprobante?.cuotas} cuotas sin interés`}
                </Text>
              </View>
              <View style={estilos.filaTicket}>
                <Text style={estilos.etiquetaTicket}>Titular:</Text>
                <Text style={estilos.valorTicket}>{comprobante?.titular}</Text>
              </View>
              <View style={estilos.filaTicket}>
                <Text style={estilos.etiquetaTicket}>Fecha y hora:</Text>
                <Text style={estilos.valorTicket}>{comprobante?.fecha}</Text>
              </View>
              <View style={estilos.separadorTicket} />
              <View style={estilos.filaTicket}>
                <Text style={estilos.totalTicketEtiqueta}>Total abonado:</Text>
                <Text style={estilos.totalTicketValor}>
                  {formatearMoneda(comprobante?.total || 0)}
                </Text>
              </View>
            </View>

            <View style={estilos.accionesComprobante}>
              <TouchableOpacity
                style={estilos.botonMisPedidos}
                onPress={() => {
                  setComprobante(null);
                  navigation.navigate("MisPedidos");
                }}
                activeOpacity={0.85}
              >
                <Icono nombre="receipt-outline" tamaño={18} color="#FFFFFF" />
                <Text style={estilos.textoBotonMisPedidos}>Ver en Mis Pedidos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={estilos.botonSeguirComprando}
                onPress={() => {
                  setComprobante(null);
                  navigation.navigate("Catálogo");
                }}
                activeOpacity={0.8}
              >
                <Text style={estilos.textoBotonSeguirComprando}>Volver al catálogo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenidoScroll: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  contenedor: {
    width: "100%",
  },
  cabeceraSeguridad: {
    alignItems: "center",
    marginBottom: 12,
  },
  insigniaSimulacion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORES.infoClaro,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIO.completo,
  },
  textoSimulacion: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORES.info,
    fontFamily: FUENTES.bold,
  },
  subtituloSeguridad: {
    fontSize: 12,
    color: COLORES.textoSecundario,
    marginTop: 4,
  },
  tarjetaResumen: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    marginBottom: 14,
    overflow: "hidden",
    ...SOMBRAS.suave,
  },
  cabeceraResumen: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  filaResumenIcono: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tituloResumen: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORES.texto,
    fontFamily: FUENTES.medio,
  },
  montoDestacado: {
    color: COLORES.acento,
    fontWeight: "800",
  },
  cuerpoResumen: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: COLORES.bordeClaro,
  },
  filaItemResumen: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  nombreItemResumen: {
    fontSize: 13,
    color: COLORES.texto,
    flex: 1,
    marginRight: 10,
  },
  precioItemResumen: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORES.texto,
  },
  separadorResumen: {
    height: 1,
    backgroundColor: COLORES.bordeClaro,
    marginVertical: 8,
  },
  filaEnvio: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoEnvio: {
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
  textoEnvioGratis: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORES.exito,
  },
  seccionDemos: {
    marginBottom: 10,
  },
  etiquetaDemos: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORES.textoSecundario,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  filaBotonesDemo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  botonDemo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIO.sm,
    backgroundColor: COLORES.primarioTint,
    borderWidth: 1,
    borderColor: "rgba(104, 69, 99, 0.2)",
  },
  textoBotonDemo: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORES.primario,
    fontFamily: FUENTES.bold,
  },
  selectorTipo: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 12,
  },
  opcionTipo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  opcionTipoActiva: {
    backgroundColor: COLORES.primario,
    borderColor: COLORES.primario,
  },
  textoOpcionTipo: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORES.texto,
    fontFamily: FUENTES.bold,
  },
  textoOpcionTipoActiva: {
    color: "#FFFFFF",
  },
  formulario: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORES.borde,
    ...SOMBRAS.suave,
  },
  campo: {
    marginBottom: 14,
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORES.texto,
    marginBottom: 6,
    fontFamily: FUENTES.bold,
  },
  filaEtiquetaCvv: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  ayudaCvv: {
    fontSize: 10,
    color: COLORES.textoSecundario,
  },
  contenedorInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: RADIO.md,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: COLORES.fondo,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORES.texto,
    fontFamily: FUENTES.regular,
    outlineStyle: "none",
  },
  filaDoble: {
    flexDirection: "row",
    gap: 12,
  },
  contenedorCuotas: {
    gap: 8,
  },
  itemCuota: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: RADIO.sm,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.fondo,
  },
  itemCuotaActivo: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primarioTint,
  },
  textoCuota: {
    fontSize: 13,
    color: COLORES.texto,
    fontFamily: FUENTES.medio,
  },
  textoCuotaActivo: {
    fontWeight: "700",
    color: COLORES.primario,
    fontFamily: FUENTES.bold,
  },
  avisoError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORES.errorClaro,
    padding: 10,
    borderRadius: RADIO.sm,
    marginBottom: 14,
  },
  textoError: {
    flex: 1,
    fontSize: 12,
    color: COLORES.error,
    fontWeight: "600",
  },
  botonPagar: {
    backgroundColor: COLORES.acento,
    borderRadius: RADIO.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    ...SOMBRAS.media,
    marginTop: 4,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  filaProcesando: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textoBotonPagar: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: FUENTES.extrabold,
    letterSpacing: 0.5,
  },
  leyendaPie: {
    fontSize: 10.5,
    color: COLORES.textoSilenciado,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 14,
  },
  fondoModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tarjetaComprobante: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.lg,
    padding: 22,
    alignItems: "center",
    ...SOMBRAS.fuerte,
  },
  iconoExito: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORES.exito,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    ...SOMBRAS.suave,
  },
  tituloExito: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORES.texto,
    fontFamily: FUENTES.extrabold,
  },
  subtituloExito: {
    fontSize: 12.5,
    color: COLORES.textoSecundario,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  ticket: {
    width: "100%",
    backgroundColor: COLORES.fondo,
    borderRadius: RADIO.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: 14,
    gap: 8,
    marginBottom: 18,
  },
  filaTicket: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  etiquetaTicket: {
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
  valorTicket: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORES.texto,
  },
  valorTicketDestacado: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORES.primario,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  separadorTicket: {
    height: 1,
    backgroundColor: COLORES.borde,
    marginVertical: 4,
  },
  totalTicketEtiqueta: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORES.texto,
    fontFamily: FUENTES.bold,
  },
  totalTicketValor: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORES.acento,
    fontFamily: FUENTES.extrabold,
  },
  accionesComprobante: {
    width: "100%",
    gap: 10,
  },
  botonMisPedidos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORES.primario,
    paddingVertical: 12,
    borderRadius: RADIO.md,
  },
  textoBotonMisPedidos: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: FUENTES.bold,
  },
  botonSeguirComprando: {
    alignItems: "center",
    paddingVertical: 10,
  },
  textoBotonSeguirComprando: {
    color: COLORES.textoSecundario,
    fontSize: 13,
    fontWeight: "600",
  },
});
