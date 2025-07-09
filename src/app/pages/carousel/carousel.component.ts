import { Component, Input, inject } from '@angular/core';
import { EventSearch } from '../../models/event';
import { Router, RouterLink } from '@angular/router';
import { ImageErrorService } from '../../services/image-error.service';
import { environment } from '../../../environnement/environnement';

@Component({
  selector: 'app-carousel',
  imports: [RouterLink],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  @Input() events: EventSearch[] = [];
  imageErrorService: ImageErrorService = inject(ImageErrorService);
  baseUrl: string = environment.baseUrl

  handleImageError(event: Event) {
    this.imageErrorService.onImageError(event);
  }
}
