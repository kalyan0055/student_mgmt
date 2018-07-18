import { Component, OnInit } from '@angular/core';
import { UserserviceService } from '../users/userservice.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  name:string;
  constructor(public US:UserserviceService,public routes:Router) { }

  ngOnInit() {
    console.log(this.US.userlogin);
    console.log(this.US.userdata);
    this.name = localStorage.getItem('name');
     
  }

  logout(){
    localStorage.clear();
    this.routes.navigate(['login'])
  }

  changepassword(){
    this.routes.navigate(['change_pw'])
  }
}
