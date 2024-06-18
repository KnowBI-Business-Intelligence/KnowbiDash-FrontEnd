import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard.guard';
import { ADMMainScreenComponent } from './DashSetup/screens/adm-main-screen/adm-main-screen.component';
import { ADMContentScreenComponent } from './DashSetup/screens/admcontent-screen/admcontent-screen.component';
import { CardsComponent } from './DashSetup/screens/dashboards/cards/cards.component';
import { ChartComponent } from './DashSetup/screens/dashboards/chart/chart.component';
import { DashboardsViewComponent } from './DashSetup/screens/dashboards/dashboards-view/dashboards-view.component';
import { DashboardsComponent } from './DashSetup/screens/dashboards/dashboards.component';
import { TableComponent } from './DashSetup/screens/dashboards/table/table.component';
import { DatabaseComponentComponent } from './DashSetup/screens/database-screen/database-component/database-component.component';
import { DatabaseScreenComponent } from './DashSetup/screens/database-screen/database-screen.component';

import { StructureScreenComponent } from './DashSetup/screens/structure-screen/structure-screen.component';
import { StructureComponent } from './DashSetup/screens/structure-screen/structure/structure.component';
import { CreateUserComponent } from './DashSetup/screens/users-screen/create-user/create-user.component';
import { EditUserComponent } from './DashSetup/screens/users-screen/edit-user/edit-user.component';
import { UsersScreenComponent } from './DashSetup/screens/users-screen/users-screen.component';
import { UsersComponent } from './DashSetup/screens/users-screen/users/users.component';
import { AssistantScreenComponent } from './DashView/screens/assistant-screen/assistant-screen.component';
import { ChartGroupsComponent } from './DashView/screens/chart-groups/chart-groups.component';
import { ChartScreenComponent } from './DashView/screens/chart-screen/chart-screen.component';
import { ContentScreenComponent } from './DashView/screens/content-screen/content-screen.component';
import { MainScreenComponent } from './DashView/screens/main-screen/main-screen.component';
import { PageNotFoundComponent } from './DashView/screens/page-not-found/page-not-found.component';
import { SettingsUserComponent } from './DashView/screens/settings-user/settings-user.component';
import { LoginScreenComponent } from './shared/login-screen/login-screen.component';
import { ViewCreateComponent } from './DashSetup/screens/dashboards/view-create/view-create.component';
import { AdmMainDashboardsComponent } from './DashSetup/screens/adm-main-dashboards/adm-main-dashboards/adm-main-dashboards.component';
import { AdmMainChartsComponent } from './DashSetup/screens/adm-main-charts/adm-main-charts/adm-main-charts.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginScreenComponent,
    title: 'Koios',
  },

  // ADM
  {
    path: 'admin',
    component: ADMContentScreenComponent,
    title: 'Koios',
    data: {
      breadcrumb: 'Início',
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ADMMainScreenComponent,
        title: 'Koios',
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'adm_main_dashboard',
        component: AdmMainDashboardsComponent,
        title: 'Koios',
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'adm_main_charts',
        component: AdmMainChartsComponent,
        title: 'Koios',
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'assistant',
        title: 'Koios',
        component: AssistantScreenComponent,
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'cofig_db',
        component: DatabaseScreenComponent,
        title: 'Koios',
        data: {
          breadcrumb: '',
        },
        children: [
          {
            path: '',
            component: DatabaseComponentComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
        ],
      },
      {
        path: 'dashboards',
        component: DashboardsComponent,
        title: 'Koios',
        data: {
          breadcrumb: '',
        },
        children: [
          {
            path: '',
            component: DashboardsViewComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'view',
            component: ViewCreateComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'chart_view',
            component: ChartComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'card_view',
            component: CardsComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'table_view',
            component: TableComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
        ],
      },
      {
        path: 'users_panel',
        component: UsersScreenComponent,
        title: 'Koios',
        data: {
          breadcrumb: '',
        },
        children: [
          {
            path: '',
            component: UsersComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'create_users',
            component: CreateUserComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'edit_users',
            component: EditUserComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
        ],
      },
      {
        path: 'structure',
        component: StructureScreenComponent,
        title: 'Koios',
        data: {
          breadcrumb: '',
        },
        children: [
          {
            path: '',
            component: StructureComponent,
            title: 'Koios',
            data: {
              breadcrumb: '',
            },
          },
        ],
      },
    ],
  },

  // USER
  {
    path: 'content',
    component: ContentScreenComponent,
    title: 'Koios',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: '',
    },
    children: [
      {
        path: '',
        title: 'Koios',
        component: MainScreenComponent,
      },
      {
        path: 'main',
        children: [
          {
            path: '',
            title: 'Koios',
            component: MainScreenComponent,
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'chartgroup',
            title: 'Koios',
            component: ChartGroupsComponent,
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'charts',
            title: 'Koios',
            component: ChartScreenComponent,
            data: {
              breadcrumb: '',
            },
          },
        ],
      },
      {
        path: 'settings',
        title: 'Koios',
        component: SettingsUserComponent,
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'assistant',
        title: 'Koios',
        component: AssistantScreenComponent,
        data: {
          breadcrumb: '',
        },
      },
    ],
  },
  {
    path: '**',
    title: 'Page Not Found',
    component: PageNotFoundComponent,
  },
];
