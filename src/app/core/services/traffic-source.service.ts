import { Injectable } from '@angular/core';

export interface TrafficSourceData {
    sessionId: string;
    trafficSource: string;
    trafficMedium: string;
    trafficCampaign: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class TrafficSourceService {

    private readonly sessionStorageKey = 'gyneclinic_session_id';
    private readonly sourceStorageKey = 'gyneclinic_traffic_source';

    getTrafficData(): TrafficSourceData {
        const sessionId = this.getSessionId();

        const existingSource = sessionStorage.getItem(this.sourceStorageKey);

        if (existingSource) {
            return {
                sessionId,
                ...JSON.parse(existingSource)
            };
        }

        const source = this.detectTrafficSource();

        sessionStorage.setItem(
            this.sourceStorageKey,
            JSON.stringify(source)
        );

        return {
            sessionId,
            ...source
        };
    }

    private getSessionId(): string {
        let sessionId = sessionStorage.getItem(this.sessionStorageKey);

        if (!sessionId) {
            sessionId = crypto.randomUUID();

            sessionStorage.setItem(
                this.sessionStorageKey,
                sessionId
            );
        }

        return sessionId;
    }

    private detectTrafficSource(): {
        trafficSource: string;
        trafficMedium: string;
        trafficCampaign: string | null;
    } {
        const params = new URLSearchParams(window.location.search);

        const utmSource = params.get('utm_source')?.trim().toLowerCase();
        const utmMedium = params.get('utm_medium')?.trim().toLowerCase();
        const utmCampaign = params.get('utm_campaign')?.trim() || null;

        /*
         * UTM parameters take priority because they explicitly
         * identify the marketing source.
         */
        if (utmSource) {
            return {
                trafficSource: this.normalizeSource(utmSource),
                trafficMedium: utmMedium || 'referral',
                trafficCampaign: utmCampaign
            };
        }

        const referrer = document.referrer;

        /*
         * No referrer means the visitor typed the URL,
         * used a bookmark, or the browser did not provide
         * referrer information.
         */
        if (!referrer) {
            return {
                trafficSource: 'direct',
                trafficMedium: 'none',
                trafficCampaign: null
            };
        }

        try {
            const referrerUrl = new URL(referrer);
            const hostname = referrerUrl.hostname
                .toLowerCase()
                .replace(/^www\./, '');

            /*
             * Ignore our own website as a traffic source.
             */
            if (
                hostname === 'gyneclinic.org.za' ||
                hostname.endsWith('.gyneclinic.org.za')
            ) {
                return {
                    trafficSource: 'direct',
                    trafficMedium: 'none',
                    trafficCampaign: null
                };
            }

            /*
             * Search engines
             */
            if (
                hostname.includes('google.') ||
                hostname.includes('bing.') ||
                hostname.includes('yahoo.') ||
                hostname.includes('duckduckgo.') ||
                hostname.includes('baidu.')
            ) {
                return {
                    trafficSource: this.getBaseDomain(hostname),
                    trafficMedium: 'organic',
                    trafficCampaign: null
                };
            }

            /*
             * Social platforms
             */
            if (
                hostname.includes('facebook.com') ||
                hostname.includes('fb.com')
            ) {
                return {
                    trafficSource: 'facebook',
                    trafficMedium: 'social',
                    trafficCampaign: null
                };
            }

            if (
                hostname.includes('instagram.com')
            ) {
                return {
                    trafficSource: 'instagram',
                    trafficMedium: 'social',
                    trafficCampaign: null
                };
            }

            if (
                hostname.includes('tiktok.com')
            ) {
                return {
                    trafficSource: 'tiktok',
                    trafficMedium: 'social',
                    trafficCampaign: null
                };
            }

            if (
                hostname.includes('linkedin.com')
            ) {
                return {
                    trafficSource: 'linkedin',
                    trafficMedium: 'social',
                    trafficCampaign: null
                };
            }

            /*
             * WhatsApp referrals
             */
            if (
                hostname.includes('whatsapp.com') ||
                hostname.includes('wa.me')
            ) {
                return {
                    trafficSource: 'whatsapp',
                    trafficMedium: 'referral',
                    trafficCampaign: null
                };
            }

            /*
             * Any other external website.
             */
            return {
                trafficSource: this.getBaseDomain(hostname),
                trafficMedium: 'referral',
                trafficCampaign: null
            };

        } catch {
            return {
                trafficSource: 'direct',
                trafficMedium: 'none',
                trafficCampaign: null
            };
        }
    }

    private normalizeSource(source: string): string {
        return source
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .split('/')[0];
    }

    private getBaseDomain(hostname: string): string {
        const parts = hostname.split('.');

        if (parts.length >= 2) {
            return parts.slice(-2).join('.');
        }

        return hostname;
    }
}