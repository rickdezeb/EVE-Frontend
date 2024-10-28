import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import "./App.css"
import Navbar from './components/Navbar'
import Productpage from './pages/Productpage'
import Editpage from './pages/Edit-product'

function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/editpage" element={<Editpage />} />
                <Route path="productpage" element={<Productpage />} />
            </Routes>
        </div>
    )
}

export default App
