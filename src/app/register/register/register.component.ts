import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { NgIf, CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Interet } from '../../models/interet';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, NgIf, CommonModule, RouterLink]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  availableInterests: Interet[] = [];
  selectedInterests: number[] = [];

  roles = [
    { value: 'public', label: 'Public' },
    { value: 'organisateur', label: 'Organisateur' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      role: ['public', Validators.required],
      nom_organis: [''],
      interets: [[]]
    }, { validators: this.passwordMatchValidator });

    this.onRoleChange();
    console.log('availableInterests:', this.availableInterests);

  }

  private onRoleChange() {
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      const nomOrganisControl = this.registerForm.get('nom_organis');
      if (role === 'organisateur') {
        nomOrganisControl?.setValidators(Validators.required);
        this.clearInterests();
      } else {
        nomOrganisControl?.clearValidators();
        this.fetchAvailableInterests();
      }
      nomOrganisControl?.updateValueAndValidity();
    });

    // Initial fetch for default role "public"
    if (this.registerForm.get('role')?.value === 'public') {
      this.fetchAvailableInterests();
    }
  }

  private clearInterests() {
    this.selectedInterests = [];
    this.registerForm.get('interets')?.setValue([]);
  }

  toggleInterest(interestId: number) {
    if (this.isInterestSelected(interestId)) {
      this.selectedInterests = this.selectedInterests.filter(id => id !== interestId);
    } else if (this.selectedInterests.length < 3) {
      this.selectedInterests.push(interestId);
    }
    this.registerForm.get('interets')?.setValue(this.selectedInterests);
  }

  isInterestSelected(interestId: number): boolean {
    return this.selectedInterests.includes(interestId);
  }

  private fetchAvailableInterests() {
    this.userService.getInterets().subscribe({
      next: (data) => {
        console.log('Centres d’intérêt disponibles:', data);
        this.availableInterests = data;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des centres d'intérêt :", error);
        this.errorMessage = "Impossible de charger les centres d’intérêt.";
      }
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      const formData = { ...this.registerForm.value };

      if (formData.role !== 'organisateur') {
        delete formData.nom_organis;
      }
      console.log('FormData envoyé au backend :', formData);

      await this.userService.registerUser(formData);

      this.successMessage = 'Inscription réussie ! Vérifiez votre email.';
      this.registerForm.reset({ role: 'public', interests: [] });
      this.selectedInterests = [];

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      this.errorMessage = error?.error?.message || 'Erreur lors de l\'inscription.';
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
// import { Router, RouterLink } from '@angular/router';
// import { UserService } from '../../services/user.service';
// import { NgIf } from '@angular/common';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css'],
//   imports: [ReactiveFormsModule, NgIf, RouterLink, CommonModule]
// })
// export class RegisterComponent {
//   registerForm: FormGroup;
//   isLoading = false;
//   errorMessage: string | null = null;
//   successMessage: string | null = null;

//   availableInterests: any[] = [];
//   selectedInterests: any[] = [];


//   // Liste des centres d'intérêt disponibles
//   // availableInterests = [
//   //   'Technologie', 'Musique', 'Art', 'Sport',
//   //   'Voyage', 'Cuisine', 'Cinéma', 'Lecture',
//   //   'Photographie', 'Mode', 'Nature', 'Jeux vidéo'
//   // ];

//   roles = [
//     { value: 'public', label: 'Public' },
//     { value: 'organisateur', label: 'Organisateur' }
//   ];

//   constructor(
//   private fb: FormBuilder,
//   private userService: UserService,
//   private router: Router,
//   private http: HttpClient
// ) {
//   this.registerForm = this.fb.group({
//     fullname: ['', Validators.required],
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', [Validators.required, Validators.minLength(8)]],
//     password_confirmation: ['', Validators.required],
//     role: ['', Validators.required],
//     nom_organis: [''],
//     interests: [[]] // stockera les centres d’intérêt
//   }, { validators: this.passwordMatchValidator });

//   // Surveille le changement de rôle
//   this.registerForm.get('role')?.valueChanges.subscribe(role => {
//     if (role === 'public') {
//       this.fetchAvailableInterests();
//       this.registerForm.get('nom_organis')?.clearValidators();
//     } else if (role === 'organisateur') {
//       this.registerForm.get('nom_organis')?.setValidators(Validators.required);
//       this.registerForm.get('interests')?.setValue([]);
//       this.selectedInterests = [];
//     }
//     this.registerForm.get('nom_organis')?.updateValueAndValidity();
//   });
// }

//   // Gestion de la sélection/désélection des centres d'intérêt
//  toggleInterest(interest: string) {
//   if (this.isInterestSelected(interest)) {
//     this.selectedInterests = this.selectedInterests.filter(i => i !== interest);
//   } else if (this.selectedInterests.length < 3) {
//     this.selectedInterests.push(interest);
//   }
//   this.registerForm.get('interests')?.setValue(this.selectedInterests);
// }

// isInterestSelected(interest: string): boolean {
//   return this.selectedInterests.includes(interest);
// }


//   passwordMatchValidator(group: FormGroup) {
//     const password = group.get('password')?.value;
//     const confirm = group.get('password_confirmation')?.value;
//     return password === confirm ? null : { passwordMismatch: true };
//   }
//   fetchAvailableInterests() {
//   this.userService.getInterets().subscribe({
//     next: (data) => {
//       this.availableInterests = data;
//     },
//     error: (error) => {
//       console.error("Erreur lors du chargement des centres d'intérêt :", error);
//     }
//   });
// }


//   async onRegister(): Promise<void> {
//     if (this.registerForm.invalid) {
//       this.registerForm.markAllAsTouched();
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = null;
//     this.successMessage = null;

//     try {
//       const formData = { ...this.registerForm.value };

//       if (formData.role !== 'organisateur') {
//         delete formData.nom_organis;
//       }

//       await this.userService.registerUser(formData);

//       this.successMessage = 'Inscription réussie ! Veuillez vous connecter.';
//       this.registerForm.reset({ role: 'public', interests: [] });

//       setTimeout(() => {
//         this.router.navigate(['/login']);
//       }, 2000);
//     } catch (error: any) {
//       this.errorMessage = error?.error?.message || 'Erreur lors de l\'inscription.';
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





















