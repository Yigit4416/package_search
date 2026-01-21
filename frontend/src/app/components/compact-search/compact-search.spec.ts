import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactSearch } from './compact-search';

describe('CompactSearch', () => {
  let component: CompactSearch;
  let fixture: ComponentFixture<CompactSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompactSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompactSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
