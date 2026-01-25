import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacmanDialog } from './pacman-dialog';

describe('PacmanDialog', () => {
  let component: PacmanDialog;
  let fixture: ComponentFixture<PacmanDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacmanDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacmanDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
