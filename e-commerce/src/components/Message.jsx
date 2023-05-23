import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "../store/userSlice"
import { loadCurrentMessage } from "../store/currentMessageSlice"
import { useEffect, useState } from "react"
import { selectCurrentMessage } from "../store/currentMessageSlice"
import '../styling/Message.css'

const Message = () => {

    const dispatch = useDispatch()
    const [messageBack, setMessageBack] = useState('')
    const [send, setSend] = useState(false)
    const user = useSelector(selectUser)
    const { state } = useLocation()
    const navigate = useNavigate()
    let message
    
    const messageReceived = useSelector(selectCurrentMessage)

    if (state === null) {
      message = messageReceived
    } else {
      message = state.message
    }

    console.log(message)
    useEffect(() => {
      dispatch(loadCurrentMessage(message))
    }, [])

   


    const handleClick = () => {
        setSend(true)
    }



  const handleSubmit = () => {
      fetch(`http://localhost:3000/cats-shop/${message.cat_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ownerId: message.sender_id, /* IN THE FUTURE WILL CHANGE IT TO RECEIVER_ID */
            message: messageBack, 
            price: message.asked_price,
            sender: user.id, 
            senderName: user.first_name, 
            senderSurname: user.last_name, 
            senderEmail: user.email
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setSend(false)
          
        });
  }

  const handleDelete = () => {
    console.log(message.id)
    fetch(`http://localhost:3000/cats-shop/${message.id}`, {
      method: 'DELETE'
    })
  .then(res => res.json())
  .then(data => { if(data.message === 'Message sucessfuly deleted') {
    navigate('/messages')
  }})
  }


  if (!message) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="message-container">
        <h1>{messageReceived.message}</h1>
        <h2>{messageReceived.price}</h2>
        <h3>{messageReceived.date}</h3>
        <h3>{messageReceived.sender_name} {messageReceived.sender_surname}</h3>
        <button onClick={handleClick}>Write back</button>
        {send ? <form onSubmit={handleSubmit}>
                  <button onClick={() => setSend(false)}>X</button>
                  <textarea onChange={(e) => setMessageBack(e.target.value)} value={messageBack}></textarea>
                  <button type="submit">Send</button>
                </form> : null}
        <button onClick={handleDelete}>Delete message</button>
    </div>
  )
}

export default Message