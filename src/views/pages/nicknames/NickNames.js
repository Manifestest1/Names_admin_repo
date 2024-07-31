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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';

const NickNames = () => {
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [gender, setGender] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [nickname, setNickName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editID, setEditID] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [serialNumbers, setSerialNumbers] = useState([]);
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
      const response = await axios.get('http://localhost:8000/api/nickname_index', { params: { pagesize }, headers });
      setTableData(response.data); // Assuming response.data contains the table data
      setPaginationLinks(response.data.links);
      setIsLoading(false);
      console.log(response.data,"Pagination List");
      // Update serial numbers based on the number of users
      setSerialNumbers(Array.from({ length: response.data.length }, (_, index) => index + 1));
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      setTableData([]); // Ensure tableData is set to an empty array in case of an error
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
    setEditID(idToDelete);
    setPopupVisibleDelete(true);
  };
  
  const handleDeleteConfirmation = async () => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      await axios.get(`http://localhost:8000/api/delete_nickname/${editID}`, { headers });
      const newData = tableData.data.filter(item => item.id !== editID);
      setTableData({ ...tableData, data: newData });
      setShowAlert(true);
      setPopupVisibleDelete(false);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  

  const handleEditButtonClick = (id) => {
    const itemToEdit = tableData.data.find(item => item.id === id);
    setNickName(itemToEdit.nickname);
    setSelectedGender(itemToEdit.gender);
    setEditID(id);
    setVisible(true);
  };

  const handleFormClose = () => {
    setVisible(false);
    setNickName('');
    setSelectedGender('');
    setEditID(null);
    setErrors({});
  };

  const handleNameChange = (e) => {
    setNickName(e.target.value);
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (editID) {
        await axios.post(`http://localhost:8000/api/update_nicknames/${editID}`, { nickname, gender: selectedGender }, { headers });
      } else {
        await axios.post('http://localhost:8000/api/add_nickname', { nickname, gender: selectedGender }, { headers });
      }
      fetchData();
      setVisible(false);
      setNickName('');
      setSelectedGender('');
      setEditID(null);
    } catch (error) {
      console.error('Error updating name:', error.response.data);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredData = Array.isArray(tableData.data) ? tableData.data.filter(item => item.nickname.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  return (
    <>
      <h1>Nick Name</h1>
      <div className="d-flex mt-4">
        <input type="text" placeholder="Search..." className="form-control" id='nick1' value={searchQuery} onChange={handleSearchChange} />
        <CButton color="secondary" className="ml-2" onClick={() => setVisible(true)}>Add</CButton>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CTable striped className="table mt-4">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Serial No.</CTableHeaderCell>
              <CTableHeaderCell scope="col">Nick Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map((data, index) => (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{calculateSerialNumber(index)}</CTableHeaderCell>
                <CTableDataCell>{data.nickname}</CTableDataCell>
                <CTableDataCell>{data.gender}</CTableDataCell>
                <CTableDataCell>
                  <CButton id='nick2' className="mr-2" onClick={() => handleEditButtonClick(data.id)}>Edit</CButton>
                  <CButton color="secondary" onClick={() => deleteData(data.id)}>Delete</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      <div id='nick3'>
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
          <CModalTitle id="AddNameModal">Add Name</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form id='forms' onSubmit={handleFormSubmit}>
          <label>Name:</label>
              <input type="text" value={nickname} onChange={handleNameChange} className="form-control" />
            <br /><br />
            <label>Gender:</label><br></br>
              <CDropdown className="col-md-12 form-control">
                <CDropdownToggle id='nick4'>
                  {selectedGender ? selectedGender : 'Select a gender'}
               
                  <CDropdownMenu >
                  <CDropdownItem onClick={() => setSelectedGender('male')}>Male</CDropdownItem>
                  <CDropdownItem onClick={() => setSelectedGender('female')}>Female</CDropdownItem>
                  <CDropdownItem onClick={() => setSelectedGender('unisex')}>Unisex</CDropdownItem>
                </CDropdownMenu>
                </CDropdownToggle>
              </CDropdown>
            
            <div className="row justify-content-end mt-3">
              <div className="col-auto">
              <CButton type="submit" id='nick5'>{editID ? 'Save' : 'Submit'}</CButton>

              </div>
              <div className="col-auto">
                <CButton color="secondary" onClick={() => { setVisible(false); setPopupVisible(false);setNickName('');setSelectedGender(''); }}>Close</CButton>
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
              <CButton onClick={handleDeleteConfirmation} id='nick6'>Delete</CButton>
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


export default NickNames