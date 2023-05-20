import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { selectUser } from "../store/userSlice"
import { Link } from "react-router-dom"
import { loadMessages } from "../store/messagesSlice"

const Profile = () => {
  const dispatch = useDispatch()
  // this componennt will be responsible for adding some more information that is not required

  useEffect(() => {
    fetch(`http://localhost:3000/messages/${user.id}`)
      .then(res => res.json())
      .then(data => {
        dispatch(loadMessages(data))
      })
  }, [])



  const user = useSelector(selectUser)
  return (
    <div>
    <h1>welcome {user.first_name}</h1>
    <Link to="/messages">Messages</Link>
    </div>
  )
}

export default Profile
// profile will need to have a messages received and sent box, 
// requests from the buyers will be sent to the seller assoctiated with the cat
// will need to have a box icon that will access messages, the box will have 2 states, up to date and new messages received
// upon loging in the messages that correspond to the user will be loaded, the messages will be stored in the store
// if the messagess are not read the box will have a red dot, if the messages are read the box will have a green dot
