import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventSearch } from '../../models/event';
import { environment } from './../../../environnement/environnement'
import { NgIf } from '@angular/common';
import { EventService } from '../../services/event.service';
import { Etat } from '../../models/etat';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-event-card',
  imports: [RouterLink, NgIf],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  router: Router = inject(Router);
  @Input() event?: EventSearch;
  baseUrl = environment.baseUrl;
  eventService: EventService = inject(EventService);
  userService: UserService = inject(UserService);
  isFavorited = false;
  isSusccribed = false;
  etat: Etat = {} as Etat;

  navigateToEvent() {
    this.router.navigate(['/event', this.event?.id]);
  }
  ngOnInit(){
    if (this.userService.getToken()){
      this.load();
    }
  }
  async load(){
    try {
      const response = await firstValueFrom(this.eventService.verifyFavorite(this.event?.id ?? 0));
      this.etat = response.data ;
      this.isFavorited = this.etat.etat == 1 ? true : false;
      console.log(this.etat.etat);


    } catch (error: any) {
      if (error.status === 404) {
        console.error('Erreur 404 : Ressource non trouvée.');
        console.log(error.status);

      } else {
        console.error('Une erreur est survenue :', error);
      }
    }
  }

  async markAsFavorite() {
    let token = this.userService.getToken();
    try {
      const response = await firstValueFrom(this.eventService.addFavorite(this.event?.id ?? 0));
      console.log('Favori ajouté avec succès', response);
    } catch (error) {
      console.error('Erreur lors de l’ajout du favori', error);
    }
  }
  toggleFavorite(event: MouseEvent){
    event.stopPropagation();
    event.preventDefault();
    this.markAsFavorite();
    this.ngOnInit();
  }
  toggleSuscribe(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isSusccribed = !this.isSusccribed;
  }
}
