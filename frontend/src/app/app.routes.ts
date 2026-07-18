import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'dictionary', loadComponent: () => import('./features/dictionary/dictionary.component').then(m => m.DictionaryComponent) },
    { path: 'vocabulary-lists', loadComponent: () => import('./features/vocabulary-lists/vocabulary-lists.component').then(m => m.VocabularyListsComponent) },
    { path: 'passage-reader', loadComponent: () => import('./features/passage-reader/passage-reader.component').then(m => m.PassageReaderComponent) },
    { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
    { path: 'quiz', loadComponent: () => import('./features/quiz/quiz.component').then(m => m.QuizComponent) },
    { path: 'leaderboard', loadComponent: () => import('./features/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent) },
    { path: '**', redirectTo: 'dashboard' }
];
