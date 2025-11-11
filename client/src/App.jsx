import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Analytics from './pages/Analytics';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import Search from './pages/Search';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Fullstack App</h1>
          <nav>
            <a href="/">Home</a> | <a href="/about">About</a> | <a href="/analytics">Analytics</a> | <a href="/advanced-analytics">Advanced Analytics</a> | <a href="/search">Search</a>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;