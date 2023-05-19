import { useState, useEffect } from 'react';
import {Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { loadBuy } from '../store/buyingCatSlice';
import '../styling/CatItem.css'

const CatItem = (props) => {

  const { name, price, gender, date_of_birth, id, user_id, images_path, breed_id, date_for_sale } = props.cat

  const  dispatch = useDispatch()


  let priceString 
  // find the breed object that matches the breed_id
  const breed = props.breeds.find(breed => breed.id === breed_id)
  // if price is 0, then set price to free
  if(price === 0) {
    priceString = 'Free'
  } else {
    priceString = price
  }
  const age = Math.floor((new Date() - new Date(date_of_birth)) / 31536000000 * 12);

  // The time ago calculation
  let onSale = Math.floor((new Date() - new Date(date_for_sale)) / 1000 / 60  );
  let onSaleTimeString
  console.log(onSale)
  if (onSale > 60*24*60) {
    onSale = Math.floor(onSale / 60 / 24 / 30) 
    onSaleTimeString = `${onSale} months ago.`
  } else if(onSale > 60*24*30) {
    onSaleTimeString = `More then a month ago.`
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
// Need to sort out the timing calculation

  return (
    <div className="cat-page">
      <h2>Name: {name}</h2>
      <h3>Breed: {breed['name']}</h3>
      <h3>Price: £ {priceString} </h3>
      <h3>Gender: {gender}</h3>
      <h3>Age: {age} months</h3>
      <h3>Placed on sale: {onSaleTimeString}</h3>
      <p>Description: {breed['description']}</p>
      {/* In order for the userID and the cat data to be passed to buy cat component, will need to create a slice
      this slice will be separate from the others, will update on each click of buy button and hold only 
      the data that are associated with that particular sale */}
      <Link to={`/cats-shop/${id}`} onClick={() => dispatch(loadBuy(props.cat))}> Buy Cat </Link>
    </div>
  );
};

export default CatItem;

// I need a button that will allow the customer to buy the cat, 
// this will send a request to the owner the owner simply will be able to accept offer,
// after clicking buy button there will be a form to fill out 
// FORM will have the following fields
// short message to the owner
// value the customer is willing to pay
// the messaging will be done through the request table
// Will need to make changes to the seller table, Need to add a money column
// money column will pretend the money the seller has made from selling cats