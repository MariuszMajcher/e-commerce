import React from 'react';

const CatItem = ({ name, price, gender, age, id, user_id, images_path, breed_id, date_for_sale }) => {
  return (
    <div className="cat-page">
      <h2>Name: {name}</h2>
      {/* WILL ADD A DESCRIPTION OF THE CAT THAT CAN BE ADDED, IF IT IS NOT ADDED THEN WILL BE DEFAULT FROM DB */}
      <h3>Price: {price}</h3>
      <h3>Gender: {gender}</h3>
      <h3>Age: {age}</h3>
      <h3>Date for sale: {date_for_sale}</h3>
    </div>
  );
};

export default CatItem;