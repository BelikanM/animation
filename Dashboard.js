import React from 'react';

const Dashboard = ({ updates, setUpdates }) => {
  const handleColorChange = (e) => {
    setUpdates({ ...updates, color: e.target.value });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Tableau de bord</h2>
      <label>
        Couleur:
        <input type="color" value={updates.color} onChange={handleColorChange} />
      </label>
    </div>
  );
};

export default Dashboard;
