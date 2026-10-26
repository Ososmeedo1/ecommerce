import { createContext } from 'react';

export const CartContext = createContext();
export const WishListContext = createContext();
export const UserContext = createContext();
export const ThemeContext = createContext({
  theme: 'light',
  isDarkMode: false,
  toggleTheme: () => { }
});
