import GrindPicker from './GrindPicker.jsx'

export default function ProductCard({
  product,
  favoriteButton,
  addToCartButton,
}) {
  return (
    <article className="product-card">
      <div className="product-title">
        <h1>{product.name}</h1>
        {favoriteButton}
      </div>
      <p className="lead">
        {product.origin}, {product.roast}. Ноти: {product.notes.join(', ')}.
      </p>
      <GrindPicker />
      <p className="price">
        {product.price} грн <span>за {product.weight}</span>
      </p>
      {addToCartButton}
    </article>
  )
}
