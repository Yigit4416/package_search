import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CompactSearchComponent } from './compact-search';

describe('CompactSearchComponent', () => {
  let component: CompactSearchComponent;
  let fixture: ComponentFixture<CompactSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompactSearchComponent],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CompactSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
