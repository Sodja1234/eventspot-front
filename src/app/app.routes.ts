import { StatComponent } from './pages/dashboard/composants/stat/stat/stat.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { ForgotPasswordComponent } from './pages/aut/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { MesEvenementComponent } from './pages/dashboard/composants/evenement/mes-evenement/mes-evenement.component';
import { MesBilletsComponent } from './pages/dashboard/composants/Billets/mes-billets/mes-billets.component';
import { CardStatComponent } from './pages/dashboard/composants/stat/card-stat/card-stat.component';
import { ResetPasswordComponent } from './pages/aut/reset-password/reset-password.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { CreateEventComponent } from './pages/create-event/create-event.component';
import { AuthGuard } from './guard/auth.guard';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  // Authentication
  {
    path: 'login',
    title: 'Login - EventSpot',
    loadComponent: () => import('../app/login/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    title: 'Register - EventSpot',
    loadComponent: () => import('../app/register/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'reset-password',
    title: 'Reset Password - EventSpot',
    loadComponent: () => import('../app/pages/aut/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent)
  },
  {
    path: 'forgot-password',
    title: 'Forgot Password - EventSpot',
    loadComponent: () => import('../app/pages/aut/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent)
  },
  //Events
  {
    path: 'event/create',
    title: 'Create Event - EventSpot',
    loadComponent: () => import('../app/pages/create-event/create-event.component').then((m) => m.CreateEventComponent)
  },
  {
    path: 'event/:id',
    title : 'Detail - EventSpot',
    loadComponent : () => import('../app/pages/event-details/event-details.component').then((m)=> m.EventDetailsComponent)
  },
  {
    path: 'events',
    title : 'Events - EventSpot',
    loadComponent: () => import('../app/pages/event-page/event-page.component').then((m) => m.EventPageComponent)
  },
  {
    path: 'categories',
    title : 'Categories - EventSpot',
    loadComponent: () => import('../app/pages/category-page/category-page.component').then((m)=> m.CategoryPageComponent)
  },
  {
    path: 'search',
    title: 'Search - EventSpot',
    loadComponent: () => import('../app/pages/search/search.component').then((m) => m.SearchComponent)
  },
  //profile
  {
    path: 'profile',
    title: 'Profile - EventSpot',
    loadComponent: () => import('../app/pages/public-profile/public-profile.component').then((m) => m.PublicProfileComponent),
    children: []
  },
  //Organisation
  {
    path: 'dashboard',
    title: 'Dashboard - EventSpot',
    loadComponent: () => import('../app/pages/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'evenements', pathMatch: 'full' },
      { path: 'evenements',
        title: 'Dashboard Event - EventSpot',
        loadComponent: () => import('../app/pages/dashboard/composants/evenement/mes-evenement/mes-evenement.component').then((m) => m.MesEvenementComponent)
      },
      {
        path: 'billets',
        title: 'Dashboard Billets - EventSpot',
        loadComponent: () => import('../app/pages/dashboard/composants/Billets/mes-billets/mes-billets.component').then((m) => m.MesBilletsComponent)
      },
      {
        path: 'stat',
        title: 'Dashboard Statistiques - EventSpot',
        loadComponent: () => import('../app/pages/dashboard/composants/stat/stat/stat.component').then((m) => m.StatComponent)
      },
      {
    path: 'event/create',
    title: 'Create Event - EventSpot',
    loadComponent: () => import('../app/pages/create-event/create-event.component').then((m) => m.CreateEventComponent)
    },
     {
    path: 'event/:id',
    title : 'Detail - EventSpot',
    loadComponent : () => import('../app/pages/event-details/event-details.component').then((m)=> m.EventDetailsComponent)
  },
    ]
  }
];
