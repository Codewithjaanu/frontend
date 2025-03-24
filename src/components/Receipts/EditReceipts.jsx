import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditReceipts = () => {
  const { id } = useParams(); // Get receipt ID from URL
  const [formData, setFormData] = useState({
    customerCode: "",
    workOrderDate: "",
    invoiceNo: "",
    invoiceAmount: "",
    dateOfReceipt: "",
    amountReceived: "",
    gst: "",
    tdsDeducted: "",
    receiptAmount: "",
    description: "",
    receiptAccount: "",
    remarks: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL;
  // Fetch receipt details when component mounts

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await fetch(`http://localhost:3005/receiptsingle/${id}`,
          {
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
        }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch receipt details");
        }
        const data = await response.json();
        console.log(data)
        setFormData(data); // Populate the form
      } catch (error) {
        console.error("Error fetching receipt:", error);
      }
    };

    if (id) fetchReceipt();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Update receipt)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/receiptupdate/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update receipt");
      }

      alert("Receipt updated successfully!");
    } catch (error) {
      console.error("Error updating receipt:", error);
    }
  };

  return (
    <div className="container mt-1">
      <h5 className="text-center mb-0">{id ? "Edit Receipt" : "Add New Receipt"}</h5>
      <hr className="mx-auto" style={{ width: "12%", borderWidth: "2px", borderColor: "black" }} />

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Customer Code - Work Order No</label>
            <input type="text" className="form-control form-control-sm" name="customerCode" value={formData.customerCode} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Work Order Date</label>
            <input type="text" className="form-control form-control-sm" name="workOrderNo" value={formData.workOrderDate} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Invoice No</label>
            <input type="text" className="form-control form-control-sm" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Invoice Amount</label>
            <input type="number" className="form-control form-control-sm" name="invoiceAmount" value={formData.invoiceAmount} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Date Of Receipt</label>
            <input type="date" className="form-control form-control-sm" name="dateOfReceipt" value={formData.dateOfReceipt} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Amount Received</label>
            <input type="text" className="form-control form-control-sm" name="amountReceived" value={formData.amountReceived} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">GST</label>
            <input type="number" className="form-control form-control-sm" name="gst" value={formData.gst} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">TDS Deducted</label>
            <input type="number" className="form-control form-control-sm" name="tdsDeducted" value={formData.tdsDeducted} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Receipt in Amount</label>
            <input type="number" className="form-control form-control-sm" name="receiptAmount" value={formData.amountReceived} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Description</label>
            <input type="text" className="form-control form-control-sm" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Receipt in Account</label>
            <input type="text" className="form-control form-control-sm" name="receiptAccount" value={formData.receiptInAccount} onChange={handleChange} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Remarks</label>
            <input type="text" className="form-control form-control-sm" name="remarks" value={formData.remarks} onChange={handleChange} />
          </div>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-primary px-4" style={{ fontSize: "16px" }}>
            {id ? "Update Receipt" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReceipts;
