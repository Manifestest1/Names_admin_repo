import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CTable, 
  CTableHead,
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell,
} from '@coreui/react';
import { NavLink } from 'react-router-dom';

const Godnames = () => {
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);

  const [name, setName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editID, setEditID] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [serialNumbers, setSerialNumbers] = useState([]);
  // Add new state to manage the visibility of the pop-up window
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupVisibleDelete, setPopupVisibleDelete] = useState(false);
  const [pagesize,setPagesize] = useState(5);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const response = await axios.get('http://localhost:8000/api/godlinks', { params: { pagesize }, headers });
      setTableData(response.data);
      setPaginationLinks(response.data.links);
      setIsLoading(false);
      console.log(response.data,"Godname Links")
      setSerialNumbers(Array.from({ length: response.data.length }, (_, index) => index + 1));
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      setTableData([]);
    }
  };
  const handlePageClick = async (url) => {
    try {
      const response = await axios.get(url);
      setTableData(response.data);
      setPaginationLinks(response.data.links);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

   // Calculate serial number based on current page and items per page
   const calculateSerialNumber = (index) => {
    const currentPage = tableData.current_page;
    const itemsPerPage = tableData.per_page;
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  const deleteData = async (idToDelete) => {
    // Show confirmation pop-up instead of using window.confirm
    setEditID(idToDelete);
    setPopupVisibleDelete(true);
  };
  
  const handleDeleteConfirmation = async () => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      await axios.get(`http://localhost:8000/api/delete_godnames/${editID}`, { headers });
      // Filter out the deleted item from tableData
      const newData = tableData.data.filter(item => item.id !== editID);
      setTableData({ ...tableData, data: newData });
      setShowAlert(true);
      // Close the pop-up modal after deletion
      setPopupVisibleDelete(false); // Close the delete confirmation modal
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEditButtonClick = (id) => {
    const itemToEdit = tableData.data.find(item => item.id === id);
    setName(itemToEdit.godname);
    setEditID(id);
    setVisible(true);
  };

  const handleFormClose = () => {
    setVisible(false);
    setName('');
    setEditID(null);
    setErrors({});
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.godname = "Name is required";
    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (editID) 
      {
        await axios.post(`http://localhost:8000/api/update_godnames/${editID}`, { name }, { headers });
        fetchData();
      } 
      else 
      {
        await axios.post(`http://localhost:8000/api/add_godnames`, { name }, { headers });
        fetchData();
      }
      setVisible(false);
      setName('');
      setEditID(null);
      setErrors({}); 
      
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = Array.isArray(tableData.data) 
  ? tableData.data.filter(item => item.godname && item.godname.toLowerCase().includes(searchQuery.toLowerCase())) 
  : [];
  return (
    <>
      <h1>God Names</h1>
      <div className="d-flex mt-4">
        <input type="text" placeholder="Search..." className="form-control" id='god-1' value={searchQuery} onChange={handleSearchChange} />
        <CButton color="secondary" className="ml-2" onClick={() => setVisible(true)}>Add</CButton>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CTable striped className="table mt-4">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Serial No.</CTableHeaderCell>
              <CTableHeaderCell scope="col">God Names</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
          {filteredData.map((data, index) => (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{calculateSerialNumber(index)}</CTableHeaderCell>
                <CTableDataCell>
                <NavLink to={`/allnamesofgod/${data.id}?godname=${encodeURIComponent(data.godname)}`}>{data.godname}</NavLink>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton id='god-2' className="mr-2" onClick={() => handleEditButtonClick(data.id)}>Edit</CButton>
                  <CButton color="secondary" onClick={() => deleteData(data.id)}>Delete</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}

            
          </CTableBody>
        </CTable>
      )}
          <div id='god-3'>
            {/* Render pagination links */}
            {paginationLinks.map((link, index) => (
              <CButton
                key={index}
                onClick={() => handlePageClick(link.url)}
                disabled={!link.url} // Disable button if url is null
                >
                {/* Remove &laquo; and &raquo; symbols */}
                {link.label.replace('&laquo;', '').replace('&raquo;', '')}
              </CButton>
            ))}
          </div>

      <CModal
        visible={visible || popupVisible} // Update visibility based on state
        onClose={() => { setVisible(false); setPopupVisible(false); }} // Close modal on cancel button click
        aria-labelledby="AddNameModal"
      >
        <CModalHeader closeButton>
          <CModalTitle id="AddNameModal">Add God Names</CModalTitle> 
        </CModalHeader>
        <CModalBody>
          <form  onSubmit={handleFormSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className={`form-control ${errors.godname ? 'is-invalid' : ''}`}
            />
            {errors.godname && <div className="text-danger">{errors.godname}</div>}
          </label>
            <div className="row justify-content-end mt-3">
              <div className="col-auto">
              <CButton type="submit" id='god-4'>{editID ? 'Save' : 'Submit'}</CButton>

              </div>
              <div className="col-auto">
                <CButton color="secondary" onClick={() => { setVisible(false); setPopupVisible(false); setName(''); }}>Close</CButton>
              </div>
            </div>
          </form>
        </CModalBody>
      </CModal>

      <CModal
        visible={visibleDelete || popupVisibleDelete} // Update visibility based on state
        onClose={() => { setVisibleDelete(false); setPopupVisibleDelete(false); }} // Close modal on cancel button click
        aria-labelledby="DeleteConfirmationModal"
      >
        <CModalHeader closeButton>
          <CModalTitle id="DeleteConfirmationModal">Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete?</p>
          <div className="row justify-content-end mt-3">
            <div className="col-auto">
              <CButton onClick={handleDeleteConfirmation} id='god-5'>Delete</CButton>
            </div>
            <div className="col-auto">
              <CButton color="secondary" onClick={() => { setVisibleDelete(false); setPopupVisibleDelete(false); }}>Close</CButton>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </>
  );
};

export default Godnames;
