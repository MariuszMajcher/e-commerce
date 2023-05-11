import { useSelector } from "react-redux"
import { selectAllCats } from "../store/catsSlice"
import CatBreed from "./CatBreed"
import "../styling/CatBreeds.css"

const CatBreeds = () => {
    const cats = useSelector(selectAllCats).cats
    
    
    const catBreeds = Object.entries(cats).map(([key, value]) => 
     
    <CatBreed key={value.id} catBreed={value} />
    )
    console.log('below')
    console.log(catBreeds)
  return (
    <div className="cat-breeds">
        {catBreeds}
    </div>
  )
}

export default CatBreeds