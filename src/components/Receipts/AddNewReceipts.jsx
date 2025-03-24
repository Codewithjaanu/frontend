import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AddNewReceipts = () => {
  const [formData, setFormData] = useState({
    customerCode: "",
    workOrderDate: "",
    invoiceNo: "",
    invoiceAmount: "",
    dateOfReceipt: "",
    amountReceived: "",
    gst: "",
    tdsDeducted: "",
    travelAmt: "",
    receiptInAccount: "",
    description: "",
    remarks: "",
  });

  const [customerCodes, setCustomerCodes] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Fetch customer codes from the API when the component mounts
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${apiUrl}/customers`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const result = await response.json();
        if (result.success) {
          setCustomerCodes(result.data); // Assuming result.data is an array of customer codes
        } else {
          toast.error("Failed to fetch customers.");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Server error while fetching customers.");
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "customerCode") {
      // Find selected customer
      const [customerCode] = value.split(" - "); // Extract only the customerCode
      const selectedCustomer = customerCodes.find(customer => customer.customerCode === customerCode);
    
      
      if (selectedCustomer) {
        setFormData({
          ...formData,
          customerCode: value,
          workOrderDate: selectedCustomer.workOrderDate || "", // Auto-fill Work Order Date
        });
      } else {
        setFormData({ ...formData, customerCode: value, workOrderDate: "" });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     // Combine customerCode and workOrderNo before sending to backend
 

    try {
      const response = await fetch(`${apiUrl}/newreceipts`, {
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
          customerCode: "",
          workOrderDate:'',
          invoiceNo: "",
          invoiceAmount: "",
          dateOfReceipt: "",
          amountReceived: "",
          gst: "",
          tdsDeducted: "",
          travelAmt: "",
          receiptInAccount: "",
          description: "",
          remarks: "",
        });
      } else {
        toast.error("Failed to add receipt. Please try again.");
      }
    } catch (error) {
      toast.error("Internal Server Error.");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="dark" />
      <div className="container mt-1">
        <h5 className="text-center mb-0">Add New Receipts</h5>
        <hr
          style={{
            borderColor: "black",
            opacity: "1",
            width: "12%",
            borderWidth: "2px",
            margin: "5px auto"
          }}
        />

        <div className={`p-4 form-container`}>
          <form onSubmit={handleSubmit}>
            {/* First Row */}
            <div className="row">
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Customer Code - Work Order No</label>
                <select className="form-control form-control-sm" name="customerCode" value={formData.customerCode} onChange={handleChange} required>
                  <option value="">Select Customer Code</option>
                  {customerCodes.map((customer) => (
                    <option key={customer.id} value={`${customer.customerCode} - ${customer.workOrderNo}`}>
                      {customer.customerCode} - {customer.workOrderNo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Work Order Date</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="workOrderDate"
                  placeholder="Work Order Date"
                  value={formData.workOrderDate ? new Date(formData.workOrderDate).toLocaleDateString() : "N/A"}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Invoice No</label>
                <input type="text" className="form-control form-control-sm" name="invoiceNo" placeholder="Enter invoice no." value={formData.invoiceNo} onChange={handleChange} required />
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Invoice Amount</label>
                <input type="number" className="form-control form-control-sm" name="invoiceAmount" placeholder="Enter amount" value={formData.invoiceAmount} onChange={handleChange} required />
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Date of Receipt</label>
                <input type="date" className="form-control form-control-sm" name="dateOfReceipt" value={formData.dateOfReceipt} onChange={handleChange} required />
              </div>

              {/* Second Row */}

              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Amount Received</label>
                <input type="number" className="form-control form-control-sm" name="amountReceived" placeholder="Enter received amount" value={formData.amountReceived} onChange={handleChange} required />
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">GST</label>
                <input type="number" className="form-control form-control-sm" name="gst" placeholder="Enter GST amount" value={formData.gst} onChange={handleChange} required />
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">TDS Deducted</label>
                <input type="number" className="form-control form-control-sm" name="tdsDeducted" placeholder="Enter TDS amount" value={formData.tdsDeducted} onChange={handleChange} required />
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Travel Amount</label>
                <input type="number" className="form-control form-control-sm" name="travelAmt" placeholder="Enter travel amount" value={formData.travelAmt} onChange={handleChange} required />
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Receipt in Account</label>
                <input type="text" className="form-control form-control-sm" name="receiptInAccount" placeholder="Enter account details" value={formData.receiptInAccount} onChange={handleChange} required />
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Description</label>
                <input type="text" className="form-control form-control-sm" name="description" placeholder="Enter description" value={formData.description} onChange={handleChange} required />
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <label className="form-label">Remarks</label>
                <input type="text" className="form-control form-control-sm" name="remarks" placeholder="Enter remarks" value={formData.remarks} onChange={handleChange} />
              </div>
            </div>

            {/* Submit Button */}
            <div className="d-flex justify-content-center mt-3">
              <button type="submit" className="btn btn-primary" style={{ width: "200px", padding: "4px 20px", fontSize: "18px" }}>
                Submit
              </button>
            </div>
          </form>
        </div>
        {/*  */}
      </div>
    </>
  );
};

export default AddNewReceipts;
