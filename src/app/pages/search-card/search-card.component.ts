import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventSearch } from '../../models/event';
import { Category } from '../../models/category';
import { ImageErrorService } from '../../services/image-error.service';
import { environment } from '../../../environnement/environnement';

@Component({
  selector: 'app-search-card',
  imports: [RouterLink],
  templateUrl: './search-card.component.html',
  styleUrl: './search-card.component.css'
})
export class SearchCardComponent {
  router: Router = inject(Router);
  baseUrl = environment.baseUrl;
  imageErrorService: ImageErrorService = inject(ImageErrorService);
  @Input() event?: EventSearch;
  categories : Category[] = this.event?.categories || [];

  handleImageError(event: Event) {
    this.imageErrorService.onImageError(event);
  }
}
