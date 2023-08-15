import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { selectUser } from "../store/userSlice"
import { selectMessages } from "../store/messagesSlice"
import { Link } from "react-router-dom"
import { loadAllMessages } from "../store/messagesSlice"
import '../styling/Profile.css'

const Profile = () => {
  const dispatch = useDispatch()
  const messages = useSelector(selectMessages)
  const user = useSelector(selectUser)

  useEffect(() => {
    fetch(`http://localhost:3000/messages/${user.id}`)
      .then(res => res.json())
      .then(data => {
        dispatch(loadAllMessages(data))
      })
  }, [])

  

  const read = messages.every(element => {
    return element.message_read === true
  });
  

  return (
    <div className="profile_container">
      <h1 className="greeting">Welcome {user.first_name} </h1>
      <Link to="/messages">Messages{!read && <span className="red-dot"></span>}</Link>
    </div>
  )
  
}

export default Profile
