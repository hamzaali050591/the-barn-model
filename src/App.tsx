import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Strategy from './pages/Strategy';
import Model from './pages/Model';
import Layout from './pages/Layout';
import CapEx from './pages/CapEx';
import Opex from './pages/Opex';
import Renderings from './pages/Renderings';
import OpexVendorUtilities from './pages/OpexVendorUtilities';
import OpexCommonUtilities from './pages/OpexCommonUtilities';
import OpexNonUtility from './pages/OpexNonUtility';
import { ModelProvider } from './utils/ModelContext';

function App() {
  return (
    <ModelProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/strategy" element={<Strategy />} />
        <Route path="/model" element={<Model />} />
        <Route path="/model/opex/vendor-utilities" element={<OpexVendorUtilities />} />
        <Route path="/model/opex/common-utilities" element={<OpexCommonUtilities />} />
        <Route path="/model/opex/non-utility" element={<OpexNonUtility />} />
        <Route path="/capex" element={<CapEx />} />
        <Route path="/opex" element={<Opex />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/renderings" element={<Renderings />} />
      </Routes>
    </ModelProvider>
  );
}

export default App;
