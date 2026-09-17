import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Message
} from '../../../core/models/message.model';

import {
  MessageService
} from '../../../core/services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.scss'
})
export class Messages implements OnInit {

  private readonly messageService = inject(MessageService);

  messages = signal<Message[]>([]);

  selectedMessage = signal<Message | null>(null);

  searchTerm = signal('');
  selectedStatus = signal('All');

  isLoading = signal(false);
  errorMessage = signal('');

  updatingStatus = signal(false);
  deletingMessage = signal(false);

  messageToDelete = signal<Message | null>(null);

  totalMessages = computed(() =>
    this.messages().length
  );

  unreadMessages = computed(() =>
    this.messages().filter(
      message => message.status === 'Unread'
    ).length
  );

  readMessages = computed(() =>
    this.messages().filter(
      message => message.status === 'Read'
    ).length
  );

  archivedMessages = computed(() =>
    this.messages().filter(
      message => message.status === 'Archived'
    ).length
  );

  filteredMessages = computed(() => {

    const search = this.searchTerm()
      .trim()
      .toLowerCase();

    const status = this.selectedStatus();

    return this.messages().filter(message => {

      const matchesSearch =
        !search ||
        `${message.firstName} ${message.lastName}`
          .toLowerCase()
          .includes(search) ||
        message.email
          .toLowerCase()
          .includes(search) ||
        (message.subject ?? '')
          .toLowerCase()
          .includes(search) ||
        message.messageBody
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        status === 'All' ||
        message.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.messageService.getMessages().subscribe({
      next: messages => {

        this.messages.set(messages);

        this.isLoading.set(false);
      },

      error: error => {

        console.error(
          'Failed to load messages:',
          error
        );

        this.errorMessage.set(
          'Unable to load messages. Please try again.'
        );

        this.isLoading.set(false);
      }
    });
  }

  openMessage(message: Message): void {

    this.selectedMessage.set(message);

    if (message.status === 'Unread') {
      this.updateStatus(message, 'Read');
    }
  }

  closeMessage(): void {
    this.selectedMessage.set(null);
  }

  updateStatus(
    message: Message,
    status: string
  ): void {

    this.updatingStatus.set(true);

    this.messageService
      .updateMessageStatus(message.id, status)
      .subscribe({

        next: updatedMessage => {

          this.messages.update(messages =>
            messages.map(item =>
              item.id === updatedMessage.id
                ? updatedMessage
                : item
            )
          );

          if (
            this.selectedMessage()?.id ===
            updatedMessage.id
          ) {
            this.selectedMessage.set(updatedMessage);
          }

          this.updatingStatus.set(false);
        },

        error: error => {

          console.error(
            'Failed to update message status:',
            error
          );

          this.updatingStatus.set(false);
        }
      });
  }

  archiveMessage(message: Message): void {
    this.updateStatus(message, 'Archived');
  }

  markAsRead(message: Message): void {
    this.updateStatus(message, 'Read');
  }

  markAsUnread(message: Message): void {
    this.updateStatus(message, 'Unread');
  }

  confirmDelete(message: Message): void {
    this.messageToDelete.set(message);
  }

  cancelDelete(): void {
    this.messageToDelete.set(null);
  }

  deleteMessage(): void {

    const message =
      this.messageToDelete();

    if (!message) {
      return;
    }

    this.deletingMessage.set(true);

    this.messageService
      .deleteMessage(message.id)
      .subscribe({

        next: () => {

          this.messages.update(messages =>
            messages.filter(
              item => item.id !== message.id
            )
          );

          if (
            this.selectedMessage()?.id ===
            message.id
          ) {
            this.selectedMessage.set(null);
          }

          this.messageToDelete.set(null);
          this.deletingMessage.set(false);
        },

        error: error => {

          console.error(
            'Failed to delete message:',
            error
          );

          this.deletingMessage.set(false);
        }
      });
  }

  getInitials(message: Message): string {

    const first =
      message.firstName?.charAt(0) ?? '';

    const last =
      message.lastName?.charAt(0) ?? '';

    return `${first}${last}`.toUpperCase();
  }

  formatDate(date: string): string {

    return new Intl.DateTimeFormat(
      'en-ZA',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(new Date(date));
  }

  formatDateTime(date: string): string {

    return new Intl.DateTimeFormat(
      'en-ZA',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(new Date(date));
  }
}