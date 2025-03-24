import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LoginPerson } from "./components/Login/Login";
import Navbar from "./components/NavBar/NavBar";
import Receipts from "./components/Receipts/Receipts";
import Expenses from "./components/Expense/Expense";
import AllCustomer from "./components/Customer/Customer";
import { NewCustomer } from "./components/Customer/AddNewCustomer";
import AddNewReceipts from "./components/Receipts/AddNewReceipts";
import AddNewExpenses from "./components/Expense/AddNewExpense";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { EditCustomer } from "./components/Customer/EditCustomer";
import EditReceipts from "./components/Receipts/EditReceipts";
import EditExpenses from "./components/Expense/EditExpenses";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/"; // Hide Navbar on Login page

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPerson />} />
          <Route path="/AllCustomer" element={<ProtectedRoute element={<AllCustomer />} />} />
          <Route path="/Receipts" element={<ProtectedRoute element={<Receipts />} />} />
          <Route path="/Expenses" element={<ProtectedRoute element={<Expenses />} />} />
          <Route path="/addcustomer" element={<ProtectedRoute element={<NewCustomer />} />} />
          <Route path="/AddNewReceipts" element={<ProtectedRoute element={<AddNewReceipts />} />} />
          <Route path="/AddNewExpenses" element={<ProtectedRoute element={<AddNewExpenses />} />} />
          <Route path="/editcustomer/:id" element={<EditCustomer />} />
          <Route path="/editreceipts/:id" element={<EditReceipts />} />
          <Route path="/edit-expense/:id" element={<EditExpenses />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
