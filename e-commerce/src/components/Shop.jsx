import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadProducts } from '../store/shopSlice'
import { selectShop } from '../store/shopSlice'

const Shop = () => {

    const dispatch = useDispatch()
    const shop = useSelector(selectShop)
    const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/products')
    .then(res => res.json())
    .then(data => {
        dispatch(loadProducts(data))
    })
    }, [])
    
    useEffect(() => {
        setProducts(shop)
    }, [shop])

    const categories = {
        1: 'Toys',
        2: 'Food',
        3: 'Beds',
        4: 'Litter'
    }


    const categoriesNames = products.map(product => <>categories[product.category]</li>)

  return (
    <div>
        Shop
        <ul>
            {categoriesNames}
        </ul>
    </div>
  )
}

export default Shop

// Need to think it through, maube will start from scratch
// this one might just be doing the cat sales, not the shop
// next one might just do the shop, although it would be looking good to have these two together