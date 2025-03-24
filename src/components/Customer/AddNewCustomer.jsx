import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NewCustomer() {
    const [formData, setFormData] = useState({
        companyName: "",
        customerName: "",
        customerCode: "",
        place: "",
        workClassification: "",
        auditScope: "",
        workOrderNo: "",
        workOrderDate: "",
        workOrderAmount: "",
        gstNumber: "", // Auto-calculated field
        travel: "",
        remarks: "",
    });

    const [loading, setLoading] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        // If the work order amount is changed, calculate GST
        if (name === "workOrderAmount") {
            const amount = parseFloat(value) || 0; // Ensure value is a number
            const gst = (amount * 18) / 100; // Calculate 18% GST

            setFormData({
                ...formData,
                [name]: value, // Set the work order amount
                gstNumber: gst.toFixed(2), // Auto-update GST (2 decimal places)
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/newcustomer`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setFormData({
                    companyName: "",
                    customerName: "",
                    customerCode: "",
                    place: "",
                    workClassification: "",
                    auditScope: "",
                    workOrderNo: "",
                    workOrderDate: "",
                    workOrderAmount: "",
                    gstNumber: "", // Reset GST field
                    travel: "",
                    remarks: "",
                });
            } else {
                toast.error(data.message || "Failed to add customer.", { position: "top-right" });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Internal server error. Please try again.", { position: "top-right" });
        }
    };

    return (
        <>
            <ToastContainer position="top-right" theme="dark" />
            <div className="px-5">
                <h5 className="text-center mb-0">Add New Customer</h5>
                <hr
                    style={{
                        borderColor: "black",
                        opacity: "1",
                        width: "12%",
                        borderWidth: "2px",
                        margin: "5px auto"
                    }}
                />


                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Company Name</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Customer Name</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Customer Code</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Customer Code" name="customerCode" value={formData.customerCode} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Place</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Place" name="place" value={formData.place} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Work Classification</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Work Classification" name="workClassification" value={formData.workClassification} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Audit Scope</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Audit Scope" name="auditScope" value={formData.auditScope} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Work Order No</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Work Order No" name="workOrderNo" value={formData.workOrderNo} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Work Order Date</label>
                            <input type="date" className="form-control form-control-sm" placeholder="Work Order Date" name="workOrderDate" value={formData.workOrderDate} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Work Order Amount</label>
                            <input type="number" className="form-control form-control-sm" placeholder="Work Order Amount" name="workOrderAmount" value={formData.workOrderAmount} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">GST</label>
                            <input type="text" className="form-control form-control-sm" placeholder="GST" name="gstNumber" value={formData.gstNumber} readOnly />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Travel</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Travel" name="travel" value={formData.travel} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Remarks (Payment Terms)</label>
                            <textarea className="form-control form-control-sm" placeholder="Remarks (Payment Terms)" name="remarks" rows="1" value={formData.remarks} onChange={handleChange} required></textarea>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <button type="submit" className="btn btn-primary" style={{ width: "200px", padding: "4px 20px", fontSize: "18px" }} disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export { NewCustomer };
