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

  useEffect(() => {
    fetch(`http://localhost:3000/messages/${user.id}`)
      .then(res => res.json())
      .then(data => {
        dispatch(loadAllMessages(data))
      })
  }, [])

  const read = messages.every(element => {
    element.read === true
  });
  console.log(read)

  const user = useSelector(selectUser)
  return (
    <div>
      <h1>welcome {user.first_name}</h1>
      <Link to="/messages">Messages{!read && <span className="red-dot"></span>}</Link>
    </div>
  )
}

export default Profile
