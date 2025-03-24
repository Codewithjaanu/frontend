import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function EditCustomer() {

    const apiUrl = process.env.REACT_APP_API_URL;
    // 
    const { id } = useParams(); // Get customer ID from URL
    const [customer, setCustomer] = useState({
        companyName: "",
        customerName: "",
        customerCode: "",
        place: "",
        workClassification: "",
        auditScope: "",
        workOrderNo: "",
        workOrderDate: "",
        remarks: "",
        travel: "",
        gstNumber: "",
        workOrderAmount: "",
    });

    useEffect(() => {
        fetchCustomerDetails();
    }, []);

    const fetchCustomerDetails = async () => {
        try {
            const response = await fetch(`${apiUrl}/onecustomers/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token"),
                    },
                }
            );
            const result = await response.json();
            if (response.ok) {
                setCustomer(result.data);
            }
        } catch (error) {
            toast.error("Error fetching customer details:", error);
        }
    };

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/editcustomers/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customer),
            });
            const data = await response.json()
            if (data.success) {
                toast.success(data.message);
            }
        } catch (error) {
            toast.error("Error updating customer:", error);
        }
    };


    // 



    return (
        <>
        <ToastContainer position="top-right" theme="dark"/>
            <div className="px-5">
                <h5 className="text-center mb-0">Edit Customer</h5>
                <hr
                    style={{
                        borderColor: "black",
                        opacity: "1",
                        width: "12%",
                        borderWidth: "2px",
                        margin: "5px auto",
                    }}
                />
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Company Name</label>
                            <input type="text" className="form-control form-control-sm" name="companyName" value={customer.companyName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Customer Name</label>
                            <input type="text" className="form-control form-control-sm" name="customerName" value={customer.customerName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Customer Code</label>
                            <input type="text" className="form-control form-control-sm" name="customerCode" value={customer.customerCode} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Place</label>
                            <input type="text" className="form-control form-control-sm" name="place" value={customer.place} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Work Classification</label>
                            <input type="text" className="form-control form-control-sm" name="workClassification" value={customer.workClassification} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Audit Scope</label>
                            <input type="text" className="form-control form-control-sm" name="auditScope" value={customer.auditScope} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Work Order No</label>
                            <input type="text" className="form-control form-control-sm" name="workOrderNo" value={customer.workOrderNo} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Work Order Date</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                name="workOrderDate"
                                value={customer.workOrderDate ? new Date(customer.workOrderDate).toISOString().split('T')[0] : ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Work Order Amount</label>
                            <input type="number" className="form-control form-control-sm" name="workOrderAmount" value={customer.workOrderAmount} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">GST</label>
                            <input type="text" className="form-control form-control-sm" name="gstNumber" value={customer.gstNumber} onChange={handleChange} readOnly />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Travel</label>
                            <input type="text" className="form-control form-control-sm" name="travel" value={customer.travel} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Remarks (Payment Terms)</label>
                            <textarea className="form-control form-control-sm" name="remarks" rows="1" value={customer.remarks} onChange={handleChange} required></textarea>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <button type="submit" className="btn btn-primary" style={{ width: "200px", padding: "4px 20px", fontSize: "18px" }}>
                            UpDate
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export { EditCustomer };
