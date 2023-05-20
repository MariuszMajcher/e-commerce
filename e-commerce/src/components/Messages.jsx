import { useSelector, useDispatch } from "react-redux"
import { loadMessages } from "../store/messagesSlice"
import { Link } from "react-router-dom"
import { selectMessages } from "../store/messagesSlice"




const Messages = () => {

   
    const dispatch = useDispatch()
    const messages = useSelector(selectMessages);
    const messageBoxes = messages.map((message) => {
      return (
       
        <Link
          to={`/messages/${message.id}`}
          state= {{ message: message }}
          className = {message.message_read ? "read" : "unread"}
          key={message.id}
          onClick={() => {
            if (!message.message_read) {
              fetch(`http://localhost:3000/messages/${message.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  read: true
                })
              })
              .then(response => response.json())
              .then(data => {
                console.log(data.message);
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
    </div>
  )
}

export default Messages

// this will be container for all the messages, it will display a message box for each message