import React, {createContext, useReducer} from 'react';

export const Store = createContext();
import Cookies from 'js-cookie';

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems:  Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : []
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return {...state, darkMode: true};
      break;
    case 'DARK_MODE_OFF':
      return {...state, darkMode: false};
      break;
    case 'ADD_TO_CART':
      const extistingCartItems = state.cart.cartItems;
      const product = action.payload;
      const productExists = extistingCartItems.find((item) => item.slug === product.slug);
      let cartItems = [];
      if (productExists) {
        cartItems = extistingCartItems.map((item) => (item.slug === product.slug ? product : item));
      } else {
        cartItems = [...extistingCartItems, product];
      }
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return {...state, cart: {...state.cart, cartItems}};
    case 'REMOVE_FROM_CART':
      const newCartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id);
      Cookies.set('cartItems', JSON.stringify(newCartItems));
      return {...state, cart: {...state.cart, cartItems: newCartItems}};
    default:
      return {...state};
  }
};

export default function StoreProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {state, dispatch};
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
