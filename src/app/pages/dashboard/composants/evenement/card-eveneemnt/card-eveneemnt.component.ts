import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-card-eveneemnt',
  imports: [CommonModule, RouterLink , RouterLinkActive],
  templateUrl: './card-eveneemnt.component.html',
  styleUrl: './card-eveneemnt.component.css'
})
export class CardEveneemntComponent {
@Input() event: any; getStatus(): string {
    const now = new Date();
    const start = new Date(this.event.date_time_start);
    const end = new Date(this.event.date_time_end);

    if (now < start) return 'À venir';
    if (now > end) return 'Terminé';
    return 'En cours';
  }

  getBadgeColor(): string {
    const status = this.getStatus();
    return status === 'Terminé' ? 'bg-red-500'
         : status === 'En cours' ? 'bg-yellow-500'
         : 'bg-green-500';
  }

  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
