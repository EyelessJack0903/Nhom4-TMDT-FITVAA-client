import { createContext, useState, useEffect } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);

  // Lưu giỏ hàng vào LocalStorage khi thay đổi
  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem("cart", JSON.stringify(cartProducts));
    } else {
      ls?.removeItem("cart"); // Xóa giỏ hàng khỏi LocalStorage nếu rỗng
    }
  }, [cartProducts]);

  // Tải giỏ hàng từ LocalStorage khi khởi động
  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      setCartProducts(JSON.parse(ls.getItem("cart")));
    }
  }, []);

  // Thêm sản phẩm vào giỏ hàng
  function addProduct(productID) {
    setCartProducts((prev) => [...prev, productID]);
  }

  // Xóa một sản phẩm khỏi giỏ hàng
  function removeProduct(productID) {
    setCartProducts((prev) => {
      const pos = prev.indexOf(productID);
      if (pos !== -1) {
        return prev.filter((_, index) => index !== pos);
      }
      return prev;
    });
  }

  function clearCart() {
    setCartProducts([]); 
    ls?.removeItem("cart");
    console.log("Cart cleared"); 
  }
  

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addProduct,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
