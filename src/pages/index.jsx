import Layout from "./Layout.jsx";

import Inbox from "./Inbox";

import Settings from "./Settings";

import Compose from "./Compose";

import Contacts from "./Contacts";

import Tasks from "./Tasks";

import Rules from "./Rules";

import SmartFeatures from "./SmartFeatures";

import Search from "./Search";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Inbox: Inbox,
    
    Settings: Settings,
    
    Compose: Compose,
    
    Contacts: Contacts,
    
    Tasks: Tasks,
    
    Rules: Rules,
    
    SmartFeatures: SmartFeatures,
    
    Search: Search,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Inbox />} />
                
                
                <Route path="/Inbox" element={<Inbox />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Compose" element={<Compose />} />
                
                <Route path="/Contacts" element={<Contacts />} />
                
                <Route path="/Tasks" element={<Tasks />} />
                
                <Route path="/Rules" element={<Rules />} />
                
                <Route path="/SmartFeatures" element={<SmartFeatures />} />
                
                <Route path="/Search" element={<Search />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}