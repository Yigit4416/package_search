import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WingetDialog } from './winget-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WingetService } from '../../../services/winget/winget-service';
import { signal } from '@angular/core';

describe('WingetDialog', () => {
  let component: WingetDialog;
  let fixture: ComponentFixture<WingetDialog>;
  let wingetServiceMock: Partial<WingetService>;

  beforeEach(async () => {
    wingetServiceMock = {
      wingetPackageSpecific: signal(null),
      wingetSpecificSearch: () => { },
      wingetSearch: signal([]),
      loading: signal(false)
    };

    await TestBed.configureTestingModule({
      imports: [WingetDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: { packageName: 'test' } },
        { provide: WingetService, useValue: wingetServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WingetDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
