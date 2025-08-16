import './App.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';


import API from './pages/API';
import Compliance from './pages/Compliance';
import Contact from './pages/Contact';
import Features from './pages/Features';
import FraudAi from './pages/FraudAi';
import Home from './pages/Home';
import Simulator from './pages/Simulator';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Home />}>
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Compliance" element={<Compliance />} />
      <Route path="/Features" element={<Features />} />
      <Route path="/FraudAi" element={<FraudAi />} />
      <Route path="/Simulator" element={<Simulator />} />
      <Route path="/API" element={<API />} />
       
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
