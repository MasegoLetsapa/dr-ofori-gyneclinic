import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { NotificationCenter } from '../../shared/notification-center/notification-center';
import { SocialFloat } from '../../shared/social-float/social-float';

@Component({
  imports: [RouterOutlet, AdminSidebar, NotificationCenter],
  selector: 'app-admin-layout',
  standalone: true,
  styleUrl: './admin-layout.scss',
  templateUrl: './admin-layout.html',
})
export class AdminLayout { }
