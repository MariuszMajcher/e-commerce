import { useSelector } from "react-redux"
import { selectUser } from "../store/userSlice"

const Profile = () => {
  // this componennt will be responsible for adding some more information that is not required

  const user = useSelector(selectUser)
  return (
    <div>
    <h1>welcome {user.first_name}</h1>
    </div>
  )
}

export default Profile