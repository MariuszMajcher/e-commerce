import { useState, useEffect } from 'react';
import {Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { loadBuy } from '../store/buyingCatSlice';
import { selectUser } from '../store/userSlice';
import '../styling/CatItem.css'


const CatItem = (props) => {

  let { name, price, gender, date_of_birth, id, user_id, images_path, breed_id, date_for_sale } = props.cat

  const [owner, setOwner] = useState(false)

  const  dispatch = useDispatch()
  const user = useSelector(selectUser)

  useEffect(() => {
    setOwner(user.id == user_id)
  }, [])
  
  if (!images_path) {
    images_path = 'uploads/smoke.jpg'
  }

  let priceString 
  // find the breed object that matches the breed_id
  const breed = props.breeds.find(breed => breed.id === breed_id)
  // if price is 0, then set price to free
  if(price === 0) {
    priceString = 'Free'
  } else {
    priceString = price
  }

  let ageString
  let age = Math.floor((new Date() - new Date(date_of_birth)) / 31536000000 * 12);
  if( age > 12 ) {
    age = Math.floor(age / 12)
    ageString = `${age} years`
  } else {
    ageString = `${age} months`
  } 

  // The time ago calculation
  let onSale = Math.floor((new Date() - new Date(date_for_sale)) / 1000 / 60  );
  let onSaleTimeString

  if (onSale > 60*24*60) {
    onSale = Math.floor(onSale / 60 / 24 / 30) 
    onSaleTimeString = `${onSale} months ago.`
  } else if(onSale > 60*24*30) {
    onSaleTimeString = `More than a month ago.`
  } else if (onSale > 60 * 24 ) {
    onSale = Math.floor(onSale / 60 / 24)
    console.log(onSale)
    onSaleTimeString = `${onSale} days ago.`
  } else if(onSale > 60 ) {
    onSale = Math.floor(onSale / 60) 
    console.log(onSale)
    onSaleTimeString = `${onSale} hours ago.`
  } else {
    onSaleTimeString = `${onSale} minutes ago.`
  }
  
  return (
    <div className="cat-page" >
      <div style={{backgroundImage: `url(../src/services/${images_path})`, backgroundSize: 'cover', height: "200px"}}></div>
      <h2>Name: {name}</h2>
      <h3>Breed: {breed['name']}</h3>
      <h3>Price: £ {priceString} </h3>
      <h3>Gender: {gender}</h3>
      <h3>Age: {ageString} </h3>
      <h3>Placed on sale: {onSaleTimeString}</h3>
      <p>Description: {breed['description']}</p>
      {!owner && <Link to={`/cats-shop/${id}`} onClick={() => dispatch(loadBuy(props.cat))}> Buy Cat </Link>}
    </div>
  );
};

export default CatItem;
// need to add money column in the users table, that will be money received from sale