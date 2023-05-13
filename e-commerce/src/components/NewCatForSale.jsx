import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAllCats } from '../store/catsSlice'
import { useNavigate } from 'react-router-dom'
import { selectLoggedIn, selectUser } from '../store/userSlice'



const NewCatForSale = () => {
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [breedId, setBreedId] = useState(0)
  // state of breed is used to set the value of the dropdown only! Not nescessary for post request
  const [breed, setBreed] = useState('')
  const [gender, setGender] = useState('')
  const [imagesPath, setImagesPath] = useState('')
  const [price, setPrice] = useState(0)
  
  
  const navigate = useNavigate()

  // array of cat objects from the store
  const cats = useSelector(selectAllCats).cats

  // array of cat objects for use in the dropdown
  const cats_breeds = cats.map(cat => cat.name)
  
  // boolean to check if user is logged in
  const loggedIn = useSelector(selectLoggedIn)

  // user id
  const userId = useSelector(selectUser).id
 
  
  // array of options for the dropdown
  const options = cats_breeds.map((cat, index) => {
      return <option key={index} value={cat}>{cat}</option>
  })



    const onSubmit = (e) => {
      e.preventDefault()
      // if user is not logged in, redirect to login page
      if(!loggedIn) {
        navigate('/login')
        return false
      }
      // if user is logged in, send the data to the server
      fetch('http://localhost:3000/sell-cat', {
          method: 'POST',
          headers: {
              'Content-type': 'application/json'
          },
          body: 
              JSON.stringify({userId, price, gender, age, breedId, imagesPath, name})
          
      })
      .then(res => res.json())
      .then(data => 
        {
          // if user is not logged in, redirect to login page, its another check
        if( data.message === 'You must be logged in to sell a cat') {
          navigate('/login')
          return false
        }}
      )
      .catch(err => 
        console.log(err)
        )
    }
  

  const handleChange = (e) => {
    e.preventDefault()
    // all the setters that will be used in the handleChange function
    const setters = {
        name: setName,
        age: setAge,
        imagesPath: setImagesPath,
        breed: setBreed,
        price: setPrice
    }
    console.log(breedId)
    // if the target is the dropdown, find the cat object in the array of cats and set the breedId to the id of the cat
    if(e.target.name === 'breedId') {
      const bID = cats.find(cat => cat.name === e.target.value).id
      // set the breed to the value of the dropdown
      setBreed(e.target.value)
      // set the breedId to the id of the cat
      setBreedId(bID, console.log(breedId))
      
    } else {
     setters[e.target.name](e.target.value)
    }
  }


// date of cat being put on sale can be done on the server side
/*DATE STILL NOT DONE 13/05/2023 */
  return (
    <div>
        <form onSubmit={onSubmit}>
          <input type="text" name="name" value={name} placeholder="Cats name" onChange={handleChange} required/>
          <input type="number" name="age" value={age} placeholder="Age of your cat" onChange={handleChange} required/>
          <input type="text" value={imagesPath} name="imagesPath" placeholder="Path to your cat's image" onChange={handleChange} required/>
          <input type="number" name="price" value={price} placeholder="Price" onChange={handleChange} required/>
          <select name="breedId" value={breed} onChange={handleChange} required>
              {options}
          </select>
          <div>
          <label htmlFor="male">
            <input type="radio" name="gender" id="male" value="male"  onClick={() => setGender("male")} required />
          Male</label>
          <label htmlFor="female">
            <input type="radio" name="gender" id="female" value="female"  onClick={() => setGender("female")} required />
          Female</label>
          </div>
          <button type="submit"> Sell Cat! </button>
      </form>
    </div>
  )
}

export default NewCatForSale

// the breedID is throwing an error, it's not being set to the correct value