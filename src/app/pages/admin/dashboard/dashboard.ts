import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  standalone: true,
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  // Temporary dashboard data.
  // We will replace these with API data shortly.

  totalAppointments = signal(1);
  pendingAppointments = signal(0);
  confirmedAppointments = signal(1);
  completedAppointments = signal(0);
  cancelledAppointments = signal(0);

  recentAppointments = [
    {
      time: '—',
      patient: 'Test Patient',
      service: 'Pregnancy Care',
      status: 'Confirmed'
    }
  ];

  recentActivity = [
    {
      action: 'Appointment confirmed',
      description: 'Pregnancy Care appointment was confirmed.',
      time: 'Recently'
    },
    {
      action: 'Appointment received',
      description: 'New appointment request received.',
      time: 'Recently'
    }
  ];

}
