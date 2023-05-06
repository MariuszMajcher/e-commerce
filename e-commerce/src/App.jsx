import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import './App.css'

import NewUser from './components/NewUser'
import Login from './components/Login'


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/new-user' element={<NewUser />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
