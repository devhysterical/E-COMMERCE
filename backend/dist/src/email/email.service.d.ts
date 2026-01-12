export declare class EmailService {
    private transporter;
    constructor();
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetLink: string): Promise<void>;
}
