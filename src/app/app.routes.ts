import { Routes } from '@angular/router';
import { LoginScreenComponent } from './components/login-screen/login-screen.component';
import { ADMMainScreenComponent } from './DashSetup/screens/adm-main-screen/adm-main-screen.component';
import { ADMContentScreenComponent } from './DashSetup/screens/admcontent-screen/admcontent-screen.component';
import { DatabaseComponentComponent } from './DashSetup/screens/database-screen/database-component/database-component.component';
import { DatabaseScreenComponent } from './DashSetup/screens/database-screen/database-screen.component';
import { ChartsComponent } from './DashSetup/screens/folders-screen/charts/charts.component';
import { CreateFoldersComponent } from './DashSetup/screens/folders-screen/create-folders/create-folders.component';
import { FoldersScreenComponent } from './DashSetup/screens/folders-screen/folders-screen.component';
import { FoldersComponent } from './DashSetup/screens/folders-screen/folders/folders.component';
import { GroupComponent } from './DashSetup/screens/folders-screen/group/group.component';
import { SQLRunnerUpdateComponent } from './DashSetup/screens/folders-screen/sqlrunner-update/sqlrunner-update.component';
import { GraphicEditingComponent } from './DashSetup/screens/graphic-editing/graphic-editing.component';
import { ProfilesFoldersScreenComponent } from './DashSetup/screens/profiles-folders-screen/profiles-folders-screen.component';
import { ProfilesFoldersComponent } from './DashSetup/screens/profiles-folders-screen/profiles-folders/profiles-folders.component';
import { CreateUserComponent } from './DashSetup/screens/users-screen/create-user/create-user.component';
import { EditUserComponent } from './DashSetup/screens/users-screen/edit-user/edit-user.component';
import { UsersScreenComponent } from './DashSetup/screens/users-screen/users-screen.component';
import { UsersComponent } from './DashSetup/screens/users-screen/users/users.component';
import { AssistantScreenComponent } from './DashView/screens/assistant-screen/assistant-screen.component';
import { ContentDashComponent } from './DashView/screens/content-dash/content-dash.component';
import { ContentScreenComponent } from './DashView/screens/content-screen/content-screen.component';
import { DashboardsScreenComponent } from './DashView/screens/dashboards-screen/dashboards-screen.component';
import { MainScreenComponent } from './DashView/screens/main-screen/main-screen.component';
import { PageNotFoundComponent } from './DashView/screens/page-not-found/page-not-found.component';
import { AuthGuard } from './services/guards/auth-guard.guard';
import { ChartGroupsComponent } from './DashView/screens/chart-groups/chart-groups.component';
import { ChartScreenComponent } from './DashView/screens/chart-screen/chart-screen.component';
import { DashboardsComponent } from './DashSetup/screens/dashboards/dashboards.component';
import { DashboardsViewComponent } from './DashSetup/screens/dashboards/dashboards-view/dashboards-view.component';
import { ViewCreateComponent } from './DashSetup/screens/dashboards/view-create/view-create.component';
import { ViewEditComponent } from './DashSetup/screens/dashboards/view-edit/view-edit.component';

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
        title: 'Koios - Editor Gráfico',
        data: {
          breadcrumb: 'Koios - Editor Gráfico',
        },
      },
      {
        path: 'assistant',
        title: 'Koios - Assistente',
        component: AssistantScreenComponent,
        data: {
          breadcrumb: 'Koios Assistente',
        },
      },
      {
        path: 'cofig_db',
        component: DatabaseScreenComponent,
        title: 'Koios - Configurar DB',
        data: {
          breadcrumb: 'Configurar Database',
        },
        children: [
          {
            path: '',
            component: DatabaseComponentComponent,
            title: 'Koios - Configurar DB',
            data: {
              breadcrumb: '',
            },
          },
        ],
      },
      {
        path: 'dashboards',
        component: DashboardsComponent,
        title: 'Koios - Dashboards',
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
            path: 'create_view',
            component: ViewCreateComponent,
            title: 'Koios - Criar Visualização',
            data: {
              breadcrumb: 'Criar visualização',
            },
          },
          {
            path: 'edit_view',
            component: ViewEditComponent,
            title: 'Koios - editar Visualização',
            data: {
              breadcrumb: 'Editar visualização',
            },
          },
        ],
      },
      {
        path: '',
        component: FoldersComponent,
        title: 'Koios - Dashboards',
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'create_group',
        component: CreateFoldersComponent,
        title: 'Koios - Criar Grupo',
        data: {
          breadcrumb: 'Criar Grupo',
        },
      },
      {
        path: 'groups',
        component: GroupComponent,
        title: 'Koios - Grupos',
        data: {
          breadcrumb: 'Grupos',
        },
      },
      {
        path: 'sql_update',
        component: SQLRunnerUpdateComponent,
        title: 'Koios - Atualizar',
        data: {
          breadcrumb: 'Injetar SQL',
        },
      },
      {
        path: 'charts',
        component: ChartsComponent,
        title: 'Koios - Gráficos',
        data: {
          breadcrumb: 'Gráficos',
        },
      },
      {
        path: 'users_panel',
        component: UsersScreenComponent,
        title: 'Koios - Usuários',
        data: {
          breadcrumb: 'Usuários',
        },
        children: [
          {
            path: '',
            component: UsersComponent,
            title: 'Koios - Usuários',
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'create_users',
            component: CreateUserComponent,
            title: 'Koios - Cadastro',
            data: {
              breadcrumb: 'Adicionar Usuário',
            },
          },
          {
            path: 'edit_users',
            component: EditUserComponent,
            title: 'Koios - Edição',
            data: {
              breadcrumb: 'Editar Usuário',
            },
          },
        ],
      },
      {
        path: 'profiles_folders',
        component: ProfilesFoldersScreenComponent,
        title: 'Koios - Estrutura',
        data: {
          breadcrumb: 'Estrutura',
        },
        children: [
          {
            path: '',
            component: ProfilesFoldersComponent,
            title: 'Koios - Pastas/Perfis',
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
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'dash',
        title: 'Koios - Painel',
        component: DashboardsScreenComponent,
        data: {
          breadcrumb: 'Dash',
        },
        children: [
          {
            path: '',
            component: ContentDashComponent,
            title: 'Koios - Modulos',
            data: {
              breadcrumb: 'Modulos',
            },
          },
        ],
      },
      {
        path: 'main',
        children: [
          {
            path: '',
            title: 'Koios - Painel',
            component: MainScreenComponent,
          },
          {
            path: 'chartgroup',
            title: 'Koios - grupos',
            component: ChartGroupsComponent,
          },
          {
            path: 'charts',
            title: 'Koios - Gráficos',
            component: ChartScreenComponent,
          },
        ],
      },
      {
        path: 'assistant',
        title: 'Koios - Assistente',
        component: AssistantScreenComponent,
        data: {
          breadcrumb: 'Koios Assistente',
        },
      },
    ],
  },
  {
    path: '**',
    title: 'Page Not Found! 😥',
    component: PageNotFoundComponent,
  },

  //
];
