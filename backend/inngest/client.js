import { Inngest } from "inngest";

export const inngest = new Inngest({  
    id: "ticketing-system",
    auth: process.env.INNGEST_EVENT_KEY
 });


