import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const Expenses = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const apiUrl = process.env.REACT_APP_API_URL;

    // 
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/edit-expense/${id}`);
    };
    // 

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await fetch(`${apiUrl}/expenses`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            const result = await response.json();
            if (result.success) {
                setData(result.data);
                setFilteredData(result.data); // Set initial filtered data
            } else {
                toast.error("Failed to fetch expenses.");
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
            toast.error("Server error while fetching expenses.");
        }
    };

    // Filter Data Based on Date Range
    const handleSearch = () => {
        if (!fromDate || !toDate) {
            toast.error("Please select both From and To dates.");
            return;
        }

        const filtered = data.filter((expense) => {
            const expenseDate = new Date(expense.date).toISOString().split("T")[0];
            return expenseDate >= fromDate && expenseDate <= toDate;
        });

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    // Reset Filter
    const resetFilter = () => {
        setFromDate("");
        setToDate("");
        setFilteredData(data);
    };

    // Pagination logic
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentData = filteredData.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Export Filtered Data to Excel
    const exportToExcel = () => {
        // Filter out unwanted fields and format date
        const formattedData = filteredData.map(({ _id, createdAt, updatedAt, __v, date, ...rest }) => ({
            ...rest,
            date: date ? new Date(date).toLocaleDateString("en-GB") : "N/A", // Format date as DD/MM/YYYY
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        saveAs(dataBlob, "Filtered_Expenses.xlsx");
    };

    // 
    const [expenses, setExpenses] = useState([]);
    const deleteExpense = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/deleteExpense/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to delete expense");
            }

            setExpenses(expenses.filter((expense) => expense._id !== id));
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    // 



    return (
        <div className="container mt-1">
            <h5 className="text-center mb-0">Expenses</h5>
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
                {/* Add New Expenses Button */}
                <button className="btn btn-success btn-sm">
                    <Link to="/AddNewExpenses" className="text-white text-decoration-none fs-6">
                        + Add New Expenses
                    </Link>
                </button>

                {/* Date Inputs & Buttons */}
                <div className="d-flex align-items-center">
                    <div className="d-flex flex-column me-2">
                        <span className="fs-6">From</span>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className="d-flex flex-column me-2">
                        <span className="fs-6">To</span>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary btn-sm fs-6 me-2" onClick={handleSearch}>Search</button>
                    <button className="btn btn-secondary btn-sm fs-6 me-2" onClick={resetFilter}>Reset</button>
                    <button className="btn btn-success btn-sm fs-6" onClick={exportToExcel}>Download Excel</button>
                </div>
            </div>


            {filteredData.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                    <h2 className="text-muted">Oops! No Data Available</h2>
                    <p className="text-secondary">There is no data to display at the moment.</p>
                </div>
            ) : (
                <div>
                    <div className="table-responsive">
                        <table className="table table-sm table-striped table-bordered text-center w-100" style={{ fontSize: "12px" }}>
                            <thead className="table-dark text-light">
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Payment By</th>
                                    <th>Paid From</th>
                                    <th>Remarks</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-dark" style={{ fontSize: "12px" }}>
                                {currentData.map((expense, index) => (
                                    <tr key={expense._id}>
                                        <td>{firstIndex + index + 1}</td>
                                        <td>{expense.date ? new Date(expense.date).toLocaleDateString() : "N/A"}</td>
                                        <td>{expense.expenseDescription || "N/A"}</td>
                                        <td>{expense.amount || "N/A"}</td>
                                        <td>{expense.paymentBy || "N/A"}</td>
                                        <td>{expense.paidFromAcc || "N/A"}</td>
                                        <td>{expense.remarks || "N/A"}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm mx-1" style={{ fontSize: "12px" }} onClick={() => handleEdit(expense._id)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" style={{ fontSize: "12px" }} onClick={() => deleteExpense(expense._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>



                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav>
                            <ul className="pagination pagination-sm justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link fs-6" onClick={handlePrev}>Previous</button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                        <button className="page-link fs-6" onClick={() => setCurrentPage(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link fs-6" onClick={handleNext}>Next</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>

            )}
        </div>
    );
};

export default Expenses;
