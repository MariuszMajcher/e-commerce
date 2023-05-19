import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from './store/userSlice'
import { loadCats, clearCats } from "./store/catsSlice"
import { useEffect } from "react"
import { selectLoggedIn } from './store/userSlice'

import NewUser from './components/NewUser'
import Login from './components/Login'
import CatShop from './components/CatShop'
import Profile from './components/Profile'
import CatBreeds from './components/CatBreeds'
import NewCatForSale from './components/NewCatForSale'
import BuyCat from './components/BuyCat'

function App() {
  const dispatch = useDispatch()
  const logged = useSelector(selectLoggedIn)


  const loadAllCats = () => {
    fetch('http://localhost:3000/cats')
      .then(res => res.json())
      .then(data => {
        let catsArray = []
        dispatch(clearCats())
        for(let cat of data) {
             catsArray.push(cat)
        }
        dispatch(loadCats(catsArray))
      }
      )
  }

useEffect(() => {
  loadAllCats()
}, [])
  

  return (
    <BrowserRouter>
    <nav>
      <Link to='/new-user'>New User</Link>
      <Link to='/login'>Login</Link>
      <Link to='/cats-shop'>Cats Shop</Link>
      <Link to='/sell-cat'>Sell Cat</Link>
    </nav>
      <Routes>
        <Route path='/cat-breeds' element={<CatBreeds />} />
        <Route path='/new-user' element={<NewUser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cats-shop' element={<CatShop />} />
        <Route path='/sell-cat' element={<NewCatForSale />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/cats-shop/:id' element={<BuyCat />} />
      </Routes>

      <button onClick={() => dispatch(logOut())}>Log out</button>
    </BrowserRouter>
  )
}

export default App
