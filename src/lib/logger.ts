import { db } from "./db";

type LogType = "LOGIN" | "FAILED_LOGIN" | "LOGOUT" | "ADMIN_ACTION" | "PAYMENT" | "ERROR";
type Severity = "INFO" | "WARNING" | "CRITICAL";

interface LogParams {
    type: LogType;
    severity?: Severity;
    message: string;
    userId?: string;
    hotelId?: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
}

export async function recordAuditLog({
    type,
    severity = "INFO",
    message,
    userId,
    hotelId,
    metadata,
    ipAddress,
    userAgent
}: LogParams) {
    try {
        await db.auditLog.create({
            data: {
                type,
                severity,
                message,
                userId,
                hotelId,
                metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
                ipAddress,
                userAgent
            }
        });
    } catch (error) {
        console.error("CRITICAL: Failed to record audit log:", error);
    }
}
