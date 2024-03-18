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
      <div className="d-flex mt-4">
        <input type="text" placeholder="Search..." className="form-control" />
        <button
          className="btn btn-primary ml-2"
          onClick={handleAddButtonClick}
        >
          Add
        </button>
      </div>

      <table className="table mt-4">
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
                <button className="btn btn-info mr-2">Edit</button>
                <button className="btn btn-warning">Delete</button>
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
              <input type="text" value={name} onChange={handleNameChange} className="form-control" />
            </label>
            <input type="submit" value="Submit" className="btn btn-primary mt-3" />
          </form>
        </div>
      )}
    </>
  );
};

export default Dashboard;
