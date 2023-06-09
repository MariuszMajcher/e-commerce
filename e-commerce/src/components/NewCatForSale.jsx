import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAllCats } from '../store/catsSlice'
import { useNavigate } from 'react-router-dom'
import { selectLoggedIn, selectUser } from '../store/userSlice'
import '../styling/NewCatForSale.css'

import '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'



const NewCatForSale = () => {
  const [name, setName] = useState('')
  const [DoB, setDoB] = useState('')
  const [breedId, setBreedId] = useState(0)
  // state of breed is used to set the value of the dropdown only! Not nescessary for post request
  const [breed, setBreed] = useState('')
  const [gender, setGender] = useState('')
  const [price, setPrice] = useState(0)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCat, setIsCat] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [goodToSell, setGoodToSell] = useState(false)
 
  useEffect(() => {
    if (name && DoB && breedId && breed && gender && price && imageFile && isCat) {
      setGoodToSell(true)
    } else {
      setGoodToSell(false)
    }
  }, [name, DoB, breedId, breed, gender, price, imageFile, isCat])
  
  
  const navigate = useNavigate()

  // array of cat objects from the store
  const cats = useSelector(selectAllCats).cats

  // array of cat objects for use in the dropdown
  const cats_breeds = cats.map(cat => cat.name)
  
  // boolean to check if user is logged in
  const loggedIn = useSelector(selectLoggedIn)

  // user id
  const userId = useSelector(selectUser).id

  const performCatImageRecognition = async (imageElement) => {
    // Load the MobileNet model
    const model = await mobilenet.load();
    
    // Get the predictions for the image
    const predictions = await model.classify(imageElement);
    
    // Check if any of the predictions include "cat"
    const isCatImage = predictions.some(prediction => prediction.className.includes('cat'));
    
    // Return the result
    return isCatImage;
  };
  
 
  
  // array of options for the dropdown
  const options = cats_breeds.map((cat, index) => {
      return <option key={index} value={cat}>{cat}</option>
  })

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
  
    // Use FileReader API to convert the selected file to a data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      setImageFile(file);
      setImagePreview(e.target.result);
  
      // Create an image element to pass to the cat image recognition function
      const imageElement = document.createElement('img');
      imageElement.src = e.target.result;
  
      // Perform cat image recognition
      const isCatImage = await performCatImageRecognition(imageElement);
      setIsCat(isCatImage)
      setLoaded(true)
      console.log( isCat);
  
     
    };
    reader.readAsDataURL(file);
  };
  

    const onSubmit = (e) => {
      e.preventDefault()

      if(gender === 'Select a breed') {
        return false
      }

      // if user is not logged in, redirect to login page
      if(!loggedIn) {
        navigate('/login')
        return false
      }
      // Get the current date in the format "YYYY-MM-DD"
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      // Create a new FormData object for the image
      const formData = new FormData();
      formData.append('imageFile', imageFile);
      formData.append('userId', userId);
      formData.append('price', price);
      formData.append('gender', gender);
      formData.append('DoB', DoB);
      formData.append('date', date);
      formData.append('breedId', breedId);
      formData.append('name', name);
      console.log(date, DoB)
      
      // if user is logged in, send the data to the server
      fetch('http://localhost:3000/sell-cat', {
          method: 'POST',
          body: formData
      })
      .then(res => res.json())
      .then(data => 
        {
          // if user is not logged in, redirect to login page, its another check
        if( data.message === 'You must be logged in to sell a cat') {
          navigate('/login')
          return false
        } else {
          navigate('/cats-shop')
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
        DoB: setDoB,
        breed: setBreed,
        price: setPrice,
        gender: setGender,

    }
    
    // if the target is the dropdown, find the cat object in the array of cats and set the breedId to the id of the cat
    if(e.target.name === 'breedId') {
      if(e.target.value === 'Select a Breed') {
        return false
      }
      const bID = cats.find(cat => cat.name === e.target.value).id
      // set the breed to the value of the dropdown
      setBreed(e.target.value)
      // set the breedId to the id of the cat
      setBreedId(bID)
    } else  {
     setters[e.target.name](e.target.value)
    }
  }

  // does not redirect to a cat shop atm
  return (
    <div className='sale_container'>
        <form onSubmit={onSubmit}>
          <input type="text" name="name" value={name} placeholder="Cats name" onChange={handleChange} required/>
          {/* AGE WILL BE SET BY CHECKING THE DOB */}
          <input type="date"  name="DoB" value={DoB} placeholder="DoB of your cat" onChange={handleChange} required/>
          <input type="number" name="price"  value={price} placeholder="Price" onChange={handleChange} required/>
          <select name="breedId" value={breed} onChange={handleChange} required>
            <option value="Select a Breed"  aria-hidden="true">Select a breed</option>
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
          <div className="image-prev">
            {imagePreview && <img src={imagePreview} alt="Selected Image Preview" />}
          </div>
          {!isCat && loaded && <div style={{ 'color': 'red'}}>The picture must be of a cat!</div>}
          <input className='input_image' type="file" accept="image/*" onChange={handleFileInputChange} required/> 
          <button type="submit" disabled={!goodToSell}> Sell Cat! </button>
      </form>
    </div>
  )
}

export default NewCatForSale
