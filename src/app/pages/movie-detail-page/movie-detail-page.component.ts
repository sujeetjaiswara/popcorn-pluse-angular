import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MovieDetailComponent } from '../../components';
import { DataService, MovieService } from '../../services';

@Component({
  selector: 'app-movie-detail-page',
  standalone: true,
  imports: [DecimalPipe, CurrencyPipe, MovieDetailComponent],
  templateUrl: './movie-detail-page.component.html',
  styleUrl: './movie-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailPageComponent {
  private route = inject(ActivatedRoute);
  private destroy: DestroyRef = inject(DestroyRef);
  protected dataService = inject(DataService);
  protected movieService = inject(MovieService);

  constructor(private _cd: ChangeDetectorRef) {
    afterNextRender(() => {
      const movieId = Number(this.route.snapshot.paramMap.get('id'));
      this.getDetail(movieId);
    });
  }

  getDetail(id: number) {
    this.dataService
      .getMovieDetail(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => this.movieService.setSelectedMovie(data),
        error: (err) => console.error(err),
        complete: () => this._cd.detectChanges(),
      });
  }

  getSimilar(id: number) {
    this.dataService
      .getSimilarMovies(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => this.movieService.setSimilarMovies(data.results),
        error: (err) => console.error(err),
        complete: () => this._cd.detectChanges(),
      });
  }

  onImageError(poster_path: string) {
    console.warn(`${poster_path} image not able to loaded`);
  }
}
