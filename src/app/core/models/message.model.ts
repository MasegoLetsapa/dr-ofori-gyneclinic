export interface Message {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    messageBody: string;
    status: string;
    createdAt: string;
    readAt?: string | null;
    updatedAt?: string | null;
}

export interface MessageResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject?: string;
    messageBody: string;
    status: string;
    createdAt: string;
    readAt?: string;
    updatedAt?: string;
}

export interface CreateMessageRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject?: string;
    messageBody: string;
}

export interface UpdateMessageStatusRequest {
    status: string;
}