import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { User, UserSearch } from '../../models/user';
import { EventSearch } from '../../models/event';
import { Interet } from '../../models/interet';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  userService: UserService = inject(UserService);
  eventService: EventService = inject(EventService);
  user: UserSearch = {} as UserSearch;
  //userUpdated: User = {} as User;
  eventInterets: EventSearch[] = [];
  eventFavorites: EventSearch[] = [];
  id = localStorage.getItem('userId');
  username = localStorage.getItem('name');
  email = localStorage.getItem('email');
  interets: Interet[] = JSON.parse(localStorage.getItem('interets') || '[]');
  idInterets: number[] = this.interets.map(interet => (interet as Interet).id);

  editForm = new FormGroup({
      nameForm: new FormControl<string>(''),
      interetsForm: new FormControl(''),
    })
  allInterets: Interet[] = [];
  joinDate: string | null = null;
  isFavorite: boolean = false;
  isInterest: boolean = false;
  count: number = 3;
  token = localStorage.getItem('token') ?? '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.load('user');
    console.log(this.editForm.value.nameForm);
  }
  async load(data: string) {
    if (data == 'user') {
      const response = await firstValueFrom(this.userService.getUserById(this.id ?? '0'));
      const responseInterets = await firstValueFrom(this.userService.getInterets());
      this.user = response.data;
      this.allInterets = responseInterets;
      this.joinDate = this.user.created_at;
      this.editForm.setControl('nameForm', new FormControl(this.user.name));
      console.log(this.user);
      console.log(this.allInterets);
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
    if(data == 'interets'){
      this.eventInterets = [];
      const responseInterets = await firstValueFrom(this.userService.getInterets());
      this.allInterets = responseInterets;
      console.log(this.allInterets);
    }
  }

  deleteInteret(id: number) {
    console.log("le bouton fonctionne");
    console.log(this.interets);
    this.interets = this.interets.filter(interet => interet.id !== id);
    this.idInterets = this.interets.map(interet => (interet as Interet).id);
    console.log(this.interets);
    console.log(this.idInterets);
  }
  addInteret() {
    console.log("le bouton fonctionne");
    this.showInteretsSelection();
  }

  async updateProfile(){
    const name = this.editForm.value.nameForm;
    console.log(this.editForm.value)
    const ids: number[] = this.interets.map(interet => interet.id);

    console.log(this.editForm.value.nameForm);
    console.log(ids);
    const response = await firstValueFrom(this.userService.updateProfile(parseInt(this.id ?? '0'), name ?? '', ids));
    const userUpdated = response?.data;
    console.log("userUpdated ",userUpdated);
    localStorage.removeItem('interets');
    localStorage.setItem('interets', JSON.stringify(userUpdated.interets));
    localStorage.removeItem('name');
    localStorage.setItem('name', userUpdated.name);
    console.log("response ",response);
  }
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
  submit(){
    this.updateProfile();
    //localStorage.setItem('name', this.userUpdated.name);
    //localStorage.setItem('interets', JSON.stringify(this.userUpdated.interests));
    //localStorage.setItem('interets', JSON.stringify(userData.interets));


    this.router.navigate(['/profile']);
  }

  showInteretsSelection() {
    // Construire le HTML des checkboxes avec un conteneur scrollable
    const htmlCheckboxes = `
    <div style="max-height: 300px; overflow-y: auto; text-align: left;">
      ${this.allInterets.map(interet => `
        <div style="margin-bottom: 5px;">
          <input type="checkbox" id="interet-${interet.id}" name="interets" value="${interet.id}">
          <label for="interet-${interet.id}">${interet.nom}</label>
        </div>
      `).join('')}
    </div>
  `;

    Swal.fire({
      title: 'Sélectionnez vos centres d\'intérêt',
      html: htmlCheckboxes,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Valider',
      width: '50vw',   // 50% de la largeur de la fenêtre
      heightAuto: false, // Désactive la hauteur automatique pour permettre la hauteur personnalisée
      customClass: {
        popup: 'swal2-custom-size'
      },
      preConfirm: () => {
        const checkedBoxes = [...document.querySelectorAll('input[name="interets"]:checked')];
        if (checkedBoxes.length === 0) {
          Swal.showValidationMessage('Veuillez sélectionner au moins un centre d\'intérêt');
        }
        return checkedBoxes.map(cb => (cb as HTMLInputElement).value);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedIds: string[] = result.value;

        // Extraire les interets sélectionnés depuis allInterets
        const interetsFiltres = this.allInterets.filter(interet => selectedIds.includes(interet.id.toString()));

        // Ajouter dans this.interets sans doublons
        interetsFiltres.forEach(i => {
          if (!this.interets.some(existing => existing.id === i.id)) {
            this.interets.push(i);
          }
        });

        // Afficher les noms sélectionnés (dans this.interets mis à jour)
        const selectedNoms = this.interets
          .filter(i => selectedIds.includes(i.id.toString()))
          .map(i => i.nom);

        Swal.fire(
          'Sélection validée',
          'Vous avez choisi : ' + selectedNoms.join(', '),
          'success'
        );

        console.log('Centres d\'intérêt sélectionnés :', selectedIds);
        console.log('Liste this.interets mise à jour :', this.interets);
      }
    });
  }


}
