import nodemailer from "nodemailer";

/**
 * Mail Utility Protocol
 * Uses standard SMTP (e.g. Gmail) to dispatch system communications.
 */

// Configure the transporter
// NOTE: For Gmail, you need to use an "App Password" if 2FA is enabled.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL || "your-email@gmail.com",
        pass: process.env.SMTP_PASSWORD || "your-app-password"
    }
});

/**
 * Sends a confirmation email when a plan is purchased/activated.
 */
export async function sendPlanConfirmationEmail(hotelEmail: string, hotelName: string, planName: string, amount: number) {
    try {
        const info = await transporter.sendMail({
            from: `"HotelOS System" <${process.env.SMTP_EMAIL}>`,
            to: hotelEmail,
            subject: `[HotelOS] Node Activated: ${hotelName}`,
            html: `
            <div style="font-family: sans-serif; background: #0a0a0a; color: #fff; padding: 40px;">
                <h1 style="color: #b5f347; text-transform: uppercase;">Node Provisioned</h1>
                <p>Greetings ${hotelName},</p>
                <p>Your administrative authority has been successfully established on the HotelOS grid.</p>
                <hr style="border-color: #333;" />
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Settlement:</strong> ₹${amount}</p>
                <p><strong>Status:</strong> ACTIVE</p>
                <p>Your dashboard is now live and ready for command.</p>
            </div>
            `
        });
        console.log("Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}

/**
 * Sends the login credentials to the user immediately upon registration.
 * SECURITY NOTICE: Sending passwords via email is generally discouraged, 
 * but implemented here per specific client request.
 */
export async function sendCredentialsEmail(email: string, password: string, name: string) {
    try {
        const info = await transporter.sendMail({
            from: `"HotelOS Security" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: `[HotelOS] Secure Access Credentials`,
            html: `
            <div style="font-family: sans-serif; background: #0a0a0a; color: #fff; padding: 40px;">
                <h1 style="color: #b5f347; text-transform: uppercase;">Access Granted</h1>
                <p>Attention ${name},</p>
                <p>Your secure node credentials have been generated. Store these safely.</p>
                
                <div style="background: #111; padding: 20px; border: 1px solid #333; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 5px 0; color: #888; font-size: 12px; text-transform: uppercase;">Authorized Email Node</p>
                    <p style="margin: 0; font-size: 18px; font-weight: bold;">${email}</p>
                    
                    <div style="margin: 15px 0; border-top: 1px dashed #333;"></div>
                    
                    <p style="margin: 5px 0; color: #888; font-size: 12px; text-transform: uppercase;">Access Token (Password)</p>
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #b5f347;">${password}</p>
                </div>

                <p style="font-size: 12px; color: #666;">If you did not request this provisioning, terminate this message immediately.</p>
            </div>
            `
        });
        console.log("Credentials email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Failed to send credentials email:", error);
        return false;
    }
}
