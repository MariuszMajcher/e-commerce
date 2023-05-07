import { useSelector } from "react-redux"
import { selectUser } from "../store/userSlice"

const Profile = () => {

  const user = useSelector(selectUser)
  return (
    <div>
    <h1>welcome {user.first_name}</h1>
    </div>
  )
}

export default Profile