import ProfileCard from './components/ProfileCard.jsx'
import './App.css'

function App() {
  const technologies = ['React', 'Vite', 'Tailwind CSS']

  return (
    <main className="app">
      <ProfileCard
        name="Блищик Діана"
        group="КН-311"
        technologies={technologies}
      />
    </main>
  )
}

export default App
