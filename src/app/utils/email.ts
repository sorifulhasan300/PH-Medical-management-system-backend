import nodemailer from "nodemailer";
import { envVars } from "../../config/config";
import AppError from "../../error-helper/app.error.helper";
import { StatusCodes } from "http-status-codes";
import path from "path";
import ejs from "ejs";
const transpporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  port: parseInt(envVars.EMAIL_SENDER.SMTP_PORT),
});

interface SendEmailOption {
  to: string;
  subject: string;
  templateName: string;
  templateDate: Record<string, any>;
  attachments?: [
    {
      fileName: string;
      content: Buffer | string;
      contentType: string;
    },
  ];
}
export const sendEmail = async ({
  subject,
  templateDate,
  templateName,
  to,
  attachments,
}: SendEmailOption) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`,
    );
    const html = await ejs.renderFile(templatePath, templateDate);
    const info = await transpporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.fileName,
        content: attachment.fileName,
        contentType: attachment.contentType,
      })),
    });
    console.log(`email sent to ${info.messageId}`);
  } catch (error: any) {
    console.log("Email Sending Error", error.message);
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Faild to send email",
    );
  }
};
