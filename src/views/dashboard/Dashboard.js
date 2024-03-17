import React, { useState } from 'react';

const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [tableData, setTableData] = useState([]);

  const handleAddButtonClick = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newData = {
      id: tableData.length + 1, // Generate ID dynamically
      name: name
    };
    setTableData([...tableData, newData]);
    setName('');
    setIsFormOpen(false);
  };

  return (
    <>
      <h1>Name</h1>
      <div style={{ marginTop: '20px', display: 'flex' }}>
        <input type="text" placeholder="Search..." className="form-control" />
        <button
          style={{
            marginLeft: '10px',
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleAddButtonClick}
        >
          Add
        </button>
      </div>

      <table style={{ marginTop: '60px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>
                <button style={{ marginRight: '10px' }}>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Form */}
      {isFormOpen && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 999 }}>
          <span style={{ position: 'absolute', top: '5px', right: '10px', cursor: 'pointer' }} onClick={handleFormClose}>×</span>
          <form onSubmit={handleFormSubmit}>
            <label>
              Name:
              <input type="text" value={name} onChange={handleNameChange} />
            </label>
            <input type="submit" value="Submit" style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }} />
          </form>
        </div>
      )}
    </>
  );
};

export default Dashboard;
