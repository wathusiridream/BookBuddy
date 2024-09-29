import React from 'react'
import '../WebStyle/LessorsDashboard.css'; // เพิ่มไฟล์ CSS

function Lessors_Dashboard() {


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <nav>
          <ul>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/rent-items">Rent Items</a></li>
            <li><a href="/my-rentals">My Rentals</a></li>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </nav>
      </header>
      <main className="dashboard-main">
        <section className="dashboard-summary">
          <h2>Your Summary</h2>
          <div className="summary-cards">
            <div className="card">
              <h3>Total Items Rented</h3>
              <p>12</p>
            </div>
            <div className="card">
              <h3>Active Rentals</h3>
              <p>3</p>
            </div>
            <div className="card">
              <h3>Pending Requests</h3>
              <p>5</p>
            </div>
          </div>
        </section>
        <section className="dashboard-recent-activities">
          <h2>Recent Activities</h2>
          <ul>
            <li>Rented out "Camera" on 2023-09-20</li>
            <li>Returned "Projector" on 2023-09-18</li>
            <li>Received request for "Lawnmower" on 2023-09-15</li>
          </ul>
        </section>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Lessors_Dashboard