import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AurDialog } from './aur-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArchService } from '../../../services/arch/arch-service';
import { signal } from '@angular/core';

describe('AurDialog', () => {
  let component: AurDialog;
  let fixture: ComponentFixture<AurDialog>;
  let archServiceMock: Partial<ArchService>;

  beforeEach(async () => {
    archServiceMock = {
      aurSpecificPackageResult: signal(null),
      aurSpecificPackage: () => { },
    };

    await TestBed.configureTestingModule({
      imports: [AurDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: { packageName: 'test' } },
        { provide: ArchService, useValue: archServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AurDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
