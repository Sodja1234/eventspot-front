import { Component, OnInit } from '@angular/core';
import { TriEvenementComponent } from "../tri-evenement/tri-evenement.component";
import { CardEveneemntComponent } from "../card-eveneemnt/card-eveneemnt.component";
import { EventService } from '../../../../../services/event.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-mes-evenement',
  imports: [CardEveneemntComponent, NgFor, NgIf, TriEvenementComponent],
  templateUrl: './mes-evenement.component.html',
  styleUrl: './mes-evenement.component.css'
})
export class MesEvenementComponent implements OnInit {
  evenements: any[] = [];
  loading = true;
  page = 1;
  perPage = 6;
  meta: any;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading = true;
    this.eventService.getOrganizerEvents('all', '', this.page, this.perPage).subscribe({
      next: (res) => {
        this.evenements = res.data;
        this.meta = res.meta;
        this.loading = false;
      },
      error: () => {
        this.evenements = [];
        this.loading = false;
      },
    });
  }

  nextPage() {
    if (this.meta && this.page < this.meta.last_page) {
      this.page++;
      this.fetchEvents();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchEvents();
    }
  }
}