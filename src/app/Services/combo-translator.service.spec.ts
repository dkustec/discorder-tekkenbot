import { TestBed } from '@angular/core/testing';

import { ComboTranslatorService } from './combo-translator.service';

describe('ComboTranslatorService', () => {
  let service: ComboTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComboTranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
