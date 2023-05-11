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

function App() {
  const dispatch = useDispatch()
  const logged = useSelector(selectLoggedIn)


  const loadAllCats = () => {
    fetch('http://localhost:3000/cats')
      .then(res => res.json())
      .then(data => {
        let catsArray = []
        dispatch(clearCats())
        console.log('cleared cats')
        for(let cat of data) {
             catsArray.push(cat)
        }
        console.log('cats loaded')
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
    </nav>
      <Routes>
        <Route path='/cat-breeds' element={<CatBreeds />} />
        <Route path='/new-user' element={<NewUser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cat-shop' element={<CatShop />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>

      <button onClick={() => loadAllCats()}>Log out</button>
    </BrowserRouter>
  )
}

export default App
