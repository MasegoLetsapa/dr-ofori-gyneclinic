export interface AnalyticsSummary {
    website: {
        totalVisits: number;
        uniqueVisitors: number;
        todayVisits: number;
        weekVisits: number;
        monthVisits: number;
    };

    articles: {
        totalViews: number;
        uniqueVisitors: number;
        totalShares: number;
    };

    sharesByPlatform: {
        platform: string;
        count: number;
    }[];
}

export interface ArticleAnalytics {
    id: number;
    title: string;
    slug: string;
    category?: string | null;
    isPublished: boolean;
    publishedAt?: string | null;

    totalViews: number;
    uniqueVisitors: number;

    totalShares: number;
    whatsappShares: number;
    facebookShares: number;
    xShares: number;
    copyLinkShares: number;
    nativeShares: number;
}

export interface VisitsTrend {
    date: string;
    visits: number;
    uniqueVisitors: number;
}

export interface TopPageAnalytics {
    pagePath: string;
    visits: number;
    uniqueVisitors: number;
}

export interface DeviceAnalytics {
    deviceType: string;
    visits: number;
    uniqueVisitors: number;
    percentage: number;
}

export interface VisitorLocationAnalytics {
    country: string;
    region: string | null;
    city: string | null;
    visits: number;
    uniqueVisitors: number;
}