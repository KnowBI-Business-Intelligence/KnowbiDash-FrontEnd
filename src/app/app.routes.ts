import { Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth-guard.guard';
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
import { ContentScreenComponent } from './DashView/screens/content-screen/content-screen.component';
import { MainScreenComponent } from './DashView/screens/main-screen/main-screen.component';
import { PageNotFoundComponent } from './DashView/screens/page-not-found/page-not-found.component';
import { SettingsUserComponent } from './DashView/screens/settings-user/settings-user.component';
import { LoginScreenComponent } from './shared/login-screen/login-screen.component';

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
        path: 'folders',
        component: FoldersScreenComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Pastas',
        },
        children: [
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
        ],
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
        path: 'profiles_folders',
        component: ProfilesFoldersScreenComponent,
        title: 'Koios - Administrador',
        data: {
          breadcrumb: 'Pastas e Perfis',
        },
        children: [
          {
            path: '',
            component: ProfilesFoldersComponent,
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
    title: 'Koios - Padrão',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: '',
    },
    children: [
      {
        path: '',
        title: 'Koios - Painel Usuário',
        component: MainScreenComponent,
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'main',
        title: 'Koios - Painel Usuário',
        component: MainScreenComponent,
      },
      {
        path: 'assistant',
        title: 'Koios - Painel Usuário',
        component: AssistantScreenComponent,
        data: {
          breadcrumb: 'Koios Assistente',
        },
      },
      {
        path: 'settings',
        title: 'Koios - Painel Usuário',
        component: SettingsUserComponent,
        data: {
          breadcrumb: 'Informações do Usuário',
        },
      },
    ],
  },
  {
    path: '**',
    title: 'Opss! 😥',
    component: PageNotFoundComponent,
  },
];
