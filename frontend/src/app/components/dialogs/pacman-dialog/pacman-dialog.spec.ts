import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PacmanDialog } from './pacman-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArchService } from '../../../services/arch/arch-service';
import { signal } from '@angular/core';

describe('PacmanDialog', () => {
  let component: PacmanDialog;
  let fixture: ComponentFixture<PacmanDialog>;
  let archServiceMock: Partial<ArchService>;

  beforeEach(async () => {
    archServiceMock = {
      pacmanSpecificPackageResult: signal(null),
      pacmanSpecificPackage: () => { }
    };

    await TestBed.configureTestingModule({
      imports: [PacmanDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: { packageName: 'test' } },
        { provide: ArchService, useValue: archServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PacmanDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
