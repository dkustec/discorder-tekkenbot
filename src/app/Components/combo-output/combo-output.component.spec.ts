import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboOutputComponent } from './combo-output.component';

describe('ComboOutputComponent', () => {
  let component: ComboOutputComponent;
  let fixture: ComponentFixture<ComboOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
