import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logIn, loadUser, setUserExists } from '../store/userSlice'
import {  selectUserExists} from '../store/userSlice'
import { loadAllMessages } from '../store/messagesSlice'
import { useNavigate } from 'react-router-dom'
import '../styling/Login.css'

const Login = () => {

  const dispatch = useDispatch()
  const userExists = useSelector(selectUserExists)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tries, setTries] = useState(0)


  useEffect(() => {
    setTimeout(() => {
      dispatch(setUserExists(false))
    }, 3000)
  }, [userExists])


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
          // setTries(prev => prev ++) 
          setTries(tries+1)

          console.log(tries)

          if(tries >= 3) {
            navigate('/new-user')
            return false
          } 
        } else {
        const { messages, ...userData } = data
        dispatch(logIn())
        dispatch(loadAllMessages(messages))
        console.log(userData)
        dispatch(loadUser(userData))
        navigate('/sell-cat')
        }})

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
      {userExists ? <h2>Sorry, that user already exists</h2> : null}
        <form onSubmit={handleSubmit}>
            <h2>Log in please</h2>
            {tries > 0 ? <h2 className='tries'>You got {4-tries} remaining!</h2> : null}
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
