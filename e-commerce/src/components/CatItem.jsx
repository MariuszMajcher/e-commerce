import { useState, useEffect } from 'react';
import '../styling/CatItem.css'

const CatItem = (props) => {

  const { name, price, gender, date_of_birth, id, user_id, images_path, breed_id, date_for_sale } = props.cat
  // find the breed object that matches the breed_id
  const breed = props.breeds.find(breed => breed.id === breed_id)
  // if price is 0, then set price to free
  if(price === 0) {
    price = 'Free'
  }
  const age = Math.floor((new Date() - new Date(date_of_birth)) / 31536000000 * 12);
  let onSale = Math.floor((new Date() - new Date(date_for_sale)) / 1000 / 60  );
  let onSaleTimeString
  console.log(onSale)
  if (onSale > 60 * 24 ) {
    onSale = onSale / 60 / 24
    console.log(onSale)
    onSaleTimeString = `${onSale} days ago.`
  } else if(onSale > 60 ) {
    onSale = onSale / 60 
    console.log(onSale)
    onSaleTimeString = `${onSale} hours ago.`
  } else {
    onSaleTimeString = `${onSale} minutes ago.`
  }
// Need to sort out the timing calculation

  return (
    <div className="cat-page">
      <h2>Name: {name}</h2>
      <h3>Breed: {breed['name']}</h3>
      <h3>Price: £ {price} </h3>
      <h3>Gender: {gender}</h3>
      <h3>Age: {age} months</h3>
      <h3>Placed on sale: {onSaleTimeString}</h3>
      <p>Description: {breed['description']}</p>
    </div>
  );
};

export default CatItem;