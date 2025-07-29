import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { FooterComponent } from './pages/footer/footer.component';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  asNavbar: boolean = true;
  ngOnInit(): void {
    //alert('Hello World!')
    initFlowbite();
  }
  constructor(private router: Router) {
    this.router = router;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe(
        (event: NavigationEnd) => {
          const routesNoNavbar = ['/login', '/login?verified=1', '/register'];
          this.asNavbar = !routesNoNavbar.includes(event.urlAfterRedirects);
        });
  }
}
