import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setCargando(false), 8000);
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) throw error;
        setSesion(session);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setCargando(false);
        }
      })
      .catch((err) => {
        console.error("Error getSession:", err);
        setCargando(false);
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sesion) => {
      setSesion(sesion);
      if (sesion?.user) {
        fetchUserProfile(sesion.user.id);
      } else {
        setUser(null);
        clearTimeout(timeout);
        setCargando(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error("Error fetching user perfil:", error);
    } finally {
      setCargando(false);
    }
  };
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return {
      error,
    };
  };
  const signUp = async (email, password, nombre, rol = "cliente") => {
    const rolesValidos = ["cliente", "vendedor", "deposito", "admin"];
    const rolFinal = rolesValidos.includes(rol) ? rol : "cliente";
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: nombre || "",
            rol: rolFinal,
          },
        },
      });
      if (error) {
        console.error("signUp supabase error:", error);
        return { error };
      }

      // Si se obtuvo sesión inmediata y el rol es distinto a cliente, asegurar el rol
      if (data?.session && rolFinal !== "cliente") {
        try {
          await supabase.rpc("asignar_mi_rol", { p_rol: rolFinal });
        } catch (rpcErr) {
          console.warn("RPC asignar_mi_rol:", rpcErr);
        }
      }
      return { error: null };
    } catch (e) {
      console.error("signUp exception:", e);
      return { error: e };
    }
  };

  const cambiarMiRol = async (nuevoRol) => {
    const rolesValidos = ["cliente", "vendedor", "deposito", "admin"];
    if (!rolesValidos.includes(nuevoRol)) return false;
    try {
      // 1. Intentar por RPC seguro
      const { error: rpcError } = await supabase.rpc("asignar_mi_rol", { p_rol: nuevoRol });
      if (!rpcError) {
        if (user) setUser({ ...user, rol: nuevoRol });
        return true;
      }
      // 2. Fallback update directo
      if (user?.id) {
        const { error: updError } = await supabase
          .from("usuarios")
          .update({ rol: nuevoRol })
          .eq("id", user.id);
        if (!updError) {
          setUser({ ...user, rol: nuevoRol });
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error("Error al cambiar rol:", e);
      return false;
    }
  };
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      return null;
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      return error;
    }
  };
  const isAdmin = user?.rol === "admin";
  const isCliente = user?.rol === "cliente";
  const isVendedor = user?.rol === "vendedor";
  const isDeposito = user?.rol === "deposito";
  const hasRole = (roles) => !!user && roles.includes(user.rol);
  return (
    <AuthContext.Provider
      value={{
        user,
        sesion,
        cargando,
        signIn,
        signUp,
        signOut,
        cambiarMiRol,
        isAdmin,
        isCliente,
        isVendedor,
        isDeposito,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
