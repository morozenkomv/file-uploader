import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FileUploadComponent } from './common/file-upload.component';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { JwtInterceptorModule } from '../interceptors/jwt.interceptor';

import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatTableModule, MatCardModule,
  MatProgressSpinnerModule, MatProgressBarModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    JwtInterceptorModule,

    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,

    RouterModule.forRoot([
      { path: '', component: HomeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
      { path: 'login', component: LoginComponent }
    ]),

    BrowserAnimationsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    { provide: 'API_ENDPOINT', useValue: environment.api_endpoint },
    {
      provide: APP_INITIALIZER,
      useFactory: (as: AuthService) => function () { return as.initUser(); },
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
