import React, { createContext, useContext, useState } from "react";
const CartContext = createContext(undefined);
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const addItem = (product, cantidad = 1) => {
    if (!Number.isInteger(cantidad) || cantidad <= 0 || product.stock <= 0)
      return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.cantidad + cantidad, product.stock);
        return prev.map((i) =>
          i.product.id === product.id
            ? {
                ...i,
                cantidad: newQty,
              }
            : i,
        );
      }
      return [
        ...prev,
        {
          product,
          cantidad: Math.min(cantidad, product.stock),
        },
      ];
    });
  };
  const removeItem = (productId) =>
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  const updateQty = (productId, cantidad) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId
          ? {
              ...i,
              cantidad: Math.max(
                1,
                Math.min(Math.floor(cantidad), i.product.stock),
              ),
            }
          : i,
      ),
    );
  };
  const clear = () => setItems([]);
  const total = items.reduce(
    (acc, i) => acc + i.product.precio * i.cantidad,
    0,
  );
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clear,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
