import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  afterNextRender,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-detail-page',
  standalone: true,
  imports: [],
  templateUrl: './movie-detail-page.component.html',
  styleUrl: './movie-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailPageComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  protected movieService = inject(MovieService);
  private subDetail = new Subscription();
  private subSimilar = new Subscription();
  // public similar: WritableSignal<Movie> = signal('');

  constructor(private _cd: ChangeDetectorRef) {
    afterNextRender(() => {
      console.log(this.route.snapshot.paramMap.get('id'));
    });
  }

  getDetail(id: number) {
    this.subDetail = this.dataService.getMovieDetail(id).subscribe({
      next: (rs) => this.movieService.setSelectedMovie(rs),
      error: (err) => console.error(err),
      complete: () => this._cd.detectChanges(),
    });
  }

  // getSimilar(id: number) {
  //   this.subSimilar = this.dataService.getSimilarMovies(id).subscribe({
  //     next: (rs) => (this.similar = [...rs.results]),
  //     error: (err) => console.error(err),
  //     complete: () => this._cd.detectChanges(),
  //   });
  // }

  trackByFn(index: number, el: any): number {
    return el.id;
  }

  onImageError(poster_path: string) {
    console.warn(`${poster_path} image not able to loaded`);
  }

  ngOnDestroy() {
    if (this.subDetail) {
      this.subDetail.unsubscribe();
    }

    if (this.subSimilar) {
      this.subSimilar.unsubscribe();
    }
  }
}
