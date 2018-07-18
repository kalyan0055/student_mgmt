import { Component, OnInit } from '@angular/core';
import {
  FormArray, Form, FormControlName, FormGroup, FormBuilder, NG_VALIDATORS, Validator,
  Validators, AbstractControl, ValidatorFn
} from '@angular/forms';
import { Router, Routes } from "@angular/router";
import { UserserviceService } from '../users/userservice.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logindata = { 'username': '', password: '' }
  model = { username: '', email: '', mobile: '', password: '', conf_password: '' }
  name: any;
  msg;
  password_status = false;
  loginForm: FormGroup
  constructor(public fb: FormBuilder, public router: Router, public US: UserserviceService,private toastr: ToastrService ) { }
  

  ngOnInit() {
    this.US.userlogin=false;
    console.log(this.logindata.username);
    this.loginForm = this.fb.group({
      title: [''],
    })
  }

  onSubmit() {
    console.log(this.model,this.model.password.length);
    if(this.model.password.length < 6){
      this.model.password = '';
      this.model.conf_password = '';
      this.toastr.warning('Password Must be 6 Character','Error');
    }
    if (this.model.password === this.model.conf_password) {
      console.log('if case');
      this.US.register(this.model).subscribe((res) => {
        console.log(res.data);
        if (res.success) {
          this.toastr.success('Registerd Successfully!', 'Thank you!');
         this.router.navigate(['login']);
        } else {
          this.US.userlogin = res.success;
          this.toastr.warning('Email Already Existed','Error');
        }
      });
    } else {
      console.log('esse case');
      this.model.conf_password = '';
      this.toastr.warning('Password and Confirm Password Must be Same','Error');
    }
  }




  // }
  forgetpassword() {
    this.router.navigate(['forget']);
  }
  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
  login()
  {
    this.router.navigate(['/login']);
  }
}
