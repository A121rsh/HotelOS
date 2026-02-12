/**
 * Mail Utility Protocol
 * For demonstration and logging of internal communications.
 */

export async function sendPlanConfirmationEmail(hotelEmail: string, hotelName: string, planName: string, amount: number) {
    console.log(`
================================================================================
[OUTGOING COMMUNICATION PROTOCOL]
To: ${hotelEmail}
Subject: [HotelOS] Establishment of Authority Node - ${hotelName}
--------------------------------------------------------------------------------

HAVE AN ELITE EXPERIENCE, ${hotelName.toUpperCase()}

We are pleased to confirm that your authority node has been successfully 
provisioned on the HotelOS grid.

SELECTION DETAILS:
- Plan: ${planName} Executive Tier
- Settlement Amount: ₹${amount.toLocaleString()}
- Status: ACTIVE / FULL DELEGATION

YOUR DASHBOARD IS NOW LIVE:
You have been granted root access to your property management headquarters. 
Our systems are synchronizing your local inventory and staff registries.

Thank you for choosing HotelOS for your property automation.

COMMUNICATION DISPATCHED: ${new Date().toISOString()}
================================================================================
    `);

    // In a real implementation:
    // await resend.emails.send({ ... })

    return true;
}
