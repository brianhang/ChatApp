import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AuthenticationService } from './authentication/authentication.service';

import { AppComponent } from './app.component';

import { ChatModule } from './chat/chat.module';
import { ChatComponent } from './chat/chat.component';

import { LoginModule } from './login/login.module';
import { LoginComponent } from './login/login.component';

import { SignupModule } from './signup/signup.module';
import { SignupComponent } from './signup/signup.component';

import { NotFoundComponent } from './not-found/not-found.component';

import { LogoutModule } from './logout/logout.module';
import { LogoutComponent } from './logout/logout.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    ChatModule,
    LoginModule,
    LogoutModule,
    SignupModule,
  ],
  exports: [],
  providers: [
    AuthenticationService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
