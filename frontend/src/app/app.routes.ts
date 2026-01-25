import { Routes } from '@angular/router';
import { MainPage } from './pages/main-page/main-page';
import { WingetPage } from './pages/winget-page/winget-page';
import { ArchPage } from './pages/arch-page/arch-page';

export const routes: Routes = [
  {
    title: 'Root',
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    title: 'Home',
    path: 'home',
    pathMatch: 'full',
    component: MainPage,
  },
  {
    title: 'Arch',
    path: 'arch/:packagename',
    pathMatch: 'full',
    component: ArchPage
  },

  {
    title: 'winget',
    path: 'winget/:packagename',
    pathMatch: 'full',
    component: WingetPage,
  },
];
