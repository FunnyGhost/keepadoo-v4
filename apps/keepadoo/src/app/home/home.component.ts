import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../state/auth.service';

@Component({
  selector: 'keepadoo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  goToAdd(): void {
    this.router.navigateByUrl(`${this.router.url}/add`);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
