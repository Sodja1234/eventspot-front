import { TestBed } from '@angular/core/testing';

import { ImageErrorService } from './image-error.service';

describe('ImageErrorService', () => {
  let service: ImageErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
