import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

function TicketDetailsPage() {
  const [ticket, setTicket] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [satisfyLoading, setSatisfyLoading] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const fetchTicket = async () => {
    try {
      const res = await fetch(`${VITE_SERVER_URL}/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        method: 'GET',
      });
      const data = await res.json();
      if (res.ok) {
        setTicket(data.ticket || {});
      } else {
        console.log(data.message || 'Failed to fetch ticket');
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);




  const handleMarkSatisfied = async () => {
    setSatisfyLoading(true);
    try {
      const res = await fetch(`${VITE_SERVER_URL}/tickets/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ticketId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Response marked as satisfied.");
        fetchTicket(); // refresh state
      } else {
        toast.error(data.error || "Failed to mark satisfied.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSatisfyLoading(false);
    }
  };


  const getStatusBadge = (status) => {
  const base = "px-2 py-1 text-sm font-semibold rounded-full ";
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


  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    setResponseLoading(true);
    try {
      const res = await fetch(`${VITE_SERVER_URL}/tickets/add-response`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          ticketId: id,
          responseText,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Response submitted successfully');
        setResponseText('');
        setIsEditing(false);
        fetchTicket(); // Refresh ticket data
      } else {
        toast.error(data.error || 'Response submission failed');
      }
    } catch (error) {
      console.error('Error submitting response:', error.message);
      toast.error('Something went wrong');
    } finally {
      setResponseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <span className="loading loading-spinner loading-xl text-success" />
      </div>
    );
  }


  if (!ticket) return <div className="text-center mt-10">Ticket not found</div>;

  const canEditResponse =
  (user?.role === 'moderator' || user?.role === 'admin') &&
  ticket.response?.text &&
  !ticket.response?.satisfied &&
  (ticket.response?.createdBy._id === user?._id || user?.role === 'admin');
  console.log(canEditResponse);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
  <Navbar />
  <div className="w-4xl mx-auto p-4">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ticket Details</h2>

    {/* Ticket Info */}
    <div className="bg-white border border-gray-200 shadow-md p-5 rounded-lg space-y-4 text-gray-800">
     <h3 className="text-2xl font-bold text-indigo-700">{ticket.title}</h3>
      <p className="text-gray-700">{ticket.description}</p>

      <hr className="my-4 border-t border-gray-300" />
      <p className="flex items-center gap-2">
        <strong>Status:</strong> {getStatusBadge(ticket.status)}
      </p>

      {ticket?.status !== 'TODO' && (
        <>
          {ticket.priority && (
            <p><strong>Priority:</strong> {ticket.priority}</p>
          )}
          {ticket.relatedSkills?.length > 0 && (
            <p><strong>Related Skills:</strong> {ticket.relatedSkills.join(', ')}</p>
          )}
          {user?.role !== 'user' && ticket.helpfulNotes && (
            <div>
              <strong>Helpful Notes:</strong>
              <div className="prose max-w-none text-gray-800 bg-gray-50 p-3 rounded border 
              [&_code]:!bg-yellow-100 [&_code]:!text-red-600 
              [&_pre]:!bg-gray-100 [&_pre_code]:!bg-gray-100 [&_pre_code]:!text-gray-800">
              <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
            </div>

            </div>
          )}
          {ticket.assignedTo && (
            <p><strong>Assigned To:</strong> {ticket.assignedTo?.email}</p>
          )}
          {ticket.createdAt && (
            <p className="text-sm text-gray-500 mt-2">
              Created At: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>

    {/* Moderator Response Section */}
    <div className="bg-white border border-gray-200 shadow-md mt-6 p-5 rounded-lg space-y-4">
      <h3 className="text-xl font-semibold text-indigo-600">Moderator Response</h3>

      {ticket.response?.text && !isEditing ? (
        <div className="prose max-w-none bg-slate-100 text-gray-800 rounded p-5 border leading-relaxed">
          <ReactMarkdown>{ticket.response.text}</ReactMarkdown>
          <p className="text-sm text-gray-500 mt-2">
            Responded By: {ticket.response?.createdBy?.email || 'Moderator'} on{' '}
            {new Date(ticket.response?.createdAt).toLocaleString()}
          </p>

          {user?.role === 'user' && !ticket.response?.satisfied && (
            <button
              onClick={handleMarkSatisfied}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
              disabled={satisfyLoading}
            >
              {satisfyLoading ? "Processing..." : "Mark as Satisfied"}
            </button>
          )}
        
          {canEditResponse && (
            <button
              onClick={() => {
                setIsEditing(true);
                setResponseText(ticket.response.text);
              }}
              className=" mt-3 border border-indigo-700 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"

            >
              Edit Response
            </button>
          )}
        </div>
      ) : (user?.role === 'moderator' || user?.role === 'admin') &&
        (!ticket.response?.text || isEditing) ? (
        <form onSubmit={handleSubmitResponse} className="space-y-3">
          <label className="font-medium text-gray-800">
            {isEditing ? 'Edit Response:' : 'Add Response:'}
          </label>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            rows={4}
            className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Type your response to the ticket..."
            required
          ></textarea>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              disabled={responseLoading}
            >
              {responseLoading
                ? 'Submitting...'
                : isEditing
                ? 'Update Response'
                : 'Submit Response'}
            </button>

            {isEditing && (
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setIsEditing(false);
                  setResponseText('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="text-sm italic text-gray-500">No response has been added yet.</p>
      )}

      {ticket.response?.satisfied && (
        <p className="text-green-600 mt-2 font-medium">✅ Marked as Satisfied</p>
      )}
    </div>
  </div>
</div>

  );
}

export default TicketDetailsPage;
