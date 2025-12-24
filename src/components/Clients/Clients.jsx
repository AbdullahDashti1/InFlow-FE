import { useState, useEffect } from "react";


const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editId, setEditId] = useState(null);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/clients");
        const data = await res.json();
        setClients(data || []);
      } catch (err) {
        console.error(err);
        setClients([]);
      }
    };
    fetchClients();
  }, []);
}

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };
