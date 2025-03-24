import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNewExpenses = () => {
    const [formData, setFormData] = useState({
        date: "",
        expenseDescription: "",
        amount: "",
        paymentBy: "",
        paidFromAcc: "",
        remarks: "",
    });

    const apiUrl = process.env.REACT_APP_API_URL;
    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${apiUrl}/newExpense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                        "Authorization":localStorage.getItem("token")
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Expense added successfully!");
                setFormData({
                    date: "",
                    expenseDescription: "",
                    amount: "",
                    paymentBy: "",
                    paidFromAcc: "",
                    remarks: "",
                });
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
            console.error("Error:", error);
        }
    };

    return (
       <>
       <ToastContainer position="top-right" theme="dark"/>
        <div className="container mt-1">
            <h5 className="text-center mb-0">Add New Expenses</h5>
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
                            <input type="date" className="form-control form-control-sm" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className="col-md-8 mb-3">
                            <label className="form-label">Expenses Description</label>
                            <input type="text" className="form-control form-control-sm" name="expenseDescription" placeholder="Enter description" value={formData.expenseDescription} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Amount</label>
                            <input type="number" className="form-control form-control-sm" name="amount" placeholder="Enter amount" value={formData.amount} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Payment By</label>
                            <select className="form-control form-control-sm" name="paymentBy" value={formData.paymentBy} onChange={handleChange} required>
                                <option value="">Select Payment Method</option>
                                <option value="Cheque">Cheque</option>
                                <option value="NEFT">NEFT</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Paid from Acc (Tmo)</label>
                            <input type="text" className="form-control form-control-sm" name="paidFromAcc" placeholder="Enter account details" value={formData.paidFromAcc} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Remarks</label>
                            <textarea className="form-control form-control-sm" name="remarks" rows="3" placeholder="Remarks" value={formData.remarks} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <button type="submit" className="btn btn-primary" style={{ width: "200px", fontSize: "18px" }}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
       </>
    );
};

export default AddNewExpenses;
