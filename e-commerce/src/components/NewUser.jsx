import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserExists } from '../store/userSlice'
import '../styling/NewUser.css'


const NewUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [favoriteBreed, setFavoriteBreed] = useState('')
  const [address, setAddress] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [bigLetter, setBigLetter] = useState(false)
  const [smallLetter, setSmallLetter] = useState(false)
  const [number, setNumber] = useState(false)
  const [specialCharacter, setSpecialCharacter] = useState(false)
  const [invalidLength, setInvalidLength] = useState(false)
  const [invalidCharacter, setInvalidCharacter] = useState(false)
  const [validPassword, setValidPassword] = useState(false)
  const [validEmail, setValidEmail] = useState(false)

  const handleChange = (e) => {
    e.preventDefault()
    const bigLetterCheck = /[A-Z]/;
    const smallLetterCheck = /[a-z]/;
    const numberCheck = /[0-9]/;
    const specialCharacterCheck = /[!@]/;
    const invalidCharacterCheck = /[^A-Za-z0-9!@]/;
    const invalidLengthCheck = /[A-Za-z0-9!@]{8,}/;
    const emailCheck = /[^@]+@[^\.]+\..+/;
    

    const setters = {
        email: setEmail,
        password: setPassword,
        firstName: setFirstName,
        lastName: setLastName,
        favoriteBreed: setFavoriteBreed,
        address: setAddress,
        passwordConfirmation: setPasswordConfirmation
    }

    setters[e.target.name](e.target.value)
    if(e.target.name === 'password') {
        bigLetterCheck.test(e.target.value) ? setBigLetter(true) : setBigLetter(false)
        smallLetterCheck.test(e.target.value) ? setSmallLetter(true) : setSmallLetter(false)
        numberCheck.test(e.target.value) ? setNumber(true) : setNumber(false)
        specialCharacterCheck.test(e.target.value) ? setSpecialCharacter(true) : setSpecialCharacter(false)
        invalidCharacterCheck.test(e.target.value) ? setInvalidCharacter(true) : setInvalidCharacter(false)
        invalidLengthCheck.test(e.target.value) ? setInvalidLength(true) : setInvalidLength(false)
      
    } 
    if(e.target.name === 'email') {
        emailCheck.test(e.target.value) ? setValidEmail(true) : setValidEmail(false)
    }

    console.log(password == passwordConfirmation)
    if (password == passwordConfirmation) {
        setValidPassword(true)
    } else {
        setValidPassword(false)
    }   
    }

    const handleSubmit = (e) => {
       e.preventDefault()
        fetch('http://localhost:3000/new-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    favoriteBreed: favoriteBreed,
                    address: address
                    })
                })
                .then(res => res.json())  
                .then(data => {
                    if(data.message === 'Email already exists') {
                        dispatch(setUserExists(true))
                        navigate('/login')
                    } else {
                        dispatch(setUserExists(false))
                        navigate('/login')
                    }
                })
                .catch(err => console.log(err))
    }



  return (
    <div className="new-user">
        <form>
            <h2>Sign up please</h2>
            <input value={email} onChange={handleChange} name="email" type="text" placeholder="Your email address or user name" required/>
            <input value={firstName} type="text" onChange={handleChange} name="firstName" placeholder="Your first name" required/>
            <input value={lastName} type="text" onChange={handleChange} name="lastName" placeholder="Your last name" required/>
            <input value={favoriteBreed} type="text" onChange={handleChange} name="favoriteBreed" placeholder="Your favorite breed" required/>
            <input value={password} onChange={handleChange} type="password" name="password" placeholder="Your password" required/>
            <input value={passwordConfirmation} onChange={handleChange} type="password" name="passwordConfirmation" placeholder="Confirm your password" required/>
            <input value={address} onChange={handleChange} type="text" name="address" placeholder="Your address" required/>

            <button onClick={handleSubmit}>Submit</button>
        </form>
        <div className= "password-validation">
        {!invalidLength && <p className="invalid">Password must be at least 8 characters long</p>}
        {!bigLetter && <p className="invalid">Password must contain a capital letter</p>}
        {!smallLetter && <p className="invalid">Password must contain a lowercase letter</p>}
        {!number && <p className="invalid">Password must contain a number</p>}
        {!specialCharacter && <p className="invalid">Password must contain a special character</p>}
        {invalidCharacter && <p className="invalid">Password contains invalid characters</p> }
        {validPassword && <p className="invalid">Passwords do not match</p>}
        {!validEmail && <p className="invalid">Invalid email address</p>}
        </div>
    </div>
  )
}

export default NewUser