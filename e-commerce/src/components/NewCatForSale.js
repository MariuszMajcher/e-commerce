import { useState } from 'react'


const NewCatForSale = () => {
  const [name, setName] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [age, setAge] = useState(0)
  const [breed, setBreed] = useState('')
  const [gender, setGender] = useState('')
  const [imagesPath, setImagesPath] = useState('')
  const [price, setPrice] = useState(0)

  const onSumbit = () => {
    fetch('http://localhost:3000/new-cat', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: 
            JSON.stringify({name, sellerName, age, breed, gender, imagesPath, setImagesPath})
        
    })
    .then(res => res.json())
    .then(data => console.log(data)/**This will expect to have a message back with the date of sale estabilished
    the  basic other information that have been set by the seller*/)
  }

  const onChange = (e) => {
    e.preventDefault()
    const setters = {
        name: setName,
        sellerName: setSellerName,
        age: setAge,
        breed: setBreed,
        gender: setGender,
        imagesPath: setImagesPath,
        price: setPrice
    }
  }
  
// Still not done the server side of the request

// sellerName will need to look for name in DB and return id number to place in the cats_for_sale DB
// date of cat being put on sale can be done on the server side
  return (
    <form onSumbit={onSubmit}>
        <input type="text" name="name" value={name}/>
    </form>
  )
}

export default NewCatForSale