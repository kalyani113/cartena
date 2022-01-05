import React, {createContext, useReducer} from 'react';

export const Store = createContext();
import Cookies from 'js-cookie';

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return {...state, darkMode: true};
      break;
    case 'DARK_MODE_OFF':
      return {...state, darkMode: false};
      break;
    default:
      return {...state};
  }
};

export default function StoreProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {state, dispatch};
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
