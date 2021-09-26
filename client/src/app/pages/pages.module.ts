import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

import { PagesRoutingModule } from './pages-routing.module';
import { Ng4FilesModule } from '../shared/ng4-files';


@NgModule({
  imports: [
    PagesRoutingModule,
    FormsModule,
    CommonModule,
    Ng4FilesModule
    ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ]
})
export class PagesModule { }
