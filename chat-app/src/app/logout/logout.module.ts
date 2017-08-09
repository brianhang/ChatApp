import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../common/loader/loader.module';
import { LogoutComponent } from './logout.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    LoaderModule,
    HttpClientModule,
  ],
  declarations: [
    LogoutComponent
  ]
})
export class LogoutModule { }
