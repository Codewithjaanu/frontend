import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AllCustomer = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // New filtered data state
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage] = useState(10);
    const [code, setCode] = useState("");

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${apiUrl}/customers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                    return;
                }
                toast.error(errorData.message || "Failed to fetch customers.");
                return;
            }

            const result = await response.json();
            if (result.success) {
                setData(result.data);
                setFilteredData(result.data); // Initially, show all customers
            } else {
                toast.error("Failed to fetch customers.");
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error("Server error while fetching customers.");
        }
    };

    // Get current customers for pagination
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredData.slice(indexOfFirstCustomer, indexOfLastCustomer);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Customer Code Search Function
    const handleSearch = () => {
        if (!code) {
            setFilteredData(data); // Reset if search is empty
        } else {
            const filtered = data.filter((customer) =>
                customer.customerCode.toLowerCase().includes(code.toLowerCase())
            );
            setFilteredData(filtered);
        }
        setCurrentPage(1); // Reset pagination to first page
    };

    // Delete customer function
    const deleteCustomer = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/delete/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                const updatedCustomers = data.filter((customer) => customer._id !== id);
                setData(updatedCustomers);
                setFilteredData(updatedCustomers);
            } else {
                console.error("Failed to delete customer");
            }
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    // 
    const navigate = useNavigate();

    const handleEdit = (customer) => {
        navigate(`/editcustomer/${customer._id}`, { state: { customer } });
    };

    // 

    const exportToExcel = () => {
        if (filteredData.length === 0) {
            toast.warning("No data available to export.");
            return;
        }
        // Filter out unwanted fields and format date
        const formattedData = filteredData.map(({ _id, createdAt, updatedAt, __v, workOrderDate, ...rest }) => ({
            ...rest,
            workOrderDate: workOrderDate ? new Date(workOrderDate).toLocaleDateString("en-GB") : "N/A", // Format date as DD/MM/YYYY
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customer");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "Customer.xlsx");
    };


    return (
        <div className="container mt-1">
            <h5 className="text-center mb-0">All Customers</h5>
            <hr
                style={{
                    borderColor: "black",
                    opacity: "1",
                    width: "12%",
                    borderWidth: "2px",
                    margin: "5px auto"
                }}
            />

            <div className="d-flex justify-content-between align-items-center mb-2 px-4">
                {/* Add New Customer Button */}
                <button className="btn btn-success btn-sm">
                    <Link to="/addcustomer" className="text-white text-decoration-none fs-6">
                        + Add New Customer
                    </Link>
                </button>

                {/* Search Input and Button */}
                <div className="d-flex ">
                    <div className=""><input
                        type="text"
                        className="form-control form-control-sm me-2"
                        placeholder="Search by Customer Code..."
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    /></div>
                    <div className="px-2"><button className="btn btn-primary btn-sm fs-6" onClick={handleSearch}>
                        Search
                    </button></div>
                    <div>                    <button className="btn btn-success btn-sm fs-6" onClick={exportToExcel}>Download Excel</button></div>
                </div>
            </div>

            {filteredData.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                    <h2 className="text-muted">Oops! No Data Available</h2>
                    <p className="text-secondary">There is no data to display at the moment.</p>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover table-sm text-light" style={{ fontSize: "12px" }}>
                            <thead className="table-dark text-light">
                                <tr>
                                    <th>No.</th>
                                    <th>Customer Name</th>
                                    <th>Company Name</th>
                                    <th>Customer Code</th>
                                    <th>Place</th>
                                    <th>Work Order No</th>
                                    <th>Work Order Amount</th>
                                    <th>Work Classification</th>
                                    <th>Work Order Date</th>
                                    <th>Audit Scope</th>
                                    <th>Gst No.</th>
                                    <th>Travel</th>
                                    <th>Remarks</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-dark bg-white">
                                {currentCustomers.map((customer, index) => (
                                    <tr key={customer._id}>
                                        <td>{indexOfFirstCustomer + index + 1}</td>
                                        <td>{customer.customerName}</td>
                                        <td>{customer.companyName}</td>
                                        <td>{customer.customerCode}</td>
                                        <td>{customer.place}</td>
                                        <td>{customer.workOrderNo}</td>
                                        <td>{customer.workOrderAmount}</td>
                                        <td>{customer.workClassification}</td>
                                        <td>{customer.workOrderDate ? new Date(customer.workOrderDate).toLocaleDateString() : "N/A"}</td>
                                        <td>{customer.auditScope}</td>
                                        <td>{customer.gstNumber}</td>
                                        <td>{customer.travel}</td>
                                        <td>{customer.remarks}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(customer)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteCustomer(customer._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    {/* Pagination */}
                    <nav className="d-flex justify-content-center mt-3">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                            </li>
                            {[...Array(Math.ceil(filteredData.length / customersPerPage)).keys()].map(number => (
                                <li key={number + 1} className={`page-item ${currentPage === number + 1 ? "active" : ""}`}>
                                    <button onClick={() => paginate(number + 1)} className="page-link">{number + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === Math.ceil(filteredData.length / customersPerPage) ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export default AllCustomer;
