import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAllCats } from '../store/catsSlice'
import { useNavigate } from 'react-router-dom'

const NewCatForSale = () => {
  const [name, setName] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [age, setAge] = useState(0)
  const [breedId, setBreedId] = useState(0)
  const [gender, setGender] = useState('')
  const [imagesPath, setImagesPath] = useState('')
  const [price, setPrice] = useState(0)
  

  const navigate = useNavigate()

 
  const cats = useSelector(selectAllCats).cats
  const  cats_breeds = cats.map(cat => cat.name)
  
  const options = cats_breeds.map((cat, index) => {
      return <option key={index} value={cat}>{cat}</option>
  })

  const onSubmit = (e) => {
    e.preventDefault()
    fetch('http://localhost:3000/sell-cat', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: 
            JSON.stringify({price, gender, age, breedId, imagesPath, name})
        
    })
    .then(res => res.json())
    .then(data => 
      {
      if( data.message === 'You must be logged in to sell a cat') {
        navigate('/login')
        return false
      }}
    )
    .catch(err => 
      console.log(err)
      )
    
      /**This will expect to have a message back with the date of sale estabilished
    the  basic other information that have been set by the seller*/
  }

  const handleChange = (e) => {
    e.preventDefault()
    const setters = {
        name: setName,
        sellerName: setSellerName,
        age: setAge,
        breedId: setBreedId,
        imagesPath: setImagesPath,
        price: setPrice
    }
    if(e.target.name === 'breedId') {
      setters[e.target.name](cats_breeds.indexOf(e.target.value) + 1)
    console.log(e.target)
    } else {
     setters[e.target.name](e.target.value)
    }
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
          <select name="breedId" value={breedId} onChange={handleChange}>
              {options}
          </select>
          <div>
          <label htmlFor="male">
            <input type="radio" name="gender" id="male" value="male"  onClick={() => setGender("male")} />
          Male</label>
          <label htmlFor="female">
            <input type="radio" name="gender" id="female" value="female"  onClick={() => setGender("female")} />
          Female</label>
          </div>
          <button type="submit"> button </button>
      </form>
    </div>
  )
}

export default NewCatForSale