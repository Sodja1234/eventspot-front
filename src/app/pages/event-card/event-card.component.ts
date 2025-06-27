import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventSearch } from '../../models/event';
import { environment } from './../../../environnement/environnement'

@Component({
  selector: 'app-event-card',
  imports: [RouterLink],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  router: Router = inject(Router);
  @Input() event?: EventSearch;
  baseUrl = environment.baseUrl;

  navigateToEvent() {
    this.router.navigate(['/event', this.event?.id]);
  }
}
