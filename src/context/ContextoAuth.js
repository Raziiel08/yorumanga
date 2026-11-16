import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
const AuthContext = createContext(undefined);
export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null);
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setCargando(false), 8000);
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) throw error;
      setSesion(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setCargando(false);
      }
    }).catch((err) => {
      console.error('Error getSession:', err);
      setCargando(false);
    });
    const {
      data: {
        subscription
      }
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
  const fetchUserProfile = async userId => {
    try {
      const {
        data,
        error
      } = await supabase.from('usuarios').select('*').eq('id', userId).single();
      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user perfil:', error);
    } finally {
      setCargando(false);
    }
  };
  const signIn = async (email, password) => {
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return {
      error
    };
  };
  const signUp = async (email, password, nombre) => {
    try {
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: nombre || ''
          }
        }
      });
      if (error) console.error('signUp supabase error:', error);
      return { error };
    } catch (e) {
      console.error('signUp exception:', e);
      return { error: e };
    }
  };
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      return null;
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      return error;
    }
  };
  const isAdmin = user?.rol === 'admin';
  const isCliente = user?.rol === 'cliente';
  const isVendedor = user?.rol === 'vendedor';
  const isDeposito = user?.rol === 'deposito';
  const hasRole = roles => !!user && roles.includes(user.rol);
  return <AuthContext.Provider value={{
    user,
    sesion,
    cargando,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isCliente,
    isVendedor,
    isDeposito,
    hasRole
  }}>
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};