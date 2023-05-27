import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadCats, clearCats } from './store/catsSlice';
import { useEffect } from 'react';
import { selectLoggedIn } from './store/userSlice';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51NCFU5J7Crgvv5hLaebFS8Yvcv6Ijr6yceyM1DJuMCIBtXmofJLtXJNjo9ca3sxw2npwIJVIXGqSIYlqN2mRM7Eg00fNiWh6d3')

import NewUser from './components/NewUser';
import Login from './components/Login';
import CatShop from './components/CatShop';
import Profile from './components/Profile';
import CatBreeds from './components/CatBreeds';
import NewCatForSale from './components/NewCatForSale';
import BuyCat from './components/BuyCat';
import Messages from './components/Messages';
import Message from './components/Message';
import Logout from './components/Logout'
import PaymentForm from './components/PayementForm';


function App() {
  const dispatch = useDispatch();
  const logged = useSelector(selectLoggedIn);
  

  const loadAllCats = () => {
    fetch('http://localhost:3000/cats')
      .then((res) => res.json())
      .then((data) => {
        let catsArray = [];
        dispatch(clearCats());
        for (let cat of data) {
          catsArray.push(cat);
        }
        dispatch(loadCats(catsArray));
      });
  };

 

  useEffect(() => {
    loadAllCats();
  }, []);

  

  return (
    
      <BrowserRouter>
        <nav>
          <Link to="/new-user">New User</Link>
          <Link to="/login">Login</Link>
          <Link to="/cats-shop">Cats Shop</Link>
          <Link to="/sell-cat">Sell Cat</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <Routes>
          <Route path="/cat-breeds" element={<CatBreeds />} />
          <Route path="/new-user" element={<NewUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cats-shop" element={<CatShop />} />
          <Route path="/sell-cat" element={<NewCatForSale />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cats-shop/:id" element={<BuyCat />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Message />} />
          <Route path="/payment" element={  <Elements stripe={stripePromise}>
                                              <PaymentForm />
                                            </Elements> } />
          
        </Routes>
          <Logout />
        
      </BrowserRouter>
   
  );
}

export default App;

// Added stripe to the App component, will need to check exactly how to implement it before i go any further