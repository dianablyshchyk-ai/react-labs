import Link from './Link.jsx'
import { paths } from '../config/paths.js'

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>Сторінку не знайдено</h1>
      <p>
        <Link to={paths.catalog()}>До каталогу</Link>
      </p>
    </section>
  )
}
