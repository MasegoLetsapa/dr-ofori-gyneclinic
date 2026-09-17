import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { CreateMessageRequest, Message, MessageResponse, UpdateMessageStatusRequest } from '../models/message.model';
import { Observable } from 'rxjs';

@Service()
export class MessageService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        'https://localhost:7003/api/messages';

    /**
     * Public contact form
     */
    createMessage(
        request: CreateMessageRequest
    ): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(
            this.apiUrl,
            request
        );
    }

    /**
     * Admin - get all messages
     */
    getMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(
            this.apiUrl
        );
    }

    /**
     * Admin - get one message
     */
    getMessage(id: number): Observable<Message> {
        return this.http.get<Message>(
            `${this.apiUrl}/${id}`
        );
    }

    /**
     * Admin - update message status
     */
    updateMessageStatus(
        id: number,
        status: string
    ): Observable<Message> {
        const request: UpdateMessageStatusRequest = {
            status
        };

        return this.http.put<Message>(
            `${this.apiUrl}/${id}/status`,
            request
        );
    }

    /**
     * Admin - delete message
     */
    deleteMessage(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}
