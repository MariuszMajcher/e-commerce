import React, { useEffect, useState } from 'react';
import CatItem from './CatItem';

const CatShop = () => {
  const [cats, setCats] = useState([]);

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

  const catItems = cats.map(cat => <CatItem key={cat.id} {...cat} />);
  console.log(catItems);

  return (
    <div>
      Dupa
      {catItems}
    </div>
  );
};

export default CatShop;