import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './layout/home/home.component';
import { LoginComponent } from './layout/login/login.component';
import { BoardAdminComponent } from './features/board-admin/board-admin.component';
import { BoardModeratorComponent } from './features/board-moderator/board-moderator.component';
import { BoardUserComponent } from './features/board-user/board-user.component';
import { RegisterComponent } from './layout/register/register.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { CoreModule } from './core/core.module';
import { FeaturesModule } from './features/features.module';
import { LayoutModule } from './layout/layout.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    ProfileComponent,
    RegisterComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    FeaturesModule,
    LayoutModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
