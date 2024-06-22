import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for HTTP requests
import { useParams, useLocation } from 'react-router-dom';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from '@coreui/react';

const AllNamesOfGod = () => {
  console.log('Component rendered');
  const { id } = useParams();
  const location = useLocation();
  const godname = new URLSearchParams(location.search).get('godname');

  const [subGodNames, setSubGodNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [newSubGodName, setNewSubGodName] = useState('');
  const [paginationLinks, setPaginationLinks] = useState([]);
  
  useEffect(() => {
    const fetchSubGod = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        const response = await axios.get('http://localhost:8000/api/show_subgodnames', { headers });
        setSubGodNames(response.data.data);
      }
      catch(error){
        console.error('Error fetching sub god names:', error);
      }
      setIsLoading(false);
    };

    fetchSubGod();
  }, [id]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddSubGodName = async () => {
    if (newSubGodName.trim() === '') return;
    try {
      const headers = { 'Content-Type': 'application/json' };
      const response = await axios.post('http://localhost:8000/api/add_subgod_names', { name: newSubGodName }, { headers });
      setSubGodNames([...subGodNames, response.data.name]);
      setNewSubGodName('');
      setVisible(false);
    }
    catch(error) {
      console.error('Error adding sub god name:', error);
    }
  };

  const filteredData = subGodNames.filter(subGod => 
    subGod.subgodname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateSerialNumber = (index) => index + 1;

  const handlePageClick = (url) => {
    // Handle pagination click
  };

  return (
    <>
        <h1>{godname} Ji  Names</h1>
        <div className="d-flex mt-4">
          <input
            type="text"
            placeholder="Search..."
            className="form-control"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <CButton color="secondary" className="ml-2" onClick={() => setVisible(true)}>Add</CButton>
        </div>

        {isLoading ? (
            <p>Loading...</p>
        ) : (
            <CTable striped className="table mt-4">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Serial No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">{godname} Ji Names</CTableHeaderCell>
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
        
        {visible && (
            <div className="modal">
              <div className="modal-content">
                <h2>Add Sub God Name</h2>
                <input
                  type="text"
                  placeholder="Sub God Name"
                  value={newSubGodName}
                  onChange={(e) => setNewSubGodName(e.target.value)}
                />
                <CButton color="primary" onClick={handleAddSubGodName}>Add</CButton>
                <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
              </div>
            </div>
        )}
    </>
  );
};

export default AllNamesOfGod;
