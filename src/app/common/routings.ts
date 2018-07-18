import { Routes,RouterModule } from "@angular/router";
import { LoginComponent } from "../login/login.component";
import { UsersComponent } from "../users/users.component";
import { ForgetPasswordComponent } from "../common/forget-password/forget-password.component";
import {UserloginComponent} from '../userlogin/userlogin.component';
import { ChangePasswordComponent } from '../change-password/change-password.component'
import { AuthGuard } from '../common/auth.guard';
const approuts : Routes = [
    {
        path:'userlogin', component:LoginComponent
    },
    {
        path:'users', component:UsersComponent,canActivate:[AuthGuard]
    },
    {
        path:'forget', component:ForgetPasswordComponent
    },
    {
        path:'login', component:UserloginComponent
    },
    {
        path:'', component:UserloginComponent
    },
    {
        path:'change_pw', component:ChangePasswordComponent, canActivate:[AuthGuard]
    },
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: '**', redirectTo: 'users', pathMatch: 'full' }
   
];

export const approutes = RouterModule.forRoot(approuts);