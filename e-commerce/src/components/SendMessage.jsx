import { useState } from 'react'
import { selectUser } from '../store/userSlice'
import { useSelector } from 'react-redux'


const SendMessage = () => {

  const [message , setMessage] = useState('')
  const [email, setEmail] = useState('')
  const user = useSelector(selectUser)

  const handleSubmit = (e) => {
    fetch(`http://localhost:3000/messages/${email}`, {
    method: 'POST',
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify({
        email: email,
        message: message,
        userId : user.id,
        userName: user.first_name,
        userLast: user.last_name,
        userEmail: user.email
    })})
  }

  return (
    <form onSubmit={handleSubmit}>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email address of the target'></input>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Message' />
        <button type="submit">Send</button>
    </form>
  )
}

export default SendMessage
// this will display in messages comp, after clicking send message, will take email address as argument and on BE will send a message matching 