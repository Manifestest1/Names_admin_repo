import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/pages/allnames">Go to All Names</Link>
    </div>
  );
};

export default Dashboard;