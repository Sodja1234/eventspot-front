import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventSearch } from '../../models/event';
import { EventService } from '../../services/event.service';
import { firstValueFrom } from 'rxjs';
import { initFlowbite } from 'flowbite';
import { Interet } from '../../models/interet';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-home',
  imports: [NgFor, NgIf, EventCardComponent, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  images = [
    'https://images.unsplash.com/photo-1626107096629-834f944251af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZyZWUlMjBhdWRpdG9yaXVtfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1568772472528-9f7f5795e094?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyZWUlMjBhdWRpdG9yaXVtfGVufDB8fDB8fHww',
    'https://plus.unsplash.com/premium_photo-1724753996329-3eef20c164c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZyZWUlMjBhdWRpdG9yaXVtfGVufDB8fDB8fHww',
  ];

  eventThrees: EventSearch[] = [];
  eventInterets: EventSearch[] = [];
  eventService: EventService = inject(EventService);
  isLogged: boolean = false;
  interets: Interet[] = JSON.parse(localStorage.getItem('interets') || '[]');
  count: number = 6;

  ngOnInit(): void {
    initFlowbite();
    this.loadEvents();
  }

  ngOnDestroy(): void { }

  async loadEvents() {
    try {
      const response = await firstValueFrom(this.eventService.getLastEvents(6));
      this.eventThrees = response.data;
      console.log(this.eventThrees);

      this.isLogged = (localStorage.getItem('token') != null) ? true : false;
      if (this.interets.length > 0 && this.isLogged) {
        this.count = (this.interets.length == 2) ? 3 : 6;
        this.count = (this.interets.length == 3) ? 2 : 6;
        for (let i = 0; i < this.interets.length; i++) {
          const responseInterets = await firstValueFrom(this.eventService.getEventByInterets(this.interets[i].nom, this.count));
          console.log(this.interets[i].nom);
          console.log(responseInterets);
          console.log(responseInterets.data);
          this.eventInterets.push(...responseInterets.data);
        }
      }
    } catch (error: any) {
      if (error.status === 404) {
        console.error('Erreur 404 : Ressource non trouvée.');
        console.log(error.status);

      } else {
        console.error('Une erreur est survenue :', error);
      }
    }
  }
}
