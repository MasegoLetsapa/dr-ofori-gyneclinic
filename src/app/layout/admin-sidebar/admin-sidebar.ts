import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  selector: 'app-admin-sidebar',
  styleUrl: './admin-sidebar.scss',
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {

  navigationItems = [
    {
      label: 'Dashboard',
      route: '/admin',
      icon: 'dashboard'
    },
    {
      label: 'Appointments',
      route: '/admin/appointments',
      icon: 'calendar'
    },
    {
      label: 'Patients',
      route: '/admin/patients',
      icon: 'users'
    },
    {
      label: 'Services',
      route: '/admin/services',
      icon: 'services'
    },
    {
      label: 'Messages',
      route: '/admin/messages',
      icon: 'messages'
    }
  ];

  bottomItems = [
    {
      label: 'Settings',
      route: '/admin/settings',
      icon: 'settings'
    }
  ];

}
