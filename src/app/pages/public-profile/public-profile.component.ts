import { Component, inject, OnInit } from '@angular/core';
import { UserSearch } from '../../models/user';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { Interet } from '../../models/interet';
import { EventService } from '../../services/event.service';
import { EventSearch } from '../../models/event';
import { EventCardComponent } from '../event-card/event-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  imports: [NgIf, NgFor, EventCardComponent, RouterLink],
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.css'
})
export class PublicProfileComponent implements OnInit{
  // @ViewChild('interets') interets: ElementRef;
  userService: UserService = inject(UserService);
  eventService: EventService = inject(EventService);
  user: UserSearch = {} as UserSearch;
  eventInterets: EventSearch[] = [];
  eventFavorites: EventSearch[] = [];
  id = localStorage.getItem('userId');
  username = localStorage.getItem('name');
  email = localStorage.getItem('email');
  interets: Interet[] = [];
  joinDate: string | null = null;
  isFavorite: boolean = false;
  isInterest: boolean = false;
  count: number = 3;
  token = localStorage.getItem('token') ?? '';

  ngOnInit() {
    this.load('user');
    this.interets = JSON.parse(localStorage.getItem('interets') || '[]');
    //window.location.reload();
    
  }

  async load(data: string) {
    if (data == 'user') {
      const response = await firstValueFrom(this.userService.getUserById(this.id ?? '0'));
      this.user = response.data;
      this.joinDate = this.user.created_at;
      console.log(this.user);
    }
    if (data == 'favorite') {
      const responseFavorites = await firstValueFrom(this.eventService.getFavoriteEvents(this.token));
      this.eventFavorites = responseFavorites.data;
      console.log(this.eventFavorites);
    }
    if (data == 'interets' && this.interets.length) {
      this.eventInterets = [];
      for (let i = 0; i < this.interets.length; i++) {
        const responseInterets = await firstValueFrom(this.eventService.getEventByInterets(this.interets[i].nom, this.count));
        this.eventInterets.push(...responseInterets.data);
      }
      console.log(this.eventInterets);
    }
  }

  toogleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.isInterest = false;
    this.load('favorite');
  }

  toogleInterets() {
    this.isInterest = !this.isInterest;
    this.isFavorite = false;
    this.load('interets');
  }
}
