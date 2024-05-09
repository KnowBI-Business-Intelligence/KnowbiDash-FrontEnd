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
import { ChartsComponent } from './DashSetup/screens/folders-screen/charts/charts.component';
import { CreateFoldersComponent } from './DashSetup/screens/folders-screen/create-folders/create-folders.component';
import { FoldersComponent } from './DashSetup/screens/folders-screen/folders/folders.component';
import { GroupComponent } from './DashSetup/screens/folders-screen/group/group.component';
import { SQLRunnerUpdateComponent } from './DashSetup/screens/folders-screen/sqlrunner-update/sqlrunner-update.component';
import { GraphicEditingComponent } from './DashSetup/screens/graphic-editing/graphic-editing.component';
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
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginScreenComponent,
    title: 'Koios - Login',
  },

  // ADM
  {
    path: 'admin',
    component: ADMContentScreenComponent,
    title: 'Koios - Administrador',
    data: {
      breadcrumb: 'Início',
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ADMMainScreenComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'graphic_editing',
        component: GraphicEditingComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Koios - Editor Gráfico',
        },
      },
      {
        path: 'assistant',
        title: 'Koios - Administrador',
        component: AssistantScreenComponent,
        data: {
          breadcrumb: 'Koios Assistente',
        },
      },
      {
        path: 'cofig_db',
        component: DatabaseScreenComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Configurar Database',
        },
        children: [
          {
            path: '',
            component: DatabaseComponentComponent,
            title: 'Koios - Administrador',
            data: {
              breadcrumb: '',
            },
          },
        ],
      },
      {
        path: 'dashboards',
        component: DashboardsComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Dashboards',
        },
        children: [
          {
            path: '',
            component: DashboardsViewComponent,
            title: 'Koios - Dashboards',
            data: {
              breadcrumb: 'Dashboards',
            },
          },
          {
            path: 'view',
            component: ViewCreateComponent,
            title: 'Koios - view',
            data: {
              breadcrumb: 'Gráficos',
            },
          },
          {
            path: 'chart_view',
            component: ChartComponent,
            title: 'Koios - Administrador',
            data: {
              breadcrumb: 'Gráficos',
            },
          },
          {
            path: 'card_view',
            component: CardsComponent,
            title: 'Koios - Administrador',
            data: {
              breadcrumb: 'Cards',
            },
          },
          {
            path: 'table_view',
            component: TableComponent,
            title: 'Koios - Administrador',
            data: {
              breadcrumb: 'Tables',
            },
          },
        ],
      },
      {
        path: '',
        component: FoldersComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'create_group',
        component: CreateFoldersComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Criar Grupo',
        },
      },
      {
        path: 'groups',
        component: GroupComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Grupos',
        },
      },
      {
        path: 'sql_update',
        component: SQLRunnerUpdateComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Injetar SQL',
        },
      },
      {
        path: 'charts',
        component: ChartsComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Gráficos',
        },
      },
      {
        path: 'users_panel',
        component: UsersScreenComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Usuários',
        },
        children: [
          {
            path: '',
            component: UsersComponent,
            title: 'Koios - Administrador',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'create_users',
            component: CreateUserComponent,
            title: 'Koios - Administrador',
            data: {
              breadcrumb: 'Adicionar Usuário',
            },
          },
          {
            path: 'edit_users',
            component: EditUserComponent,
            title: 'Koios - Administrador',
            data: {
              breadcrumb: 'Editar Usuário',
            },
          },
        ],
      },
      {
        path: 'structure',
        component: StructureScreenComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Estrutura',
        },
        children: [
          {
            path: '',
            component: StructureComponent,
            title: 'Koios - Administrador',
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
    title: 'Koios - Inicio',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: '',
    },
    children: [
      {
        path: '',
        title: 'Koios - Painel',
        component: MainScreenComponent,
      },
      {
        path: 'main',
        children: [
          {
            path: '',
            title: 'Koios - Painel',
            component: MainScreenComponent,
            data: {
              breadcrumb: 'Main',
            },
          },
          {
            path: 'chartgroup',
            title: 'Koios - Painel',
            component: ChartGroupsComponent,
            data: {
              breadcrumb: 'Grupos',
            },
          },
          {
            path: 'charts',
            title: 'Koios - Painel',
            component: ChartScreenComponent,
            data: {
              breadcrumb: 'Gráficos',
            },
          },
        ],
      },
      {
        path: 'settings',
        title: 'Koios - Painel',
        component: SettingsUserComponent,
        data: {
          breadcrumb: 'Configurações',
        },
      },
      {
        path: 'assistant',
        title: 'Koios - Painel',
        component: AssistantScreenComponent,
        data: {
          breadcrumb: 'Assistente',
        },
      },
    ],
  },
  {
    path: '**',
    title: 'Page Not Found! 😥',
    component: PageNotFoundComponent,
  },
];
