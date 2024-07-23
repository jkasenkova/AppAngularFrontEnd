import { Route } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';

export const ADMIN_PANEL_ROUTES: Route[] = [
    {
        path: 'admin-panel', component: AdminPanelComponent,
        children: [
            {
                path: 'app-handover-templates', loadChildren: () => import('./handover-templates/handover-templates.component').then((x) => x.HandoverTemplatesComponent),
                children: [
                    {
                        path: 'app-template-topic', loadChildren: () => import('./handover-templates/topic/template-topic.component').then((x) => x.TemplateTopicComponent)
                    },
                    {
                        path: 'app-template', loadChildren: () => import('./handover-templates/template/template.component').then((x) => x.TemplateComponent)
                    }
                ]
            },
            {
                path: 'app-user-orientation', loadChildren: () => import('./user-orientation/user-orientation.component').then((x) => x.UserOrientationComponent)
            },
            {
                path: 'app-user-management', loadChildren: () => import('./user-management/user-management.component').then((x) => x.UserManagementComponent)
            }
        ]
    }
];