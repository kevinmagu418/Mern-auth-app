 import  {MailtrapClient} from "mailtrap";
import dotenv from "dotenv";// inorder to use environment variables
dotenv.config();
const TOKEN = process.env.MAILTRAP_TOKEN;

 export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});
//make the mailtrapclient and sender exportable
   export const sender = {
  email: "hello@demomailtrap.com",
  name: "kevin",
};

   