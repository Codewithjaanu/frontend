import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditExpenses = () => {
    const { id } = useParams(); // Get expense ID from URL params
    const navigate = useNavigate(); // Hook for navigation

    const apiUrl = process.env.REACT_APP_API_URL;

    const [expense, setExpense] = useState({
        date: "",
        expenseDescription: "",
        amount: "",
        paymentBy: "",
        paidFromAcc: "",
        remarks: "",
    });

    // Fetch expense details by ID
    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await fetch(`${apiUrl}/expenses/${id}`);
                const data = await response.json();

                if (data.success) {
                    setExpense(data.data);
                } else {
                    toast.error("Expense not found!");
                }
            } catch (error) {
                toast.error("Error fetching expense data!");
                console.error("Fetch error:", error);
            }
        };

        if (id) fetchExpense();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        setExpense({ ...expense, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/updateExpense/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expense),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Expense updated successfully!");
                setTimeout(() => navigate("/expenses"), 2000); // Redirect after success
            } else {
                toast.error("Failed to update expense!");
            }
        } catch (error) {
            toast.error("Error updating expense!");
            console.error("Update error:", error);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" theme="dark" />
            <div className="container mt-1">
                <h5 className="text-center">Edit Expenses</h5>
                <hr
                    style={{
                        borderColor: "black",
                        opacity: "1",
                        width: "12%",
                        borderWidth: "2px",
                        margin: "5px auto"
                    }}
                />

                <div className="p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="date"
                                    value={expense.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-8 mb-3">
                                <label className="form-label">Expenses Description</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="expenseDescription"
                                    value={expense.expenseDescription}
                                    onChange={handleChange}
                                    placeholder="Enter description"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    name="amount"
                                    value={expense.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Payment By</label>
                                <select
                                    className="form-control form-control-sm"
                                    name="paymentBy"
                                    value={expense.paymentBy}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="NEFT">NEFT</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Paid from Acc (Tmo)</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="paidFromAcc"
                                    value={expense.paidFromAcc}
                                    onChange={handleChange}
                                    placeholder="Enter account details"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Remarks</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    name="remarks"
                                    value={expense.remarks}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Remarks"
                                ></textarea>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <button type="submit" className="btn btn-primary" style={{ width: "200px", fontSize: "18px" }}>
                                Update Expense
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditExpenses;
