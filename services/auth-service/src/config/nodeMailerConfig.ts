// nodemailer-config.js
import nodemailer from "nodemailer";
import { EMAIL_HOST, EMAIL_PASSWORD } from "../constants/index";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_HOST,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;
