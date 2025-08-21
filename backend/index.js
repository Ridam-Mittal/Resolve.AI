import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import ConnectDB from './db/db.js';
import userRoutes from './routes/user.js';
import ticketRoutes from './routes/ticket.js';
import { serve } from 'inngest/express';
import { inngest } from './inngest/client.js';
import { onUserSignup } from './inngest/functions/on-signup.js';
import { onTicketCreated } from './inngest/functions/on-ticket-create.js';

const PORT=process.env.PORT || 8000;
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.get('/test', (req, res) => {
    res.send("Test endpoint");
});

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [onUserSignup, onTicketCreated] 
    }),
)

ConnectDB()
    .then(() =>{
        app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT}`);
        })
    })
    .catch((err) => console.error("MongoDB error: ", err))

