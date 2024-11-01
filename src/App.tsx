import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { GameLibrary } from './pages/GameLibrary';
import { GameDetails } from './pages/GameDetails';
import { MusicAnalysis } from './pages/MusicAnalysis';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<GameLibrary />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/analysis/:gameId/:trackId" element={<MusicAnalysis />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;