import { Component, inject, Input } from '@angular/core';
import { EventService } from '../../services/event.service';
import { firstValueFrom } from 'rxjs';
import { Etat } from '../../models/etat';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-favorite',
  imports: [NgIf, NgClass],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
  @Input() favorite: string = '';
  @Input() subscribe: string = '';
  @Input() id: number = 0;
  @Input() color = 'text-black';
  eventService: EventService = inject(EventService);
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  stateFavorite: Etat = {} as Etat;
  stateSubscribe: Etat = {} as Etat;
  isFavorite = false;
  isSubscribe = false;

  ngOnInit() {
    this.isFavorite = this.favorite == '1' ? true : false;
    this.isSubscribe = this.subscribe == '1' ? true : false;
  }

  async markAsSubscribe() {
    try {
      const responseSubscribe = await firstValueFrom(this.eventService.addSubscribe(this.id));
      this.stateSubscribe = responseSubscribe.data;
      this.isSubscribe = this.stateSubscribe.etat == 1 ? true : false;
      console.log('stateSubscribe', this.id, ' : ', this.stateSubscribe.etat);
      console.log('Toogle effectuer :', responseSubscribe);
    } catch (error) {
      console.error('Erreur lors de l’ajout du Souscrption', error);
    }
  }

  async markAsFavorite() {
    try {
      const responseFavorite = await firstValueFrom(this.eventService.addFavorite(this.id));
      this.stateFavorite = responseFavorite.data;
      this.isFavorite = this.stateFavorite.etat == 1 ? true : false;
      console.log('stateFavorite', this.id, ' : ', this.stateFavorite.etat);
      console.log('Toogle effectuer :', responseFavorite);
    } catch (error) {
      console.error('Erreur lors de l’ajout du favori', error);
    }
  }

  toggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.userService.getToken()) {
      this.markAsFavorite();
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleSubscribe(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.userService.getToken()) {
      this.markAsSubscribe();
    } else {
      this.router.navigate(['/login']);
    }
  }
}
