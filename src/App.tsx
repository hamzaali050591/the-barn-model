import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Strategy from './pages/Strategy';
import Model from './pages/Model';
import Layout from './pages/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/strategy" element={<Strategy />} />
      <Route path="/model" element={<Model />} />
      <Route path="/layout" element={<Layout />} />
    </Routes>
  );
}

export default App;
