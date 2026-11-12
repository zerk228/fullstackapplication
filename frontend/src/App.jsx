import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Home from './components/Home/Home.jsx'
import Dealers from './components/Dealers/Dealers.jsx'
import DealerDetails from './components/DealerDetails/DealerDetails.jsx'
import PostReview from './components/PostReview/PostReview.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import { useState, useEffect } from 'react'

function App() {
  const [user, setUser] = useState(() => {
    const stored = window.localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <>
      <Header user={user} setUser={setUser} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/dealer/:id" element={<DealerDetails user={user} />} />
          <Route path="/postreview/:id" element={<PostReview user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <footer className="app-footer">
        &copy; 2026 Cars Dealership Review Application
      </footer>
    </>
  )
}

export default App
