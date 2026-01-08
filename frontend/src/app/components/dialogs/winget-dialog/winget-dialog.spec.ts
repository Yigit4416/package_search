import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingetDialog } from './winget-dialog';

describe('WingetDialog', () => {
  let component: WingetDialog;
  let fixture: ComponentFixture<WingetDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WingetDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WingetDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
