import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AurDialog } from './aur-dialog';

describe('AurDialog', () => {
  let component: AurDialog;
  let fixture: ComponentFixture<AurDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AurDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AurDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
