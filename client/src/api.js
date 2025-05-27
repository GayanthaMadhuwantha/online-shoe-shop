import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Backend URL

export const getInvoices = async () => {
  try {
    const response = await axios.get(`${API_URL}/invoices`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

export const addInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_URL}/invoices`, invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error adding invoice:", error);
    return null;
  }
};