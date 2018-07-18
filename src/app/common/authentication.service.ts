import { Injectable, COMPILER_OPTIONS } from '@angular/core';
import { UserserviceService } from "../users/userservice.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private US:UserserviceService) { }

  login(value){
  return this.US.callApi('http://192.168.0.110:8081/authentication/login','post',value);
  }
}
