import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logIn, loadUser } from '../store/userSlice'
import {  selectLoggedIn} from '../store/userSlice'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const dispatch = useDispatch()
  const logged = useSelector(selectLoggedIn)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch(`http://localhost:3000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify( {
                username: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => { 
        if(data.message == 'unauthorized') {
            navigate('/new-user')
            return false
        }
        dispatch(logIn())
        dispatch(loadUser(data))
        navigate('/sell-cat')
           
        })
    .catch(err => console.log(err))
    }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.name === 'email') {
        setEmail(e.target.value)
    } else {
        setPassword(e.target.value)
    }
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <h2>Log in please</h2>
            <input 
            onChange={handleChange} 
            name='email'
            type="text" 
            value={email}
            placeholder="Your email address or user name" />
            <input 
            onChange={handleChange} 
            name='password'
            type="password" 
            value={password}
            placeholder="Your password" />
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default Login

// IMPORTANT:
/*NEED TO MAKE SURE THAT AFTER LOGIN ALL APART OF PASSWORD IS BEING STORED IN LS */