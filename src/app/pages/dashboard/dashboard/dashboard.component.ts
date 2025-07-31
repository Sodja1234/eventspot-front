import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MesEvenementComponent } from '../composants/evenement/mes-evenement/mes-evenement.component';
import { CardEveneemntComponent } from "../composants/evenement/card-eveneemnt/card-eveneemnt.component";

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink,RouterModule, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  name = localStorage.getItem('name') ?? 'Cher organisateur' ;
}
