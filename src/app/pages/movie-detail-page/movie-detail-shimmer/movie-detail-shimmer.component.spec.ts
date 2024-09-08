import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailShimmerComponent } from './movie-detail-shimmer.component';

describe('MovieDetailShimmerComponent', () => {
  let component: MovieDetailShimmerComponent;
  let fixture: ComponentFixture<MovieDetailShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailShimmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDetailShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
