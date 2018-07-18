import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule,FormsModule} from '@angular/forms'
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import { RouterModule } from "@angular/router";
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import {approutes } from "./common/routings";
import { HeaderComponent } from './header/header.component';
import {DataTableModule  } from "angular2-datatable";
import { ForgetPasswordComponent } from './common/forget-password/forget-password.component';
import { DatatablesPipe } from './common/datatables.pipe';
import { ToastrModule } from 'ngx-toastr';
import { MyDatePickerModule } from 'mydatepicker';
import { UserloginComponent } from './userlogin/userlogin.component';
import { UploadService } from './common/upload.service'
import {Url} from './common/url';
import { AuthGuard } from './common/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component'
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    HeaderComponent,
    ForgetPasswordComponent,
    DatatablesPipe,
    UserloginComponent,
    ChangePasswordComponent,
     
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    approutes,
    RouterModule,
    DataTableModule,
    ToastrModule.forRoot(),
    MyDatePickerModule,
     

  ],
  providers: [UploadService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
