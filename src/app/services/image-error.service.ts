import { Injectable } from '@angular/core';
import { environment } from '../../environnement/environnement';

@Injectable({
  providedIn: 'root'
})

export class ImageErrorService {
  baseImg = environment.baseImg;
  onImageError(event: Event, fallbackUrl: string = this.baseImg): void {
    const img = event.target as HTMLImageElement;
    img.src = fallbackUrl;
  }

}
