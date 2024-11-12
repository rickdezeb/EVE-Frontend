import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import "./App.css"
import Navbar from './components/Navbar'
import Productpage from './pages/Productpage'
import Editpage from './pages/Edit-product'
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/editpage" element={<Editpage />} />
                <Route path="productpage" element={<Productpage />} />
            </Routes>
            <ToastContainer />
        </div>
    )
}

export default App
