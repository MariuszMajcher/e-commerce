import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAllCats } from '../store/catsSlice'

const NewCatForSale = () => {
  const [name, setName] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [age, setAge] = useState(0)
  const [breed, setBreed] = useState('')
  const [gender, setGender] = useState('')
  const [imagesPath, setImagesPath] = useState('')
  const [price, setPrice] = useState(0)
  

  

 
    const cats = useSelector(selectAllCats).cats
    const  cats_breeds = cats.map(cat => cat.name)
    
    const options = cats_breeds.map((cat, index) => {
        return <option key={index} value={cat}>{cat}</option>
    })

  
  
  

  const onSubmit = () => {
    fetch('http://localhost:3000/sell-cat', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: 
            JSON.stringify({name, sellerName, age, breed, gender, imagesPath, price})
        
    })
    .then(res => res.json())
    .then(data => console.log(data)/**This will expect to have a message back with the date of sale estabilished
    the  basic other information that have been set by the seller*/)
  }

  const handleChange = (e) => {
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
    setters[e.target.name](e.target.value)
    
  }

  
  
  
// Still not done the server side of the request

// sellerName will need to look for name in DB and return id number to place in the cats_for_sale DB
// date of cat being put on sale can be done on the server side
  return (
    <div>
        <form onSubmit={onSubmit}>
          <input type="text" name="name" value={name} placeholder="Cats name" onChange={handleChange}/>
          <input type="text" name="sellerName" value={sellerName} placeholder="Your name"onChange={handleChange} />
          <input type="number" name="age" value={age} placeholder="Age of your cat" onChange={handleChange}/>
          <input type="text" value={imagesPath} name="imagesPath" placeholder="Path to your cat's image" onChange={handleChange}/>
          <input type="number" name="price" value={price} placeholder="Price" onChange={handleChange}/>
          <select name="breed" value={breed} onChange={handleChange}>
              {options}
          </select>
          <button type="submit"> button </button>
      </form>
    </div>
  )
}

export default NewCatForSale