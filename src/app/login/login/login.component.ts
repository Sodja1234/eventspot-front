
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from './../../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const { email, password } = this.loginForm.value;
      const response = await this.userService.login({ email, password });

      const userData = response?.data;

      if (userData?.token && userData?.role) {
        // 🔐 Enregistrement des données utilisateur
        localStorage.setItem('token', userData.token);
        localStorage.setItem('name', userData.name);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('userId', String(userData.id));
        localStorage.setItem('role', userData.role);

        console.log('Connexion réussie, utilisateur :', userData);
        
        

        
      if (localStorage.getItem('role') === 'organisateur') {
          this.router.navigate(['/dashboard']);
      } else {
          this.router.navigate(['']);
        
      }


      } else {
        console.warn('Réponse inattendue du backend :', response);
        this.errorMessage = 'Réponse du serveur invalide';
      }

    } catch (err: any) {
      console.error('Erreur lors de la connexion :', err);
      this.errorMessage = err?.error?.message || 'Échec de la connexion';
    } finally {
      this.isLoading = false;
    }
  }

  loginWithGoogle() {
    this.userService.socialLogin('google');
  }

  loginWithFacebook() {
    this.userService.socialLogin('facebook');
  }
}




















// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, RouterLink, RouterLinkActive } from '@angular/router';
// import { UserService } from './../../services/user.service';
// import { NgIf } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   standalone: true,
//   imports: [ReactiveFormsModule,NgIf,RouterLink]
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   isLoading = false;
//   errorMessage: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//     });
//   }

//   async onLogin(): Promise<void> {
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       return;
//     }
  
//     this.isLoading = true;
//     this.errorMessage = null;
  
//     try {
//       const { email, password } = this.loginForm.value;
//       const response = await this.userService.login({ email, password });
  
//       const userData = response?.data;
  
//       if (userData?.token && userData?.role) {
//         this.userService.saveUserSession(userData.token, userData);
//         console.log('Connexion réussie, utilisateur :', userData);
  
//         if (userData.role === 'organisateur') {
//           this.router.navigate(['/register']);
//         } else {
//           this.router.navigate(['/register']);
//         }
//       } else {
//         console.warn(' Réponse inattendue du backend :', response);
//         this.errorMessage = 'Réponse du serveur invalide';
//       }
  
//     } catch (err: any) {
//       console.error(' Erreur lors de la connexion :', err);
//       this.errorMessage = err?.error?.message || 'Échec de la connexion';
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   loginWithGoogle() {
//     this.userService.socialLogin('google'); 
//   }

//   loginWithFacebook() {
//     this.userService.socialLogin('facebook'); 
//   }
// }
