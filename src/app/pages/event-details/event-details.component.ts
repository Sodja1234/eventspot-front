import { Component, inject, OnInit } from '@angular/core';
import { EventSearch } from '../../models/event';
import { EventService } from '../../services/event.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EventCardComponent } from '../event-card/event-card.component';
import { QuillModule } from 'ngx-quill';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environnement/environnement';
import { ImageErrorService } from '../../services/image-error.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [EventCardComponent, QuillModule, NgFor, NgIf],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {
  event: EventSearch = {} as EventSearch;
  eventThrees: EventSearch[] = [];
  eventService: EventService = inject(EventService);
  userService: UserService = inject(UserService);
  imageErrorService: ImageErrorService = inject(ImageErrorService);
  id: number = -1;
  descriptionHtml: SafeHtml | undefined;
  subscribers: any[] = [];
  eventName = '';
  totalAbonnes = 0;
  userRole: string = '';
  baseUrl: string = environment.baseUrl;
  imageUrl: string = '';


  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = parseInt(params['id']);
      this.loadEvent(this.id);
      this.loadSubscribers(this.id);
      this.getUserRole().then(role => {
        this.userRole = role;
        console.log('Rôle de l’utilisateur :', this.userRole);
      }).catch(error => {
        console.error('Erreur lors de la récupération du rôle de l’utilisateur :', error);
      });

    });
    console.log(this.id);
  }

  async loadEvent(id: number) {
    try {
      const response = await firstValueFrom(this.eventService.getEventById(id));
      const responseLastEvent = await firstValueFrom(this.eventService.getLastEvents(3, id));

      this.event = response.data;
      this.eventThrees = responseLastEvent.data;

      this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(this.event.description);
      this.imageUrl = `${this.baseUrl}${this.event.media.url}`;
      console.log(this.event);
      console.log(this.event);
      console.log(this.eventThrees);

    } catch (error: any) {
      if (error.status === 404) {
        console.error('Erreur 404 : Ressource non trouvée.');
        console.log(error.status);

      } else {
        console.error('Une erreur est survenue :', error);
      }
    }
  }
  async loadSubscribers(eventId: number) {
    try {
      const res = await firstValueFrom(this.eventService.getSubscribers(eventId));
      this.eventName = res.event;
      this.totalAbonnes = res.total_abonnes;
      this.subscribers = res.abonnes;
      console.log('Inscrits de l’événement :', this.subscribers);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des inscrits :', error);
    }
  }

  handleImageError(event: Event) {
    this.imageErrorService.onImageError(event);
  }

  async getUserRole(): Promise<string> {
    const user = this.userService.getCurrentUser();
    return user?.role || '';
  }
}
