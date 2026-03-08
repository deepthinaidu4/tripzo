// utils/sendEmail.js

const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify()
    .then(() => {
        console.log("✅ Email service ready");
    })
    .catch((error) => {
        console.error("❌ Email service error:", error.message);
    });

async function sendEmailOTP(to, otp) {
    try {
        const info = await transporter.sendMail({
            from: `"Tripzo" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: "Your Tripzo OTP Code",
            text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🧳 Tripzo</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">OTP Verification</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">
                            Enter this code to complete your registration:
                        </p>
                        
                        <div style="background: #f8f9fa; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #667eea; padding: 15px 10px;">
                            <span style="font-size: clamp(24px, 8vw, 42px); font-weight: bold; color: #667eea; letter-spacing: clamp(2px, 2vw, 12px); font-family: 'Courier New', monospace; white-space: nowrap; overflow-x: auto; display: block;">${otp}</span>
                        </div>
                        
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                                ⏰ <strong>This code expires in 10 minutes</strong>
                            </p>
                        </div>
                        
                        <p style="color: #999; font-size: 14px; margin-bottom: 0;">
                            If you didn't request this code, please ignore this email or contact our support team.
                        </p>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                        <p>© 2025 Tripzo. All rights reserved.</p>
                    </div>
                </div>
            `,
        });

        console.log("✅ OTP sent successfully to:", to);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Failed to send OTP:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendEmailOTP };