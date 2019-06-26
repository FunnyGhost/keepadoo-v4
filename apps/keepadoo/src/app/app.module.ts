import { NgModule } from '@angular/core';
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './state/auth.guard';

const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: 'movies-lists',
        loadChildren:
          'apps/keepadoo/src/app/movies-lists/movies-lists.module#MoviesListsModule'
      }
    ]
  }
];

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent],
  imports: [
    CoreModule,
    SharedModule,
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule {}
