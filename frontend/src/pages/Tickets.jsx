import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(true); // Loader for ticket list
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trimStart() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim()
        })
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets();
        toast.success("Ticket Submitted!");
      } else {
        toast.error(data.error || "Ticket creation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating ticket");
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    setTicketLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setTicketLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);


  const getStatusBadge = (status) => {
  const base = "px-2 py-1 text-xs font-semibold rounded-full ";
  switch (status) {
    case "TODO":
      return <span className={base + "bg-gray-200 text-gray-700"}>{status}</span>;
    case "IN_PROGRESS":
      return <span className={base + "bg-yellow-200 text-yellow-800"}>{status}</span>;
    case "DONE":
      return <span className={base + "bg-green-200 text-green-800"}>{status}</span>;
    default:
      return <span className={base + "bg-blue-200 text-blue-800"}>{status}</span>;
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
  <Navbar />
  <div className="p-6 w-full max-w-4xl mx-auto">
    {user?.role === 'user' && (
      <>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Ticket</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-20 flex flex-col"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ticket Title"
            autoComplete="off"
            className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Ticket Description"
            autoComplete="off"
            rows="4"
            className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          ></textarea>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md w-fit font-medium transition"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </>
    )}

    <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
      {user?.role === 'moderator' ? "Assigned Tickets" : "All Tickets"}
    </h2>

    <div className="space-y-4">
      {ticketLoading ? (
        <div className="text-center mt-10 text-gray-600"><span className="loading loading-spinner loading-xl text-success" /></div>
      ) : tickets.length === 0 ? (
        <p className="bg-white border border-gray-300 text-gray-600 rounded-md p-4 text-center text-lg">
          No tickets {user?.role === 'moderator' ? 'assigned' : 'submitted'} yet.
        </p>
      ) : (
        tickets.map((ticket) => (
          <Link
            key={ticket._id}
            to={`/ticket/${ticket._id}`}
            className="bg-white border border-gray-300 shadow-sm rounded-md p-4 flex flex-col gap-2 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
            <div className="flex gap-2 mb-1">
  {getStatusBadge(ticket.status)}
  {ticket.response?.satisfied && <span className="bg-green-200 text-green-800 px-2 py-1 text-xs rounded-full">SATISFIED</span>}
</div>
            <p className="text-sm text-gray-700">{ticket.description}</p>
            <p className="text-sm text-gray-500">
              Created At: {new Date(ticket.createdAt).toLocaleString()}
            </p>
            {/* {ticket.response?.satisfied && (
              <p className="text-green-600 font-medium mt-1">✅ Marked as Satisfied</p>
            )} */}
          </Link>
        ))
      )}
    </div>
  </div>
</div>

  );
}

export default Tickets;
