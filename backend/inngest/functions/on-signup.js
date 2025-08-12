import { NonRetriableError } from "inngest";
import { User } from "../../models/user.js";
import { inngest } from "../client.js";
import { sendMail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup"  },
    async ({event, step}) => {
        try{
            const {email} = event.data;
            const user = await step.run("get-user-email", async () => {
                const userObject =  await User.findOne({ email });
                if(!userObject){
                    throw new NonRetriableError("User no longer exists in our database");
                }
                return userObject;
            })

            await step.run("send-welcome-email", async () => {
                const subject = "🎉 Welcome to Smart Ticketing System!";
                const text = `Hi ${user.name || ''},
                    Thanks for signing up. We're glad to have you onboard!

                    Welcome to ExpertQuery!

                    We’re excited to help you get fast, accurate answers from experts in various domains.

                    With your account, you can:
                    - Submit questions and get expert responses
                    - Track your open and resolved queries
                    - Communicate with professionals

                    Get started now by submitting your first query.
                    Best,  
                    The ExpertQuery Team`;

                const html = `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #4F46E5;">Welcome to <strong>ExpertQuery</strong> 👋</h2>
                <p>Hi ${user.name || ''},</p>
                <p>We're excited to have you on board! ExpertQuery is your trusted platform to connect with professionals and get reliable solutions quickly.</p>

                <h3>🔧 What you can do:</h3>
                <ul>
                    <li>📩 Submit your queries in just a few clicks</li>
                    <li>💡 Get responses from field-specific experts</li>
                    <li>🕓 Track and manage open/resolved tickets</li>
                </ul>

                <p>
                    👉 <a href="https://your-app-url.com/dashboard" style="color: #4F46E5; text-decoration: none;">Visit your dashboard</a> and ask your first question now.
                </p>

                <p>If you ever need help, just reply to this email.</p>

                <p>Cheers,<br/><strong>The ExpertQuery Team</strong></p>
                </div>
                `;

                await sendMail(user.email, subject, text, html);
            })

            return {success: true};
        } catch (error) {
            console.error("Error running step", error.message);
            return {success: false};
        }
    }
)