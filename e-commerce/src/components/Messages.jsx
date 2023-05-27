import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import {  selectMessages } from "../store/messagesSlice"
import { useState } from "react"

import { loadCurrentMessage } from "../store/currentMessageSlice"
import SendMessage from "./SendMessage"




const Messages = () => {

    const [sendMessage, setSendMessage] = useState(false)
    const messages = useSelector(selectMessages);
    const dispatch = useDispatch()
    
    // Creates an array of Links for messages, passes on the messages that are selected from the slice, 
    // if the message component rerenders the current message information will update from the already used slice
    const messageBoxes = messages.map((message) => {
      return (
       
        <Link
          to={`/messages/${message.id}`}
          state= {{ message: message }}
          className = {message.message_read ? "read" : "unread"}
          key={message.id}
          onClick={() => {
            if (!message.message_read) {
              fetch(`https://localhost:3000/messages/${message.id}`, {
                method: 'PATCH'

              })
              .then(response => response.json())
              .then(data => {
                dispatch(loadCurrentMessage(data.message));
              });
            }
          }}
        >
          {message.date_of_message} <br /> {message.sender_name}
        </Link>
       
      );
    });

  return (
    <div>
        {messageBoxes}
        <button onClick={() => setSendMessage(prev => !prev)}>Send a Message</button>
        {sendMessage ? <SendMessage />: null}
    </div>
  )
}

export default Messages

// this will be container for all the messages, it will display a message box for each message