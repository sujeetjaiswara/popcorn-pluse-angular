import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieItemPlaceholderComponent } from './movie-item-placeholder.component';

describe('MovieItemPlaceholderComponent', () => {
  let component: MovieItemPlaceholderComponent;
  let fixture: ComponentFixture<MovieItemPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieItemPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieItemPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
