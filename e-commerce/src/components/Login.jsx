import { useState } from 'react'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    fetch(`http://localhost:3000/login?email=${email}&password=${password}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    }
    )
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
        <form>
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
            <button onClick={handleSubmit}>Submit</button>
        </form>
    </div>
  )
}

export default Login