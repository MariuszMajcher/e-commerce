import { useLocation } from "react-router-dom"
import '../styling/Message.css'

const Message = () => {
    const { state } = useLocation()
    console.log(state)
    const message = state.message

  if (!message) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="message-container">
        <h1>{message.message}</h1>
        <h2>{message.price}</h2>
        <h3>{message.date}</h3>
        <h3>{message.sender_name} {message.sender_surname}</h3>
    </div>
  )
}

export default Message