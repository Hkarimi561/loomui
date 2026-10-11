import { Routes } from '@angular/router';
import { COMPONENTS } from './components.data';
import { PAGE_LOADERS } from './pages/registry';

const demoRoutes: Routes = COMPONENTS.filter((c) => PAGE_LOADERS[c.slug]).map((c) => ({
  path: c.slug,
  title: `${c.name} — Loom UI`,
  loadComponent: PAGE_LOADERS[c.slug] as () => Promise<any>,
}));

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Loom UI — Angular components, woven your way',
    loadComponent: () => import('./pages/landing').then((m) => m.LandingPage),
  },
  {
    path: 'components',
    loadComponent: () => import('./pages/components-layout').then((m) => m.ComponentsLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'button' },
      ...demoRoutes,
      {
        path: ':slug',
        title: 'Coming soon — Loom UI',
        loadComponent: () => import('./pages/coming-soon').then((m) => m.ComingSoonPage),
      },
    ],
  },
  {
    path: 'get-started',
    title: 'Get started — Loom UI',
    loadComponent: () => import('./pages/get-started').then((m) => m.GetStartedPage),
  },
  {
    path: 'themes',
    title: 'Themes — Loom UI',
    loadComponent: () => import('./pages/themes-page').then((m) => m.ThemesPage),
  },
  {
    path: 'elements',
    title: 'Custom elements — Loom UI',
    loadComponent: () => import('./pages/elements-page').then((m) => m.ElementsPage),
  },
  {
    path: 'icons',
    title: 'Icons — Loom UI',
    loadComponent: () => import('./pages/icons-page').then((m) => m.IconsPage),
  },
  {
    path: 'embed/:slug',
    title: 'Preview — Loom UI',
    loadComponent: () => import('./pages/embed').then((m) => m.EmbedPage),
  },
  { path: '**', redirectTo: '' },
];
