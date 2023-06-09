import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBuyingCat } from '../store/buyingCatSlice'
import { selectUser } from '../store/userSlice'
const BuyCat = () => {

  const buyingCat = useSelector(selectBuyingCat)
  const user = useSelector(selectUser)
  const [owner, setOwner] = useState(false)
  const [message, setMessage] = useState('')
  const [price, setPrice] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    setOwner(buyingCat.user_id === user.id)
    }, [buyingCat, user])  

  const handleChange = (e) => {
    const { name, value } = e.target
    const setters = {
        message: setMessage,
        price: setPrice
    }
    setters[name](value)
  } 
  console.log(user, buyingCat)

  const handleSubmit = (e) => {
    e.preventDefault()
    // send a request to the owner
    fetch(`http://localhost:3000/cats-shop/${buyingCat.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
                
        },
                
        body: JSON.stringify({
            message: message,
            price: price,
            ownerId: buyingCat.user_id,
            sender: user.id,
            senderName: user.first_name,
            senderSurname: user.last_name,
            senderEmail: user.email
            })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message)
                navigate('/cats-shop')
            })
  }
  // after the seller accepts the sale the cat will be removed from the shop, the cat will remain in the database but will not
  // be displayed in the shop, as the shop update will update only cats that are not sold
    
  return (
    <form onSubmit={handleSubmit}>
        <textarea name="message" value={message} onChange={handleChange} placeholder="Message to the owner" />
        <input type="number" name="price" value={price} onChange={handleChange} placeholder="Price you are willing to pay" />
        <input type="submit" value="Buy" disabled={owner ? true : false}/>
    </form>
  )
}

export default BuyCat

// WILL NEED TO ADD A SERVER REQUEST TO GET THE REQUESTS FROM THE DATABASE
// AND CHANGE THE TABLE OF OWNERS
// WILL NEED TO ADD A COLUMN TO THE OWNER TABLE, CALLED MONEY, THIS WILL BE THE MONEY THE OWNER HAS MADE FROM SELLING CATS