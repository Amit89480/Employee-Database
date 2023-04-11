import React, { useState, useEffect } from 'react';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
 const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = (event) => {
    event.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsAdmin(true);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setUsername("");
    setPassword("");
  };


  useEffect(() => {
    fetch('https://employeebackendapi.up.railway.app/api/employee')
      .then(response => response.json())
      .then(data => {
        setEmployees(data.employee);
       
        setFilteredEmployees(data.employee);
      })
      .catch(error => console.error('Error fetching employee data:', error));
  }, []);

  
  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  
  const handleFilter = (value) => {
    setFilter(value);
  };

 
  const handleSearch = (value) => {
    setSearch(value);
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

 
  const renderTableHeader = () => {
    const columns = ['id', 'name', 'department', 'salary'];
    return columns.map(column => (
      <th key={column}>
        {column.toUpperCase()}
        <button className="btn btn-link btn-sm" onClick={() => handleSort(column)}>
          {sortKey === column && sortOrder === 'asc' && (
            <i className="fa fa-caret-up" aria-hidden="true"></i>
          )}
          {sortKey === column && sortOrder === 'desc' && (
            <i className="fa fa-caret-down" aria-hidden="true"></i>
          )}
        </button>
      </th>
    ));
  };

  
  const renderTableRows = () => {
  
    const filteredByDepartment = filter ? filteredEmployees.filter(employee => employee.department === filter) : filteredEmployees;


    const filteredByName = search ? filteredByDepartment.filter(employee => employee.name.toLowerCase().includes(search.toLowerCase())) : filteredByDepartment;

 
    const sortedEmployees = filteredByName.sort((a, b) => {
      if (sortKey) {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (sortOrder === 'asc') {
          if (valA < valB) {
            return -1;
          }
          if (valA > valB) {
            return 1;
          }
        } else {
          if (valA > valB) {
            return -1;
          }
          if (valA < valB) {
            return 1;
          }
        }
      }

     
      return 0;
    });

 
    const totalPages = Math.ceil(sortedEmployees.length / employeesPerPage);

    // Get employees for current page
    const indexOfLastEmployee = currentPage * employeesPerPage;
   
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    // Render table rows
    return currentEmployees.map(employee => (
      <tr key={employee.id}>
        <td>{employee.id}</td>
        <td>{employee.name}</td>
        <td>{employee.department}</td>
        <td>{employee.salary}</td>
      </tr>
    ));
  };


  const renderPagination = () => {
 
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationButtons.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

   
    return (
      <nav aria-label="Employees Pagination">
        <ul className="pagination justify-content-center">
          {paginationButtons}
        </ul>
      </nav>
    );
  };

  return (
    <div className="container">
    {isAdmin ? (
      
     
        <div className="col-md-6 offset-md-3">
          <button className="btn btn-secondary my-3" onClick={handleLogout}>
            Logout
          </button>
      <h1>Employee Table</h1>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="filterSelect">Filter by Department:</label>
            <select
              id="filterSelect"
              className="form-control"
              onChange={(e) => handleFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="searchInput">Search by Name:</label>
            <input
              id="searchInput"
              type="text"
              className="form-control"
              placeholder="Search by name"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <table className="table">
            <thead>
              <tr>{renderTableHeader()}</tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
          {renderPagination()}
        </div>
      </div>
    
      </div>
   
  ):(
    <div className="row">
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center my-5">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  </div>

 
)}
    </div>

  
   
   
    
    
  );
};

export default EmployeeTable;
