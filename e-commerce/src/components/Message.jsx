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
    const [catOwnerId, setCatOwnerId] = useState()
    const [isOwner, setIsOwner] = useState(false)
    // here will create another state that will hold the bool of the table information,
    // this will allow the user to see the button
 
    const user = useSelector(selectUser)
    const { state } = useLocation()

    dispatch(loadCurrentMessage(state.message))
    const navigate = useNavigate()
    let message

  
    const openedMessage = useSelector(selectCurrentMessage)


    if (state === null) {
      message = openedMessage
    } else {
      message = state.message
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          if(openedMessage.cat_id) {
            const res = await fetch(`http://localhost:3000/cat/${openedMessage.cat_id}`)
            const data = await res.json()
              console.log(data)
             return setCatOwnerId(data.id.user_id)
          }
        } catch (error) {
          console.log(error)
        }
      }
      // Check if the user receiving message is the owner of the cat
     fetchData()
    }, [openedMessage])

    console.log(isOwner)
    useEffect(() => {
      setIsOwner(openedMessage.receiver_id === catOwnerId)
    }, [catOwnerId])
    
    // it might be better to hold a column that is boolean that would hold a special kind of state, 
    // if the owner agrees to the sale he will click handleAgree, this will be  a patch request
    // will just update the column. And based on that, the user that has in his messages 
    // a message that has this bool set to true, will have a button displayed with the Stripe payement
    // the value that will be passed will be the one agreed by poth parties
    const handleAgree = () => {
        fetch(`http://localhost:3000/message/${openedMessage.id}`, {
          method: 'PATCH',
          'Content-type': 'application/json'
        })
        .then(res => res.json())
        .then(data => console.log(data.message))
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
          setSend(false)
        });
  }

  const handleDelete = () => {
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
        <h1>{openedMessage.message}</h1>
        <h2>{openedMessage.price}</h2>
        <h3>{openedMessage.date}</h3>
        <h3>{openedMessage.sender_name} {openedMessage.sender_surname}</h3>
        <button onClick={() => {setSend(prev => !prev)}}>Write back</button>
        {send ? <form onSubmit={handleSubmit}>
                  <button onClick={() => setSend(false)}>X</button>
                  <textarea onChange={(e) => setMessageBack(e.target.value)} value={messageBack}></textarea>
                  <button type="submit">Send</button>
                </form> : null}
        <button onClick={handleDelete}>Delete message</button>
         {isOwner && <button onClick={handleAgree}>Agree!</button>} 
    </div>
  )
}

export default Message

// If the message have a cat_id and the cat_id will corespond to the user_id the message will have a componnent agree to sale, 
// this will send a message with a button to carry on with the payement using stripe