import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { addResponse, createTicket, getTicket, getTickets, markResponseSatisfied } from "../controllers/ticket.js";


const router = Router();



router.get('/', authenticate, getTickets);

router.get('/:id', authenticate, getTicket);

router.post('/', authenticate, createTicket);

router.post('/add-response', authenticate, addResponse);

router.post('/accept', authenticate, markResponseSatisfied);

export default router;