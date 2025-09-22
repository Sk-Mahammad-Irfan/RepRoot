const nodemailer = require("nodemailer");
const emailValidator = require("email-validator");
const dns = require("dns").promises;

// Function to send email verification link
exports.verifyMail = async (token, email) => {
  try {
    if (!emailValidator.validate(email)) {
      return {
        success: false,
        message: "Invalid email format",
      };
    }

    const domain = email.split("@")[1];

    try {
      const mxRecords = await dns.resolveMx(domain);

      if (!mxRecords || mxRecords.length === 0) {
        return {
          success: false,
          message:
            "This email address can't receive messages. Please check for typos.",
        };
      }
    } catch (dnsError) {
      console.error("DNS Lookup Error:", dnsError);
      return {
        success: false,
        message:
          "We couldn't verify this email. Please check the address and try again.",
      };
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to RepRoot!</h2>
          <p>Thank you for registering. Please verify your email address:</p>
          <a href="${process.env.CLIENT_URL}/verify/${token}" 
             style="display:inline-block; padding:12px 25px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
             Verify Email
          </a>
          <p>If you didn’t request this, just ignore this email.</p>
          <p style="font-size:12px; color:#777;">Best regards,<br>The RepRoot Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email verify sent:", info.response);

    return {
      success: true,
      message: "Email sent successfully",
      info: info.response,
    };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return {
      success: false,
      message: "Internal error sending email",
      error: error.message,
    };
  }
};
