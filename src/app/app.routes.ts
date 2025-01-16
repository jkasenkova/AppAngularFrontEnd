import { authGuard } from './services/auth/guards/auth.guard';
import { adminGuard } from './services/auth/guards/admin.guard';
import { rootGuard } from './services/auth/guards/root.guard';
import { noAuthGuard } from './services/auth/guards/no-auth.guard';
import { SignInComponent } from './features/auth/sign-in/sign-in.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { AdminPanelComponent } from './features/admin-panel/admin-panel.component';
import { FooterComponent } from './features/footer/footer.component';
import { MyHandoverComponent } from './features/my-handover/my-handover.component';
import { MyTeamComponent } from './features/my-team/my-team.component';
import { AppComponent } from './app.component'
import { SubscriptionManagementComponent } from './subscriptions-management/subscriptions-management.component';
import { Routes } from '@angular/router';
import { ReportPDFPreviewComponent } from './features/my-handover/report-preview/report-pdf-component';
import { HandoverTemplatesComponent } from './features/admin-panel/handover-templates/handover-templates.component';
import { ADMIN_PANEL_ROUTES } from './features/admin-panel/admin-panel.routes';

const appRoutes: Routes =
[
    {
        path: '',
        canActivate: [noAuthGuard],
        component: AppComponent
    },
    {
        path: 'app-my-handover/:id',
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
        canActivate: [rootGuard],
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
        component: SignInComponent,
        canActivate: [noAuthGuard]
    },
    {
        path: 'sign-up',
        canActivate: [noAuthGuard],
        component: SignUpComponent,
    },
    {
        path: 'app-handover-templates',
        canActivate: [noAuthGuard],
        component: HandoverTemplatesComponent,
    },
];

export const APP_ROUTES = appRoutes;