export declare class EmailService {
    private transporter;
    constructor();
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetLink: string): Promise<void>;
    sendOrderConfirmationEmail(email: string, orderData: {
        orderId: string;
        totalAmount: number;
        discountAmount: number;
        items: {
            name: string;
            quantity: number;
            price: number;
        }[];
        address: string;
        paymentMethod: string;
    }): Promise<void>;
    sendOrderStatusUpdateEmail(email: string, orderData: {
        orderId: string;
        status: string;
        statusLabel: string;
    }): Promise<void>;
}
