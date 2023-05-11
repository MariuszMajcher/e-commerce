import "../styling/CatBreed.css"

const CatBreed = (props) => {
  return (
    <div className="cat-breed">
        <h1>{props.catBreed.name}</h1>
        <p>{props.catBreed.description}</p>
        
    </div>
  )
}

export default CatBreed