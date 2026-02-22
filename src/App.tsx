import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/region/:code" element={<ResultPage />} />
      </Routes>
    </Router>
  )
}

export default App
