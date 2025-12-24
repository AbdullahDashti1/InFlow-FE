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

  

const handleSubmit = async () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      alert("Please fill all fields");
      return;
    }


    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:8000/api/clients/${editId}`
        : "http://localhost:8000/api/clients";


      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });


      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to save client");
      }


      const saved = await res.json();


      if (editId) {
        setClients(clients.map((c) => (c.id === editId ? saved : c)));
        setEditId(null);
      } else {
        setClients([...clients, saved]);
      }


      setNewClient({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

const handleEdit = (client) => {
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone,
    });
    setEditId(client.id);
  };

const handleCancel = () => {
    setEditId(null);
    setNewClient({ name: "", email: "", phone: "" });
  };

    const handleDelete = async (id) => {
    if (!window.confirm("Delete this client?")) return;


    try {
      const res = await fetch(
        `http://localhost:8000/api/clients/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete client");
      setClients(clients.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

 return (
    <div>
      <h1>Clients Management</h1>


      <h3>{editId ? "Edit Client" : "Add New Client"}</h3>


      <input
        type="text"
        name="name"
        placeholder="Name"
        value={newClient.name}
        onChange={handleInputChange}
      />


      <br />


      <input
        type="email"
        name="email"
        placeholder="Email"
        value={newClient.email}
        onChange={handleInputChange}
      />


      <br />


      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={newClient.phone}
        onChange={handleInputChange}
      />


      <br />


      <button onClick={handleSubmit}>
        {editId ? "Update Client" : "Add Client"}
      </button>


      {editId && <button onClick={handleCancel}>Cancel</button>}


      <hr />


      <h3>All Clients</h3>


      {clients.length === 0 && <p>No clients yet</p>}


      {clients.map((client) => (
        <div key={client.id}>
          <p><strong>Name:</strong> {client.name}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Phone:</strong> {client.phone}</p>


          <button onClick={() => handleEdit(client)}>Edit</button>
          <button onClick={() => handleDelete(client.id)}>Delete</button>


          <hr />
        </div>
      ))}
    </div>
  );
};


export default Clients;