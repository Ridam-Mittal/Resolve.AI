import { inngest } from "../inngest/client.js";
import { Ticket } from "../models/ticket.js";


export const createTicket = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if(!title || !description){
            return res.status(400).json({error: "Title or description is not provided"});
        }

        const newTicket = await Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString(),
        })

        await inngest.send({
            name: 'ticket/created',
            data: {
                ticketId: newTicket._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        });

        return res.status(201).json({
            message: "Ticket created and processing started",
            ticket: newTicket
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}
 


export const addResponse = async (req, res) => {
  try {
    const { ticketId, responseText } = req.body;

    if (!ticketId) {
      return res.status(400).json({ error: "No Ticket ID provided" });
    }

    const ticket = await Ticket.findById(ticketId).populate("assignedTo");

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Only the assigned moderator or an admin can respond
    const userId = req.user?._id;
    const userRole = req.user?.role;

    const isAssignedUser = ticket.assignedTo && ticket.assignedTo._id.equals(userId);

    if (userRole === "user" || (!isAssignedUser && userRole !== "admin")) {
      return res.status(403).json({ error: "You are not authorized to respond to this ticket." });
    }

    if (ticket.response?.text) {
      // It's an update, validate ownership/admin
      if (!ticket.response.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Not authorized to edit this response" });
      }
    }

    // Set the response
    ticket.response = {
      text: responseText,
      createdBy: userId,
      createdAt: new Date(),
    };

    ticket.status = "RESOLVED";

    await ticket.save();

    res.status(200).json({ message: "Response added successfully", ticket });

  } catch (error) {
    console.error("Error adding response:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];

    if (user?.role === 'admin') {
      tickets = await Ticket.find()
        .populate("assignedTo", "email")
        .populate("createdBy", "email")
        .sort({ createdAt: -1 });
    } 
    else if (user?.role === 'moderator') {
      tickets = await Ticket.find({ assignedTo: user._id })
        .populate("assignedTo", "email")
        .populate("createdBy", "email")
        .sort({ createdAt: -1 });
    } 
    else {
      tickets = await Ticket.find({ createdBy: user._id })
        .populate("assignedTo", "email")
        .populate("createdBy", "email") // optional, can remove if not needed for users
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ tickets });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId)
      .populate("assignedTo", "email")
      .populate("createdBy", "email")
      .populate("response.createdBy", "email role");

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const isAdmin = user.role === 'admin';
    const isAssignedMod = user.role === 'moderator' && ticket.assignedTo?._id.equals(user._id);
    const isCreatorUser = user.role === 'user' && ticket.createdBy?._id.equals(user._id);

    if (isAdmin || isAssignedMod || isCreatorUser) {
      return res.status(200).json({ ticket });
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




export const markResponseSatisfied = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ error: "No Ticket ID provided" });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket || !ticket.response?.text) {
      return res.status(404).json({ error: "Response not found for ticket." });
    }

    if (req.user.role !== "user" || !ticket.createdBy.equals(req.user._id)) {
      return res.status(403).json({ error: "Only the ticket creator can mark satisfaction." });
    }

    ticket.response.satisfied = true;
    ticket.status = "CLOSED";

    await ticket.save();

    res.status(200).json({ message: "Response marked as satisfied.", ticket });

  } catch (error) {
    console.error("Error marking satisfaction:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};