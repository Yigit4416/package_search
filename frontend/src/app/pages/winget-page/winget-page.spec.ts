import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingetPage } from './winget-page';

describe('WingetPage', () => {
  let component: WingetPage;
  let fixture: ComponentFixture<WingetPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WingetPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WingetPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
