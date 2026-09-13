import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';

@Component({
  imports: [RouterOutlet, AdminSidebar],
  selector: 'app-admin-layout',
  standalone: true,
  styleUrl: './admin-layout.scss',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {}
