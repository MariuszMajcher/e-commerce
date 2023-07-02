import { useLocation, useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "../store/userSlice"
import { loadCurrentMessage } from "../store/currentMessageSlice"
import { loadAllMessages } from "../store/messagesSlice"
import { useEffect, useState } from "react"
import { selectCurrentMessage } from "../store/currentMessageSlice"
import '../styling/Message.css'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';



const stripePromise = loadStripe('pk_test_51NCFU5J7Crgvv5hLaebFS8Yvcv6Ijr6yceyM1DJuMCIBtXmofJLtXJNjo9ca3sxw2npwIJVIXGqSIYlqN2mRM7Eg00fNiWh6d3');

import Stripe from './Stripe'

const Message = () => {

  const dispatch = useDispatch()
  const [messageBack, setMessageBack] = useState('')
  const [send, setSend] = useState(false)
  const [catOwnerId, setCatOwnerId] = useState()
  const [isOwner, setIsOwner] = useState(false)
  const [payement, setPayement] = useState(false)
 
 
  const user = useSelector(selectUser)
  const { state } = useLocation()
  
  const navigate = useNavigate()
  let message

  const openedMessage = useSelector(selectCurrentMessage)

  
  if(state) {
    message = state.message
 
    dispatch(loadCurrentMessage(state.message))
  } else {
    message = openedMessage
  
  }


  const agreed = message.sale_agreed

  // This is just a fetch that loads the cats owner id, later it is used for the isOwner check
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(message.cat_id) {
          const res = await fetch(`http://localhost:3000/cat/${message.cat_id}`)
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
    setIsOwner(message.receiver_id === catOwnerId)
  }, [catOwnerId])
    
  //  this sends an update to the messages table, it changes value of sale_agreed to true
  const handleAgree = () => {
      fetch(`http://localhost:3000/message/${message.id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          message: message
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        dispatch(loadAllMessages(data))}
        )
      .catch(err => console.log(err))
      .finally(navigate('/messages'))
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

  const handlePay = () => {
    setPayement(prev => !prev)
  }
  

  const handleDelete = () => {
    fetch(`http://localhost:3000/cats-shop/${message.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        user: user.id
      })
    })
  .then(res => res.json())
  .then(data => { 
    if(data.message === 'Message deleted sucessfuly') {
      dispatch(loadAllMessages(data.data))
      navigate('/messages')
  }})
  }


  if (!message) {
    return <h1>Loading...</h1>
  }


  // THE PAY BUTTON DISPLAYS PROPERLY
  return (
    <div className="message-container">
      <div className={payement ? "blurred": ""}></div>
        <h1>{message.message}</h1>
        <h2>{message.price}</h2>
        <h3>{message.date}</h3>
        <h3>{message.sender_name} {message.sender_surname}</h3>
        <div className="buttons">
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
          {agreed && !isOwner &&  <button onClick={handlePay}>Pay</button>}
          {/* FOR STYLING PURPOSES AFTER CLICKING THE PAY BUTTON THE STRIPE FORM WILL COME OUT AND THE BACKGROUND WILL SLOWLY FADE AWAY */}
          {payement && <Elements stripe={stripePromise}>
            <Stripe className="stripe" message={message}/>
          </Elements>}
          <Link to='/messages'>Back</Link>
        </div>
    </div>
  )
}

export default Message