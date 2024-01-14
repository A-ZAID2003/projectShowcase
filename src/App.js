import React, {useState, useEffect} from 'react'
import Loader from './components/Loader'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const projectsApiUrl = 'https://apis.ccbp.in/ps/projects'

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${projectsApiUrl}?category=${selectedCategory}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setProjects(data.projects)
    } catch (fetchError) {
      setError(fetchError.message)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value)
  }

  const handleRetry = () => {
    fetchData() // Retry fetching data
  }

  return (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png "
        alt="website logo"
      />
      <select value={selectedCategory} onChange={handleCategoryChange}>
        {categoriesList.map(category => (
          <option key={category.id} value={category.id}>
            {category.displayText}
          </option>
        ))}
      </select>

      {isLoading && (
        <div data-testid="loader">
          <Loader />
        </div>
      )}

      {!isLoading && error && (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
            alt="failure view"
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}

      {!isLoading && !error && (
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              <img src={project.image_url} alt={project.name} />
              <p>{project.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
