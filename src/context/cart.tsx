import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const FN_NOOP = () => {};

interface Cart {
    items: Record<number, number>;
    addToCart: (id: number) => void;
    removeFromCart: (id: number) => void;
}

export const cartContext = React.createContext<Cart>({
    items: {},
    addToCart: FN_NOOP,
    removeFromCart: FN_NOOP,
});

export const useCart = () => React.useContext(cartContext);

interface Props {
    children: React.ReactNode;
}

const { Provider } = cartContext;

export const CartProvider: React.FC<Props> = ({ children }) => {
    const [items, setItems] = React.useState<Record<number, number>>({});

    const addToCart = React.useCallback((id: number) => {
        setItems((items) => {
            return {
                ...items,
                [id]: (items[id] ?? 0) + 1,
            };
        });
    }, []);

    const removeFromCart = React.useCallback((id: number) => {
        setItems((items) => {
            const newItems = { ...items };
            delete newItems[id];
            return newItems;
        });
    }, []);

    return (
        <Provider value={{ items, addToCart, removeFromCart }}>
            {children}
        </Provider>
    );
}