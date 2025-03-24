import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Receipts = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [code, setcode] = useState('');
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const recordsPerPage = 10;


    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const response = await fetch(`${apiUrl}/receipts`, {
                headers: { "Authorization": localStorage.getItem("token") },
            });
            const result = await response.json();
            setData(result);
            setFilteredData(result);
        } catch (error) {
            console.error("Error fetching receipts:", error);
            toast.error("Server error while fetching receipts.");
        }
    };

    // Handle Date Range Search
    const handleSearch = () => {
        if (!fromDate || !toDate || !code) {
            toast.warning("Please select both From and To dates.");
            return;
        }

        const filtered = data.filter(receipt => {
            const receiptDate = new Date(receipt.dateOfReceipt);
            return (
                receiptDate >= new Date(fromDate) &&
                receiptDate <= new Date(toDate) &&
                receipt.customerCode === code  // Check if code matches receipt.customerCode
            );;
        });

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    // Handle Excel Export
    const exportToExcel = () => {
        if (filteredData.length === 0) {
            toast.warning("No data available to export.");
            return;
        }
        // Filter out unwanted fields and format date
        const formattedData = filteredData.map(({ _id, createdAt, updatedAt, __v, dateOfReceipt, ...rest }) => ({
            ...rest,
            dateOfReceipt: dateOfReceipt ? new Date(dateOfReceipt).toLocaleDateString("en-GB") : "N/A", // Format date as DD/MM/YYYY
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "Receipts.xlsx");
    };

    // Pagination Logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);


    // 
    const [receipts, setReceipts] = useState([]);

    const deleteReceipt = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/deletereceipt/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            toast.success(data.message)

            setReceipts((prevReceipts) => prevReceipts.filter((receipt) => receipt._id !== id));


        } catch (error) {
            toast.error(data.message)
            console.error("Error deleting receipt:", error);
        }
    };



    // 
    const navigate = useNavigate();

    const handleEdit = (receipt) => {
        navigate(`/editreceipts/${receipt._id}`, { state: { receipt } });
    };


    return (
        <div className="container mt-1">
            <h5 className="text-center mb-0">Invoice Receipt Entry</h5>
            <hr
                style={{
                    borderColor: "black",
                    opacity: "1",
                    width: "12%",
                    borderWidth: "2px",
                    margin: "5px auto"
                }}
            />

            <div className="d-flex justify-content-between align-items-center mb-3">
                {/* Add New Receipt Button */}
                <button className="btn btn-success btn-sm">
                    <Link to="/AddNewReceipts" className="text-white text-decoration-none fs-6">
                        + Add New Receipt
                    </Link>
                </button>

                {/* Date Inputs & Search/Download Buttons */}
                <div className="d-flex align-items-center">
                    <div className="d-flex flex-column me-2">
                        <span className="fs-6">Customer code - order no</span>
                        <select className="form-control form-control-sm" name="customerCode" value={code} onChange={(e) => { setcode(e.target.value) }} >
                            <option value="">Select Customer Code</option>
                            {data.map((customer) => (
                                <option key={customer.id} value={customer.customerCode}>
                                    {customer.customerCode}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex flex-column me-2">
                        <span className="fs-6">From</span>
                        <input type="date" className="form-control form-control-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    </div>
                    <div className="d-flex flex-column me-2">
                        <span className="fs-6">To</span>
                        <input type="date" className="form-control form-control-sm" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>
                    <button className="btn btn-primary btn-sm fs-6 me-2" onClick={handleSearch}>Search</button>
                    <button className="btn btn-success btn-sm fs-6" onClick={exportToExcel}>Download Excel</button>
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
                        <table className="table table-striped table-bordered table-hover table-sm w-100" style={{ fontSize: "12px" }}>
                            <thead className="table-dark text-light">
                                <tr>
                                    <th>No.</th>
                                    <th>Customer Code</th>
                                    <th>Work Order Date</th>
                                    <th>Invoice No</th>
                                    <th>Invoice Amount</th>
                                    <th>Date Of Receipt</th>
                                    <th>Amount Received</th>
                                    <th>GST</th>
                                    <th>TDS Deducted</th>
                                    <th>Travel AMT</th>
                                    <th>Receipt In Account</th>
                                    <th>Remarks</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-dark">
                                {currentRecords.map((receipt, index) => (
                                    <tr key={receipt._id}>
                                        <td>{indexOfFirstRecord + index + 1}</td>
                                        <td>{receipt.customerCode || "N/A"}</td>
                                        <td>{receipt.workOrderDate ? new Date(receipt.workOrderDate).toLocaleDateString() : "N/A"}</td>
                                        <td>{receipt.invoiceNo || "N/A"}</td>
                                        <td>{receipt.invoiceAmount || "N/A"}</td>
                                        <td>{receipt.dateOfReceipt ? new Date(receipt.dateOfReceipt).toLocaleDateString() : "N/A"}</td>
                                        <td>{receipt.amountReceived || "N/A"}</td>
                                        <td>{receipt.gst || "N/A"}</td>
                                        <td>{receipt.tdsDeducted || "N/A"}</td>
                                        <td>{receipt.travelAmt || "N/A"}</td>
                                        <td>{receipt.receiptInAccount || "N/A"}</td>
                                        <td>{receipt.remarks || "N/A"}</td>
                                        <td>
                                            <div className="d-flex align-items-center"> <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(receipt)}>Edit</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => deleteReceipt(receipt._id)}>Delete</button></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    {/* Pagination Controls */}
                    <nav className="d-flex justify-content-center mt-3">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export default Receipts;
