import { useSelector } from "react-redux"
import { selectAllCats } from "../store/catsSlice"
import CatBreed from "./CatBreed"

const CatBreeds = () => {
    const cats = useSelector(selectAllCats)
    Object.entries(cats).map(cat => <CatBreed catBreed={cat} />)
    
  return (
    <div>
        {cats}
    </div>
  )
}

export default CatBreeds