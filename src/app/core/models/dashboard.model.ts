export interface DashboardAppointment {
    id: number;
    referenceNumber: string;
    patientName: string;
    service: string;
    preferredDate: string;
    preferredTime: string;
    status: string;
}

export interface DashboardActivity {
    action: string;
    description: string;
    createdAt: string;
}

export interface DashboardResponse {
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    recentAppointments: DashboardAppointment[];
    recentActivity: DashboardActivity[];
}