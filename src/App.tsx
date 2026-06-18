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
import VendorLanding from './pages/vendor/VendorLanding';
import VendorAbout from './pages/vendor/VendorAbout';
import VendorVibe from './pages/vendor/VendorVibe';
import VendorStall from './pages/vendor/VendorStall';
import VendorTerms from './pages/vendor/VendorTerms';
import VendorCuration from './pages/vendor/VendorCuration';
import VendorRichmond from './pages/vendor/VendorRichmond';
import VendorApply from './pages/vendor/VendorApply';
import SubsLanding from './pages/subs/SubsLanding';
import SubsSpace from './pages/subs/SubsSpace';
import SubsScope from './pages/subs/SubsScope';
import SubsUtilities from './pages/subs/SubsUtilities';
import ScrollToTop from './components/ScrollToTop';
import { ModelProvider } from './utils/ModelContext';

function App() {
  return (
    <ModelProvider>
      <ScrollToTop />
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
        <Route path="/vendors" element={<VendorLanding />} />
        <Route path="/vendors/about" element={<VendorAbout />} />
        <Route path="/vendors/vibe" element={<VendorVibe />} />
        <Route path="/vendors/stall" element={<VendorStall />} />
        <Route path="/vendors/terms" element={<VendorTerms />} />
        <Route path="/vendors/curation" element={<VendorCuration />} />
        <Route path="/vendors/richmond" element={<VendorRichmond />} />
        <Route path="/vendors/apply" element={<VendorApply />} />
        <Route path="/subs" element={<SubsLanding />} />
        <Route path="/subs/space" element={<SubsSpace />} />
        <Route path="/subs/utility-loads" element={<SubsUtilities />} />
        <Route path="/subs/:slug" element={<SubsScope />} />
      </Routes>
    </ModelProvider>
  );
}

export default App;
