import { authGuard } from './services/auth/guards/auth.guard';
import { noAuthGuard } from './services/auth/guards/no-auth.guard';
import { SignInComponent } from './services/auth/sign-in/sign-in.component';
import { AdminPanelComponent } from './features/admin-panel/admin-panel.component';
import { FooterComponent } from './features/footer/footer.component';
import { MyHandoverComponent } from './features/my-handover/my-handover.component';
import { MyTeamComponent } from './features/my-team/my-team.component';
import { SubscriptionManagementComponent } from './subscriptions-management/subscriptions-management.component';
import { Routes } from '@angular/router';
import { ReportPDFPreviewComponent } from './features/my-handover/report-preview/report-pdf-component';

export const APP_ROUTES: Routes =
[
    {
        path: '',
        pathMatch: 'full',
        component: SignInComponent
    },
    {
        path: 'my-handover',
        canActivate: [authGuard],
        component: MyHandoverComponent
    },
    {
        path: 'my-team',
        canActivate: [authGuard],
        component: MyTeamComponent
    },
    {
        path: 'admin-panel',
        canActivate: [authGuard],
        component: AdminPanelComponent
    },
    {
        path: 'subscriptions-management',
        canActivate: [authGuard],
        component: SubscriptionManagementComponent
    },
    {
        path: 'pdf-preview',
        component: ReportPDFPreviewComponent
    },
    {
        path: 'footer',
        component: FooterComponent
    },
    {
        path: 'sign-in',
        loadComponent: () => import('./services/auth/sign-in/sign-in.component').then(m => m.SignInComponent),
        canActivate: [noAuthGuard]
      },
      {
        path: 'sign-up',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./services/auth/sign-up/sign-up.component').then(m => m.SignUpComponent),
      },
    /*   {
        path: 'admin-panel', loadChildren: () => import('./app/features/admin-panel/admin-panel.routes').then(mod => mod.ADMIN_PANEL_ROUTES)
    },  */
];