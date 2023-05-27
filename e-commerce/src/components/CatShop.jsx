import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllCats } from '../store/catsSlice';
import CatItem from './CatItem';
import  '../styling/CatShop.css';

const CatShop = () => {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const allCats = useSelector(selectAllCats)
  
  const containerRef = useRef(null);

  const handleMouseWheel = (e) => {
    e.preventDefault()
    const container = containerRef.current;
    container.scrollLeft += e.deltaY /2
  };

  useEffect(() => {
    setBreeds(allCats.cats)
  }, []);

  // Fetches the data from DB of cats that are for sale and updates the cats state, this is used for the map func
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('https://localhost:3000/cats-shop');
        const data = await response.json();
        setCats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCats();
  }, []);

  const catItems = cats.map(cat => <CatItem 
                                      key={cat.id} 
                                      cat={cat} 
                                      breeds={breeds}
                                      />);
  return (
    <div className="cat-shop"
         ref={containerRef}
         onWheel={handleMouseWheel}>
      {catItems}
    </div>
  );
};

export default CatShop;