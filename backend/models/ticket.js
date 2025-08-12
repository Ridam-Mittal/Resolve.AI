import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "TODO"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    response: {
        text: { type: String,  default: "" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date },
        satisfied: { type: Boolean, default: false },
    },
    priority: String,
    deadline: Date,
    helpfulNotes: String,
    relatedSkills: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, 
);


export const Ticket = mongoose.model('Ticket', ticketSchema);