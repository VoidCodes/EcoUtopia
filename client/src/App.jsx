import { Component } from 'react';
import './App.css';
import { FaRegUser, FaSearch } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Orders from './pages/Orders';
import EditOrders from './pages/EditOrders';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/" >Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/forum">Forum</Link>
        <Link to="/orders">Orders</Link>
        <div className='Search'>
          <input type="text" placeholder="Search..." />
          <button className='search-button'><FaSearch /></button>
        </div>
        <div className='User'>
          <Link to="/user"><FaRegUser /></Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" />
        <Route path="/orders" element={<Orders />} />
        <Route path={"/editorders/:orderId"} element={<EditOrders/>} />
      </Routes>
    </Router>
  );
}

export default App;
