import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
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

const AllNamesOfGod = () => {
  const { id } = useParams();
  const location = useLocation();
  const godname = new URLSearchParams(location.search).get('godname');

  const [subGodNames, setSubGodNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [newSubGodName, setNewSubGodName] = useState('');
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [popupVisibleDelete, setPopupVisibleDelete] = useState(false);

  useEffect(() => {
    const fetchSubGod = async () => {
      setIsLoading(true); // Set loading state to true while fetching data
      try {
        const headers = { 'Content-Type': 'application/json' };
        const response = await axios.get(`http://localhost:8000/api/subgodindex/${id}`, { headers });
        setSubGodNames(response.data.data);
        console.log(response.data.data);
        setPaginationLinks(response.data.links);
        setIsLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error('Error fetching sub god names:', error);
        setIsLoading(false); // Set loading state to false on error
        setSubGodNames([]); // Clear subGodNames in case of error
      }
    };

    fetchSubGod(); // Call fetchSubGod function when component mounts or id parameter changes
  }, [id]); // Depend on id parameter to refetch data when id changes

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddSubGodName = async () => {
    if (newSubGodName.trim() === '') return;
    try {
      const headers = { 'Content-Type': 'application/json' };
      const response = await axios.post('http://localhost:8000/api/add_subgodname', { name: newSubGodName, god_id: id }, { headers });
      setSubGodNames([...subGodNames, response.data.name]);
      setNewSubGodName('');
      setVisibleAdd(false);
    } catch (error) {
      console.error('Error adding sub god name:', error);
    }
  };

  const handleDeleteConfirmation = () => {
    console.log('Delete confirmed');
    setVisibleDelete(false);
    setPopupVisibleDelete(false);
  };

  const handlePageClick = async (url) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const response = await axios.get(url, { headers });
      setSubGodNames(response.data.data);
      setPaginationLinks(response.data.links);
    } catch (error) {
      console.error('Error fetching paginated data:', error);
    }
  };

  const filteredData = subGodNames.filter(subGod =>
    subGod.subgodname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateSerialNumber = (index) => index + 1;

  return (
    <>
      <h1> Names of {godname}</h1>
      <div className="d-flex mt-4">
        <input
          id="input"
          type="text"
          placeholder="Search..."
          className="form-control"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <CButton color="secondary" className="ml-2" onClick={() => setVisibleAdd(true)}>Add</CButton>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CTable striped className="table mt-4">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Serial No.</CTableHeaderCell>
              <CTableHeaderCell scope="col"> Names of {godname}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map((subGod, index) => (
              <CTableRow key={subGod.id}>
                <CTableHeaderCell scope="row">{calculateSerialNumber(index)}</CTableHeaderCell>
                <CTableDataCell>{subGod.subgodname}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      <div id='god-3'>
        {paginationLinks.map((link, index) => (
          <CButton
            key={index}
            onClick={() => handlePageClick(link.url)}
            disabled={!link.url}
          >
            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
          </CButton>
        ))}
      </div>

      <CModal
        visible={visibleAdd}
        onClose={() => setVisibleAdd(false)}
        aria-labelledby="AddSubGodModal"
      >
        <CModalHeader closeButton>
          <CModalTitle id="AddSubGodModal">Add Name of {godname}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <input
            type="text"
            placeholder="Name"
            value={newSubGodName}
            onChange={(e) => setNewSubGodName(e.target.value)}
            className="form-control"
          />
          <div className="row justify-content-end mt-3">
            <div className="col-auto">
              <CButton id="primary" onClick={handleAddSubGodName}>Add</CButton>
            </div>
            <div className="col-auto">
              <CButton color="secondary" onClick={() => setVisibleAdd(false)}>Cancel</CButton>
            </div>
          </div>
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

export default AllNamesOfGod;
