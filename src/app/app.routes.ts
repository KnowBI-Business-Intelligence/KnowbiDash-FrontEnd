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
import { BillingComponentsComponent } from './DashView/screens/billing-screen/billing-components/billing-components.component';
import { BillingScreenComponent } from './DashView/screens/billing-screen/billing-screen.component';
import { RecipeComponent } from './DashView/screens/billing-screen/recipe/recipe.component';
import { ContentDashComponent } from './DashView/screens/content-dash/content-dash.component';
import { ContentScreenComponent } from './DashView/screens/content-screen/content-screen.component';
import { DashboardsScreenComponent } from './DashView/screens/dashboards-screen/dashboards-screen.component';
import { EmergencyServicesComponentComponent } from './DashView/screens/emergency-services-screen/emergency-services-component/emergency-services-component.component';
import { EmergencyServicesScreenComponent } from './DashView/screens/emergency-services-screen/emergency-services-screen.component';
import { MatMedComponent } from './DashView/screens/emergency-services-screen/mat-med/mat-med.component';
import { ServiceComponent } from './DashView/screens/emergency-services-screen/service-care/service.component';
import { TimeComponent } from './DashView/screens/emergency-services-screen/time/time.component';
import { AccountsPayableComponent } from './DashView/screens/finance-screen/accounts-payable/accounts-payable.component';
import { AccountsReceivableComponent } from './DashView/screens/finance-screen/accounts-receivable/accounts-receivable.component';
import { BankControlComponent } from './DashView/screens/finance-screen/bank-control/bank-control.component';
import { CashFlowComponent } from './DashView/screens/finance-screen/cash-flow/cash-flow.component';
import { FinanceComponentsComponent } from './DashView/screens/finance-screen/finance-components/finance-components.component';
import { FinanceScreenComponent } from './DashView/screens/finance-screen/finance-screen.component';
import { ReturnOfAgreementsComponent } from './DashView/screens/finance-screen/return-of-agreements/return-of-agreements.component';
import { TransferThirdPartiesComponent } from './DashView/screens/finance-screen/transfer-third-parties/transfer-third-parties.component';
import { TreasuryComponent } from './DashView/screens/finance-screen/treasury/treasury.component';
import { MainScreenComponent } from './DashView/screens/main-screen/main-screen.component';
import { PageNotFoundComponent } from './DashView/screens/page-not-found/page-not-found.component';
import { EmployeeProductivityComponentComponent } from './DashView/screens/pharmacy-screen/employee-productivity-component/employee-productivity-component.component';
import { GeneralProductivityComponentComponent } from './DashView/screens/pharmacy-screen/general-productivity-component/general-productivity-component.component';
import { InventoryComponentComponent } from './DashView/screens/pharmacy-screen/inventory-component/inventory-component.component';
import { LossOfStockComponentComponent } from './DashView/screens/pharmacy-screen/loss-of-stock-component/loss-of-stock-component.component';
import { NonStandardComponentComponent } from './DashView/screens/pharmacy-screen/non-standard-component/non-standard-component.component';
import { PharmacyCompomentComponent } from './DashView/screens/pharmacy-screen/pharmacy-compoment/pharmacy-compoment.component';
import { PharmacyScreenComponent } from './DashView/screens/pharmacy-screen/pharmacy-screen.component';
import { PrescribedUsedComponentComponent } from './DashView/screens/pharmacy-screen/prescribed-used-component/prescribed-used-component.component';
import { ProductionTimeComponentComponent } from './DashView/screens/pharmacy-screen/production-time-component/production-time-component.component';
import { NotificationComponent } from './DashView/screens/quality-screen/notification/notification.component';
import { QualityComponentComponent } from './DashView/screens/quality-screen/quality-component/quality-component.component';
import { QualityScreenComponent } from './DashView/screens/quality-screen/quality-screen.component';
import { ServiceQualityComponent } from './DashView/screens/quality-screen/service-quality/service-quality.component';
import { ConsumptionComponentComponent } from './DashView/screens/supplies-screen/consumption-component/consumption-component.component';
import { SuppliesComponentComponent } from './DashView/screens/supplies-screen/supplies-component/supplies-component.component';
import { SuppliesScreenComponent } from './DashView/screens/supplies-screen/supplies-screen.component';
import { ProductivityComponent } from './DashView/screens/ti-screen/productivity/productivity.component';
import { TIComponent } from './DashView/screens/ti-screen/ti-component/ti-component.component';
import { TIScreenComponent } from './DashView/screens/ti-screen/ti-screen.component';
import { WorkOrdersComponent } from './DashView/screens/ti-screen/work-orders/work-orders.component';
import { AuthGuard } from './services/guards/auth-guard.guard';
import { ChartGroupsComponent } from './DashView/screens/chart-groups/chart-groups.component';
import { ChartScreenComponent } from './DashView/screens/chart-screen/chart-screen.component';

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
        path: 'folders',
        component: FoldersScreenComponent,
        title: 'Koios - Pastas',
        data: {
          breadcrumb: 'Pastas',
        },
        children: [
          {
            path: '',
            component: FoldersComponent,
            title: 'Koios - Criar Pastas',
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
        ],
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
        title: 'Koios - Pastas/Perfis',
        data: {
          breadcrumb: 'Pastas e Perfis',
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
