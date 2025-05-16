import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import UserContextProvider from './context/UserContext.jsx'
import CartContextProvider from './context/CartContext.jsx';
import WishListContextProvider from './context/WishListContext.jsx';

createRoot(document.getElementById('root')).render(
  <WishListContextProvider>
    <CartContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </CartContextProvider>
  </WishListContextProvider>
)
