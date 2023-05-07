import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import './App.css'

import NewUser from './components/NewUser'
import Login from './components/Login'
import CatShop from './components/CatShop'
import Profile from './components/Profile'


function App() {
  

  return (
    <BrowserRouter>
    <nav>
      <Link to='/new-user'>New User</Link>
      <Link to='/login'>Login</Link>
    </nav>
      <Routes>
        <Route path='/new-user' element={<NewUser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cat-shop' element={<CatShop />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
