import { useState, useEffect } from 'react'

// will pass on the information about the cat and its owner, to be able to send a request to the owner
const BuyCat = (props) => {


  const [ownerId, setOwnerId] = useState()
  const [message, setMessage] = useState('')
  const [price, setPrice] = useState(0)

  // For security reasons will need to extract only the id of the owner from the cats for sale table  
  useEffect(() => {
    // get the owner of the cat

    setOwnerId(props.ownerId)
    }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const setters = {
        message: setMessage,
        price: setPrice
    }
    setters[name](value)
  } 


  const handleSubmit = (e) => {
    e.preventDefault()
    // send a request to the owner
    fetch('buy-cat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
                
        },
                
        body: JSON.stringify({
            message: message,
            price: price,
            ownerId: ownerId
            })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message)
            })
  }
    
  return (
    <form onSubmit={handleSubmit}>
        <textarea name="message" value={message} onChange={handleChange} placeholder="Message to the owner" />
        <input type="number" name="price" value={price} onChange={handleChange} placeholder="Price you are willing to pay" />
        <input type="submit" value="Buy" />
    </form>
  )
}

export default BuyCat

// STILL NOT HAVING THE OWNER ID, NEED TO PASS IT DOWN FROM THE CAT SHOP
// NOW WILL START WORKING ON THE OWNER SIDE, WILL NEED TO CREATE A PAGE FOR THE OWNER TO SEE THE REQUESTS
// WILL NEED TO ADD A SERVER REQUEST TO GET THE REQUESTS FROM THE DATABASE
// AND CHANGE THE TABLE OF OWENERS
// WILL NEED TO ADD A COLUMN TO THE OWNER TABLE, CALLED MONEY, THIS WILL BE THE MONEY THE OWNER HAS MADE FROM SELLING CATS