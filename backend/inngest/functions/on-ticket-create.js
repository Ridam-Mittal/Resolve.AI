import { NonRetriableError } from "inngest";
import { inngest } from "../client.js";
import { sendMail } from "../../utils/mailer.js";
import { Ticket } from "../../models/ticket.js";
import analyzeTicket from "../../utils/ai.js";
import { User } from "../../models/user.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;
      console.log(process.env.FRONTEND_URL);
      // Step 1: Fetch ticket from DB
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      // Step 2: Analyze ticket using AI
      const apiResponse = await analyzeTicket(ticket);

      const relatedskills = await step.run("ai-processing", async () => {
        if (!apiResponse) {
          console.error("No AI response for ticket triage.");
          return [];
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          priority: !["low", "medium", "high"].includes(apiResponse.priority)
            ? "medium"
            : apiResponse.priority,
          helpfulNotes: apiResponse.helpfulNotes || "No response",
          status: "IN_PROGRESS",
          relatedSkills: apiResponse.relatedSkills || [],
        });

        return apiResponse.relatedSkills || [];
      });

      // Step 3: Assign ticket to moderator or admin
      const assignedUser = await step.run("assign-moderator", async () => {
        if (relatedskills.length === 0) {
          throw new NonRetriableError("No related skills extracted from AI");
        }

        const skillPattern = relatedskills
          .map((s) => s.trim().toLowerCase())
          .join("|");

        const moderators = await User.find({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: skillPattern,
              $options: "i",
            },
          },
        });

        let user = null;
        let maxMatches = 0;

        for (const mod of moderators) {
          const matchCount = mod.skills.filter((skill) =>
            relatedskills.some(
              (rs) => skill.toLowerCase() === rs.toLowerCase()
            )
          ).length;

          if (matchCount > maxMatches) {
            maxMatches = matchCount;
            user = mod;
          }
        }

        // Fallback to admin if no good moderator match
        if (!user) {
          user = await User.findOne({ role: "admin" });
        }

        if (!user) {
          throw new NonRetriableError(
            "No moderator or admin found to assign the ticket."
          );
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user._id,
          status: "ASSIGNED",
        });

        return user;
      });

      // Step 4: Notify assigned user via email
      await step.run("send-email-notification", async () => {
        const finalTicket = await Ticket.findById(ticket._id);

        await sendMail(
          assignedUser.email,
          "Ticket Assigned",
          `A new ticket titled "${finalTicket.title}" has been assigned to you.\n\nView it at: ${process.env.FRONTEND_URL}/ticket/${finalTicket._id}`
        );
      });

      return {
        success: true,
        assignedTo: assignedUser.email,
        ticketId: ticket._id.toString(),
      };
    } catch (error) {
      console.error("Error in onTicketCreated handler:", error.message);
      return { success: false };
    }
  }
);
