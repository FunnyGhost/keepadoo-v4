import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MoviesListsQuery } from '../state/movies-lists.query';
import { MoviesListsService } from '../state/movies-lists.service';

@Component({
  selector: 'keepadoo-movies-list-create',
  templateUrl: './movies-list-create.component.html',
  styleUrls: ['./movies-list-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesListCreateComponent implements OnInit {
  moviesListForm = this.formBuilder.group({
    name: ['', [Validators.minLength(2), Validators.required]]
  });

  error$: Observable<string>;
  loading$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private query: MoviesListsQuery,
    private moviesListService: MoviesListsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.error$ = this.query.selectError();
    this.loading$ = this.query.selectLoading();
  }

  async onSubmit() {
    await this.moviesListService.add({ name: this.moviesListForm.value.name });
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
