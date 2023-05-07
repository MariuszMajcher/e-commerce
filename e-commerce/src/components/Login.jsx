import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loggedIn, loadUser } from '../store/userSlice'
import { redirect } from 'react-router-dom'

const Login = () => {

  const dispatch = useDispatch()
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
        console.log(data)
        dispatch(loggedIn())
        dispatch(loadUser(data))
        return redirect('/profile')
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