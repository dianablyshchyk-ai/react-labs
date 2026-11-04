import { useState } from 'react'

function ProfileCard({ name, group, technologies }) {
  const [likes, setLikes] = useState(0)

  return (
    <article className="profile-card">
      <p className="profile-card__eyebrow">Знайомство</p>
      <h1 className="profile-card__title">Про мене</h1>
      <div className="profile-card__details">
        <p className="profile-card__name">{name}</p>
        <p className="profile-card__group">Група {group}</p>
      </div>
      <section className="profile-card__learning">
        <h2>Хочу опанувати</h2>
        <ul className="profile-card__technologies">
          {technologies.map((technology) => (
            <li className="profile-card__technology" key={technology}>
              {technology}
            </li>
          ))}
        </ul>
      </section>
      <button
        className="profile-card__like"
        type="button"
        onClick={() => setLikes((count) => count + 1)}
      >
        Подобається <span aria-label={`${likes} натискань`}>{likes}</span>
      </button>
    </article>
  )
}

export default ProfileCard
