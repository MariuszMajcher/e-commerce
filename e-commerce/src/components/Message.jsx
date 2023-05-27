import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "../store/userSlice"
import { loadCurrentMessage } from "../store/currentMessageSlice"
import { loadAllMessages } from "../store/messagesSlice"
import { useEffect, useState } from "react"
import { selectCurrentMessage } from "../store/currentMessageSlice"
import '../styling/Message.css'

const Message = () => {

    const dispatch = useDispatch()
    const [messageBack, setMessageBack] = useState('')
    const [send, setSend] = useState(false)
    const [catOwnerId, setCatOwnerId] = useState()
    const [isOwner, setIsOwner] = useState(false)
 
    const user = useSelector(selectUser)
    const { state } = useLocation()
   
    const navigate = useNavigate()
    let message

    const openedMessage = useSelector(selectCurrentMessage)

      // looks like it crashes when the link is not clicked, is trying to acces state value, need to make it so it loads state 
    // only if the link is clicked
    if(state) {
      message = state.message
      dispatch(loadCurrentMessage(state.message))
    } else {
      message = openedMessage
    }

    const agreed = openedMessage.sale_agreed

    // This is just a fetch that loads the cats owner id, later it is used for the isOwner check
    useEffect(() => {
      const fetchData = async () => {
        try {
          if(openedMessage.cat_id) {
            const res = await fetch(`http://localhost:3000/cat/${openedMessage.cat_id}`)
            const data = await res.json()
             return setCatOwnerId(data.id.user_id)
          }
        } catch (error) {
          console.log(error)
        }
      }
      // Check if the user receiving message is the owner of the cat
     fetchData()
    }, [openedMessage])

    useEffect(() => {
      setIsOwner(openedMessage.receiver_id === catOwnerId)
    }, [catOwnerId])
    
  //  this sends an update to the messages table, it changes value of sale_agreed to true
    const handleAgree = () => {
        fetch(`http://localhost:3000/message/${openedMessage.id}`, {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            message: openedMessage
          })
        })
        .then(res => res.json())
        .then(data => 
          dispatch(loadAllMessages(data))
          )
        .catch(err => console.log(err))
        .finally(navigate('/messages'))
    }
    // Now will need to create a pay button functionality using Stripe, every other way of sending messages seems to be working well
    

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

  // WOULD BE GOOD TO HOLD SEPARATLY TWO MESSAGE STATES, RECEIVED AND SENT
  // MAYBE EVEN TURN IT IN TO A SINGLE MESSAGING SYSTEM THAT WOULD UPDATE STRAIGHT AFTER SEND
  // BOTH SIDES COULD UPDATE THEIR MESSAGE STATE USING A EVENT HANDLER

 

  const handleDelete = () => {
    fetch(`https://localhost:3000/cats-shop/${message.id}`, {
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


  // THE PAY BUTTON DISPLAYS PROPERLY
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
        {/* will display if owner that has not yet agreed */}
         {isOwner && !agreed && <button onClick={handleAgree}>Agree!</button>} 
         {/* has to display only for not owners, that did not yet agree to the sale */}
         {agreed && !isOwner &&  <button onClick={() => console.log('Sold')}>Pay</button>}
    </div>
  )
}

export default Message