const nodemailer = require("nodemailer");
const emailValidator = require("email-validator");
const dns = require("dns").promises;

exports.sendOtpMail = async (email, otp) => {
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
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email OTP sent:", info.response);

    return {
      success: true,
      message: "Email sent successfully",
      info: info.response,
    };
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
