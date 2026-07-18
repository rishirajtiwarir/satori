import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', canActivate: [noAuthGuard], loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', canActivate: [noAuthGuard], loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
    { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'dictionary', canActivate: [authGuard], loadComponent: () => import('./features/dictionary/dictionary.component').then(m => m.DictionaryComponent) },
    { path: 'vocabulary-lists', canActivate: [authGuard], loadComponent: () => import('./features/vocabulary-lists/vocabulary-lists.component').then(m => m.VocabularyListsComponent) },
    { path: 'passage-reader', canActivate: [authGuard], loadComponent: () => import('./features/passage-reader/passage-reader.component').then(m => m.PassageReaderComponent) },
    { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
    { path: 'quiz', canActivate: [authGuard], loadComponent: () => import('./features/quiz/quiz.component').then(m => m.QuizComponent) },
    { path: 'leaderboard', canActivate: [authGuard], loadComponent: () => import('./features/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent) },
    { path: '**', redirectTo: 'dashboard' }
];
