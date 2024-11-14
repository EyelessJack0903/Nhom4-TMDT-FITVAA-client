const { createContext, Children, useState, useEffect } = require("react");

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [cartProducts, setCardProducts] = useState([]);
    useEffect(() => {
        if (cartProducts?.length > 0) {
            ls?.setItem('cart', JSON.stringify(cartProducts));

        }
    }, [cartProducts]);
    useEffect(() => {
        if (ls && ls.getItem('cart')) {
            setCardProducts(JSON.parse(ls.getItem('cart')));
        }
    }, []);
    function addProduct(productID) {
        setCardProducts(prev => [...prev, productID]);
    }
    function removeProduct(productID) {
        setCardProducts(prev => {
            const pos = prev.indexOf(productID);
            if (pos !== -1) {
                return prev.filter((value, index) => index !== pos);
            }
            return prev;
        })
    }
    return (
        <CartContext.Provider value={{ cartProducts, setCardProducts, addProduct, removeProduct }}>
            {children}
        </CartContext.Provider>
    );
}