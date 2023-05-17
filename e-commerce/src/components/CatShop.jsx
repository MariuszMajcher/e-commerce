import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllCats } from '../store/catsSlice';
import CatItem from './CatItem';
import  '../styling/CatShop.css';

const CatShop = () => {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const allCats = useSelector(selectAllCats)


  useEffect(() => {
    setBreeds(allCats.cats)
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('http://localhost:3000/cats-shop');
        const data = await response.json();
        setCats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCats();
  }, []);

  const catItems = cats.map(cat => <CatItem key={cat.id} cat={cat} breeds={breeds}/>);
  return (
    <div className="cat-shop">
      {catItems}
    </div>
  );
};

export default CatShop;