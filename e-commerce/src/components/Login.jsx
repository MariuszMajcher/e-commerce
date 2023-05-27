import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logIn, loadUser, setUserExists } from '../store/userSlice'
import {  selectUserExists} from '../store/userSlice'
import { loadAllMessages } from '../store/messagesSlice'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const dispatch = useDispatch()
  const userExists = useSelector(selectUserExists)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setTimeout(() => {
      dispatch(setUserExists(false))
    }, 3000)
  }, [userExists])

  // login will have a 3 times try, a state that will hold number of wrong tries

  const handleSubmit = (e) => {
    e.preventDefault()
    
    fetch(`https://localhost:3000/login`, {
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
        const { messages, ...userData } = data
        dispatch(logIn())
        dispatch(loadAllMessages(messages))
        console.log(userData)
        dispatch(loadUser(userData))
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
      {userExists ? <h2>Sorry, that user already exists</h2> : null}
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
// upon login the messages will be loaded that correspond to the user
// this will be done using the same fetch request 