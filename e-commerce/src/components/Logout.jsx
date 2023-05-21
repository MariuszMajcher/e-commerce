import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logOut } from "../store/userSlice"

const Logout = () => {

const navigate = useNavigate();
const dispatch = useDispatch();

const handleLogOut = () => {
    dispatch(logOut());
    navigate('/login');
    };


  return (
    <button onClick={handleLogOut}>Log out</button>
  )
}

export default Logout