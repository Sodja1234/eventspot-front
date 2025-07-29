import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventSearch } from '../../models/event';
import { environment } from './../../../environnement/environnement';
import { EventService } from '../../services/event.service';
import { Etat } from '../../models/etat';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ImageErrorService } from '../../services/image-error.service';
import { FavoriteComponent } from '../favorite/favorite.component';

@Component({
  selector: 'app-event-card',
  imports: [CommonModule, RouterLink, FavoriteComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  router: Router = inject(Router);
  @Input() event?: EventSearch;
  baseUrl = environment.baseUrl;
  eventService: EventService = inject(EventService);
  userService: UserService = inject(UserService);
  imageErrorService: ImageErrorService = inject(ImageErrorService);
  isFavorited = false;
  isSusccribed = false;
  etatFavorite: Etat = {} as Etat;
  etatSubscribe: Etat = {} as Etat;
  color = 'text-black'

  navigateToEvent() {
    this.router.navigate(['/event', this.event?.id]);
  }
  ngOnInit() {
  }

  handleImageError(event: Event) {
    this.imageErrorService.onImageError(event);
  }
}
