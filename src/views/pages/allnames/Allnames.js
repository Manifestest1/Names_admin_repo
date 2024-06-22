import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const Allnames = () => {
  const inputRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [religions, setReligions] = useState([]);
  const [selectedReligion, setSelectedReligion] = useState('');
  const [selectedReligionName, setSelectedReligionName] = useState('');
  const [gender, setGender] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [name, setName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editID, setEditID] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [description, setDescription] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupVisibleDelete, setPopupVisibleDelete] = useState(false);
  const [pagesize, setPagesize] = useState(5);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    fetchReligions();
  }, []);

  useEffect(() => {
    if (visible || popupVisible) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300); // Delay to ensure modal is rendered
    }
  }, [visible, popupVisible]);

  const setInputRef = useCallback((node) => {
    if (node !== null) {
      inputRef.current = node;
    }
  }, []);

  const fetchData = async () => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const response = await axios.get('http://localhost:8000/api/links', { params: { pagesize }, headers });
      setTableData(response.data); // Assuming response.data contains the table data
      setPaginationLinks(response.data.links);
      setIsLoading(false);
      console.log(response.data, "Pagination List");
      // Update serial numbers based on the number of users
      setSerialNumbers(Array.from({ length: response.data.length }, (_, index) => index + 1));
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      setTableData([]); // Ensure tableData is set to an empty array in case of an error
    }
  };

  const fetchReligions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/show_religion');
      setReligions(response.data, "all Rel"); // Assuming the API returns an array of religions
    } catch (error) {
      console.error('Error fetching religions:', error);
    }
  };

  const handleReligionChange = (e) => {
    setSelectedReligion(e.target.value);
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
      await axios.get(`http://localhost:8000/api/delete_names/${editID}`, { headers });
      // Filter out the deleted item from tableData
      const newData = tableData.data.filter(item => item.id !== editID);
      // Update tableData with the new data array
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
    console.log(itemToEdit, "Religin id");
    setName(itemToEdit.name);
    setDescription(itemToEdit.description);
    setSelectedReligion(itemToEdit.religion_id);
    setSelectedGender(itemToEdit.gender);
    setSelectedReligionName(itemToEdit.religion);
    setEditID(id);
    setVisible(true);
  };

  const handleFormClose = () => {
    setVisible(false);
    setName('');
    setDescription('');
    setSelectedReligion('');
    setSelectedGender('');
    setEditID(null);
    setErrors({});
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlReligionChange = (e) => {
    setSelectedReligion(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!selectedGender) newErrors.gender = "Gender is required";
    if (!selectedReligion) newErrors.religion = "Religion is required";
    if (!description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (editID) {
        await axios.post(`http://localhost:8000/api/update_names/${editID}`, { name, description, religion: selectedReligion, gender: selectedGender }, { headers });

      }
      else {
        await axios.post(`http://localhost:8000/api/add_names`, { name, description, religion: selectedReligion, gender: selectedGender }, { headers });
      }
      fetchData();
      setVisible(false);
      setName('');
      setDescription('');
      setSelectedReligion('');
      setSelectedGender('');
      setEditID(null);
      setErrors({});
    } catch (error) {
      console.error('Error updating name:', error.response.data);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredData = Array.isArray(tableData.data) ? tableData.data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  return (
    <>
      <h1>Names</h1>
      <div className="d-flex mt-4">
        <input type="text" placeholder="Search..." className="form-control" id='name-1' value={searchQuery} onChange={handleSearchChange} />
        <CButton color="secondary" className="ml-2" onClick={() => { setVisible(true); setEditID(null); setPopupVisible(false); setPopupVisibleDelete(false); }}>Add</CButton>
      </div>


      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CTable striped className="table mt-4">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Serial No.</CTableHeaderCell>
              <CTableHeaderCell scope="col">Names</CTableHeaderCell>
              <CTableHeaderCell scope="col">Description</CTableHeaderCell>
              <CTableHeaderCell scope="col">Religion</CTableHeaderCell>
              <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map((data, index) => (
              <CTableRow key={data.id}>
                <CTableHeaderCell scope="row">{calculateSerialNumber(index)}</CTableHeaderCell>
                <CTableDataCell>{data.name}</CTableDataCell>
                <CTableDataCell>{data.description}</CTableDataCell>
                <CTableDataCell>{data.religion}</CTableDataCell>
                <CTableDataCell>{data.gender}</CTableDataCell>
                <CTableDataCell>
                  <CButton id='name-2' className="mr-2" onClick={() => handleEditButtonClick(data.id)}>Edit</CButton>
                  <CButton color="secondary" onClick={() => deleteData(data.id)}>Delete</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      <div id='name-3'>
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
          <CModalTitle id="AddNameModal">{editID ? 'Edit Name' : 'Add Name'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form id='forms' onSubmit={handleFormSubmit}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="form-control"
              autoFocus
              ref={setInputRef} // Assign the callback ref here
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
            <div id='mt-1'>
              <label>Gender:</label><br></br>
              <CDropdown  className="col-md-12 form-control ">
                <CDropdownToggle id='name-6'>
                  {selectedGender ? selectedGender : 'Select a gender'}
  
                  <CDropdownMenu >
                    <CDropdownItem onClick={() => setSelectedGender('male')}>Male</CDropdownItem>
                    <CDropdownItem onClick={() => setSelectedGender('female')}>Female</CDropdownItem>
                    <CDropdownItem onClick={() => setSelectedGender('unisex')}>Unisex</CDropdownItem>
                  </CDropdownMenu>
                </CDropdownToggle>
              </CDropdown>
              {errors.gender && <div className="text-danger">{errors.gender}</div>}
            </div>
            <div id='mt-2'>
              <label>Religion:</label>
              <CDropdown className="col-md-12 form-control " >
                <CDropdownToggle id='name-7'>
                  {selectedReligion ? selectedReligionName : 'Select a religion'}
                </CDropdownToggle>
                <CDropdownMenu>
                  {religions.map((religion) => (
                    <CDropdownItem
                      key={religion.id}
                      onClick={() => {
                        setSelectedReligion(religion.id); // Set the selected religion ID
                        setSelectedReligionName(religion.religion); // Set the selected religion name
                      }}
                      id='name-8'
                    >
                      {religion.religion}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              {errors.religion && <div className="text-danger">{errors.religion}</div>}
            </div>

            <div id='mt-3'>
              <label> Description:</label>
              <input type="text" value={description} onChange={handleDescriptionChange} className="form-control " />
              {errors.description && <div className="text-danger">{errors.description}</div>}
            </div>

            <div className="row justify-content-end mt-3">
              <div className="col-auto">
                <CButton type="submit" id='name-4'>{editID ? 'Save' : 'Submit'}</CButton>

              </div>
              <div className="col-auto">
                <CButton color="secondary" onClick={() => { setVisible(false); setPopupVisible(false);setName('');setDescription('');setSelectedReligion('');setSelectedGender(''); }}>Close</CButton>
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
              <CButton onClick={handleDeleteConfirmation} id='name-5'>Delete</CButton>
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

export default Allnames;
