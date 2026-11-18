import { useLocalStorage } from './useLocalStorage.js'

export default function FavoriteButton({ productId, name }) {
  const [isFavorite, setIsFavorite] = useLocalStorage(
    `favorite:${productId}`,
    false,
  )

  return (
    <button
      type="button"
      className="favorite-button"
      aria-label={`До обраного: ${name}`}
      aria-pressed={isFavorite}
      onClick={() => setIsFavorite(!isFavorite)}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}
