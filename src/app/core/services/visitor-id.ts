import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VisitorIdService {

    private readonly storageKey = 'gyneclinic_visitor_id';

    getVisitorId(): string {
        let visitorId = localStorage.getItem(this.storageKey);

        if (!visitorId) {
            visitorId = this.generateVisitorId();
            localStorage.setItem(this.storageKey, visitorId);
        }

        return visitorId;
    }

    private generateVisitorId(): string {
        return crypto.randomUUID();
    }
}