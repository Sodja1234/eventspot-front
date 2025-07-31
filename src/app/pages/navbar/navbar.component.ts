import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isDarkTheme: boolean = false;
   userName: string | null = null;
   role:  string | null = null;
   asPublic: boolean = false;
   isLoggedIn: boolean = false;
  router: any;
  roled = localStorage.getItem('role') ?? 'public' ;



  constructor(private authService: UserService) {}


  ngOnInit(): void {
    this.userName = localStorage.getItem('name');
    this.role = localStorage.getItem('role');

    if (this.userName) {
      this.isLoggedIn = true;
    }
    if (this.role === 'public') {
      this.asPublic = true;
    }
  }

  toggleTheme(): void {
    this.isDarkTheme = ! this.isDarkTheme;
    const htmlPage = document.documentElement;
    htmlPage.classList.toggle('dark', this.isDarkTheme);
  }

   Logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    //localStorage.removeItem('access_token');
  }

  showSideBar(){

  }
}
