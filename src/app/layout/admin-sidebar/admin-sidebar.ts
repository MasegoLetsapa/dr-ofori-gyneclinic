import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../../shared/icon/icon';

@Component({
  imports: [RouterLink, RouterLinkActive, Icon],
  standalone: true,
  selector: 'app-admin-sidebar',
  styleUrl: './admin-sidebar.scss',
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {

  @Input()
  mobileMenuOpen = false;

  @Output()
  closeMobileMenu = new EventEmitter<void>();

  navigationItems = [
    {
      label: 'Dashboard',
      route: '/admin',
      icon: 'dashboard'
    },
    {
      label: 'Analytics',
      route: '/admin/analytics',
      icon: 'analytics'
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
      label: 'Articles',
      route: '/admin/articles',
      icon: 'articles'
    },
    {
      label: 'Subscribers',
      route: '/admin/subscribers',
      icon: 'subscribers'
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
