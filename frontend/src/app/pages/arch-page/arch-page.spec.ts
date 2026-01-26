import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArchPage } from './arch-page';

describe('ArchPage', () => {
  let component: ArchPage;
  let fixture: ComponentFixture<ArchPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchPage],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ArchPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
