import { Component, OnInit, ViewContainerRef, } from '@angular/core';
import { UserserviceService } from "./userservice.service";
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';
import * as moment from 'moment';
import { DatatablesPipe } from '../common/datatables.pipe';
import { UploadService } from '../common/upload.service';
import {ExcelService} from '../common/excel.service'
import { Url } from "../common/url";
//import {} from '../../../../register_pics'
import * as _ from "underscore";
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'; 
 
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any = []
  public data;
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "";
  public sortOrder = "asc";
  edustatus = false;
  updatestatus = false;
  eduForm: FormGroup;
  loginForm: FormGroup;
  tablestatus = true;

  model: any; 
   picName: any;
  file_exist: any;
  fileformat: any;
  file_error: boolean;
  selected_user;
  filename;
  StdForm = false;
  img_url= 'http://localhost:8081/register_pics';
  model1={username1:''};
  model2: any=[]; 
  delete_data;

  constructor(private US: UserserviceService, public fb: FormBuilder,
    private toastr: ToastrService, public vcr: ViewContainerRef,
    public USS: UploadService,private EX:ExcelService) {

  }
  d = new Date();
  public startDateOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    monthSelector: true,
    editableDateField: false,
    showTodayBtn: true,
    sunHighlight: true,
    satHighlight: false,
    markCurrentDay: true,
    markCurrentMonth: true,
    markCurrentYear: true,
    inline: false,
    selectorHeight: '232px',
    selectorWidth: '252px',
    height: '34px',
    width: '100%',
    componentDisabled: false,
    showClearDateBtn: true,
    openSelectorOnInputClick: true,
    disableSince: {
      year: this.d.getFullYear(),
      month: this.d.getMonth() + 1,
      day: this.d.getDate() + 1
    }
  };
  namepattern = `^[a-zA-Z]+$`;
  updateid = null;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  ngOnInit() {

  let d =[
{qualification: "", institution: "", university: "", yearofpass: "", percentage: ""},
{qualification: "Inter", institution: "Bashyam", university: "Bashyam School", yearofpass: "2010",percentage:"65"},
{qualification: "B.Com", institution: "Bullayya Degree ", university: "AU", yearofpass: "2012",percentage:"65"}
     ] ;
     console.log(d);
     console.log(d.filter(item=>item.qualification !=""));
     
     
 this.getUsers()

   // this.users = JSON.parse(localStorage.getItem('DATA'));

    this.eduForm = this.fb.group({
      name: [''],
      email: [''],
      mobile: [''],
      dob: [''],
      course: [''],
      fee: [''],
      photo: [''],
      itemRows: this.fb.array([this.initItemRows()]) // here
    });

    this.loginForm = this.fb.group({
      username: ['', Validators.required],// here
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      conf_password: ['', Validators.required],
      dob: ['', Validators.required],
      course: ['', Validators.required],
      fee: ['', Validators.required],
      photo: [''],
      itemRows: this.fb.array([this.initItemRows()])
    });
  }

 
  showSuccess() {
    this.toastr.success('Registerd Successfully!', 'Thank you!');
  }

  back(){
    this.tablestatus=true;
    this.StdForm=false
  }
  getUsers(){
    this.US.getUsers().subscribe((res) => {
      console.log(res);
      this.users = res.data;
    })
  }
eamilid;
  addEduinfo1(item) {
    console.log(item);
    this.model2 = item;
    console.log(this.model2.education.length,'test');
    this.selected_user = item.username;
    this.edustatus = true;
    this.tablestatus = false;
    this.updateid = item._id;
    this.eamilid = item.email;
    this.eduForm.controls['email'].disable();
    this.eduForm.patchValue({
      name: item.username,
      email: item.email,
      mobile: item.mobile,
      dob: item.dob ? { date: { day: +item.dob.substr(8, 2), month: +item.dob.substr(5, 2), year: +item.dob.substr(0, 4) } } : '',
      course: item.course,
      fee: item.fees
    })
  }

   
  updatestatus1(item) {
    console.log(item, 'popup tesing');
    this.model = item;
    this.model2 = item;
  }

  initItemRows() {
    return this.fb.group({
      qualification: ['', [Validators.required]], 
      institution: ['', Validators.required],
      university: ['', Validators.required],
      yearofpass: ['', Validators.required],
      percentage: ['', Validators.required]
    })
  }

  addEduinfo(type: string) {
    if (type == 'reg_update') {
      const contrl = <FormArray>this.eduForm.controls['itemRows'];
      contrl.push(this.initItemRows())
    }
    if (type == 'reg') {
      const contrl = <FormArray>this.loginForm.controls['itemRows'];
      contrl.push(this.initItemRows())
    }
  }

  deleteRow(index: number, type) {
    if (type == 'reg_update') {
      const control = <FormArray>this.eduForm.controls['itemRows'];
      control.removeAt(index);
    }
    if (type == 'reg') {
      const control = <FormArray>this.loginForm.controls['itemRows'];
      control.removeAt(index);
    }
  }

  close() {
    this.edustatus = false;
    this.tablestatus = true;
  }

  ChangeDate($event) {
    console.log($event);
  }

  onChange_image(event, type) {
    const files = event.srcElement.files;
    console.log(files.length);
    if(files.length > 0){
      this.picName = files;
      this.file_exist = this.picName.length;
      this.fileformat = files[0].type;
      this.filename = files[0].name;
      console.log(this.fileformat);
      
      if ((this.fileformat !== 'image/png')) {
        this.file_error = true;
        this.toastr.warning(
          'error',
          'Invalid File Format --- Please add jpg/png files'
        );
        this.eduForm.patchValue({
          photo: ''
        })
      }
      console.log(
        this.file_exist,
        this.picName[0].size,
        files,
        files.FileList,
        files[0].name,
        files[0].type
      );
    }else{
      this.picName = null
      this.file_exist = null;
      this.fileformat = null;
      this.filename = null;
    }
  
  }
   
   save() {
  
    console.log(this.model2.education.length);
    let d = this.eduForm.value.itemRows.concat((this.model2.education.length>0)?this.model2.education[0].education:[]);
    // let s = d.filter(item=>(item.qualification !="" || item.qualification !=null) && (item.institution !="" || item.institution !=null) && (item.university !="" || item.university!=null) && (item.yearofpass !="" || item.yearofpass !=null) && (item.percentage !="" || item.percentage !=null))
    let s = _.filter(d, function(num){ return num.qualification !="" });
    console.log(s);
 
    if(this.picName){
      let body = Object.assign({}, this.eduForm.value,{itemRows: s}, { dob: moment(this.eduForm.value.dob.jsdate).format('YYYY-MM-DD') }, { id: this.updateid }, { photo: this.filename },{email:this.eamilid})
      this.USS.PPEUpload(Url.API.USER_INFO, this.picName, body).subscribe((res) => {
        if(res.success){
          this.updateid=null;
          this.eduForm.reset();
          this.toastr.success(res.message,'Success')
          this.getUsers();
          this.edustatus = false;
          this.tablestatus=true; 
        }else{
          this.toastr.warning(res.message,'Error')
        }
      })
    }else{
      console.log(s);
      let body = Object.assign({}, this.eduForm.value,{itemRows:s}, { dob: moment(this.eduForm.value.dob.jsdate).format('YYYY-MM-DD') }, { id: this.updateid },{email:this.eamilid})
      this.US.userinfo_update_vimage(body).subscribe((res) => {
        if(res.success){
          this.updateid=null;
          this.eduForm.reset();
          this.toastr.success('Successfully Registered','Success')
          this.getUsers();
          this.edustatus = false;
          this.tablestatus=true; 
        }else{
          let msg:string = res.message
          this.toastr.warning(msg,'Error')
        }
      })
    }
    
  }


  // Create student starts here 

  openStdForm() {
    this.tablestatus = false;
    this.StdForm = true;
  }

  onRegister() {
    console.log(this.loginForm.value);
    if(this.loginForm.value.password  === this.loginForm.value.conf_password){

    if(this.picName){
      let body = Object.assign({}, this.loginForm.value, { dob: moment(this.loginForm.value.dob.jsdate).format('YYYY-MM-DD') }, { id: this.updateid }, { photo: this.filename })
      console.log(typeof body);
      this.USS.PPEUpload(Url.API.compRegister, this.picName, body).subscribe((res) => {
        if(res.success){
          this.updateid=null;
          this.loginForm.reset();
          this.toastr.success('Successfully Registered','Success')
          this.getUsers();
          this.StdForm = false;
          this.tablestatus=true; 
        }else{
          let msg:string = res.message
          this.toastr.warning(msg,'Error')
        }
      })
    }else{
      let body = Object.assign({}, this.loginForm.value, { dob: moment(this.loginForm.value.dob.jsdate).format('YYYY-MM-DD') })
      console.log(typeof body);
      this.US.userinfo_vimage(body).subscribe((res) => {
        if(res.success){
          this.updateid=null;
          this.loginForm.reset();
          this.toastr.success('Successfully Registered','Success')
          this.getUsers();
          this.StdForm = false;
          this.tablestatus=true; 
        }else{
          let msg:string = res.message
          this.toastr.warning(msg,'Error')
        }
      })
    } 
  }
  else{
    this.toastr.warning('Please Check Password n Confirm Password','Error')
  }

  }


 //Delete functions 
 del_education(item){
  this.model2.education[0].education.splice(this.model2.education[0].education.indexOf(item),1)
 }
 
 del_popup(item){
   console.log(item);
  this.delete_data = item;
 }

 delete(item){
   console.log(item);
    this.US.delete_User(item._id,item.photo).subscribe((res)=>{
      if (res.success) {
        this.toastr.success("Success", "Successfully Deleted");
        this.getUsers();
      } else {
        this.toastr.warning("Error", res.err)
      }
    })
 }

 excel(){
   if(this.users){
    //delete(this.users.password);
    let t=[]
    for (let k = 0; k < this.users.length; k++) {
      console.log(moment(this.users[k].dob).format('DD-MM-YYYY'));
      
      const element = this.users[k];
      if(this.users[k].education.length > 0 ){
        for (let j = 0; j < this.users[k].education.length; j++) {
          const element = this.users[k].education[j];
          for (let m = 0; m < element.education.length; m++) {
            const element1 = element.education[m];
            t.push({'username':(m==0)?this.users[k].username:'"','dob':moment(this.users[k].dob).format('DD-MM-YYYY'),'email':this.users[k].email,'mobile':this.users[k].mobile,'course':this.users[k].course,'fee':this.users[k].fees,'qualification':(element1.qualification)?element1.qualification:null,'institution':(element1.institution)?element1.institution:null,'university':(element1.university)?element1.university:null,'yearofpass':(element1.yearofpass)?element1.yearofpass:null,'percentage':(element1.percentage)?element1.percentage:null})
          }
        }
      }else{
        t.push({'username':this.users[k].username,'dob':moment(this.users[k].dob).format('DD-MM-YYYY'),'email':this.users[k].email,'mobile':this.users[k].mobile,'course':this.users[k].course,'fee':this.users[k].fees,'qualification':null,'institution':null,'university':null,'yearofpass':null,'percentage':null})
      }
    }     
    this.EX.exportAsExcelFile(t,'users')
   }
 }
pdf(){
let t=[]
  for (let k = 0; k < this.users.length; k++) {
    const element = this.users[k];
    if(this.users[k].education.length > 0 ){
          for (let j = 0; j < this.users[k].education.length; j++) {
        const element = this.users[k].education[j];
          for (let m = 0; m < element.education.length; m++) {
          const element1 = element.education[m];
         // if(element1.qualification !=""){
            t.push({'username':(m==0)?this.users[k].username:'"','dob':moment(this.users[k].dob).format('DD-MM-YYYY'),'email':this.users[k].email,'mobile':this.users[k].mobile,'course':this.users[k].course,'fee':this.users[k].fees,'qualification':(element1.qualification)?element1.qualification:null,'institution':(element1.institution)?element1.institution:null,'university':(element1.university)?element1.university:null,'yearofpass':(element1.yearofpass)?element1.yearofpass:null,'percentage':(element1.percentage)?element1.percentage:''})
       //  }
        //          t.push({'username':this.users[k].username,'dob':this.users[k].dob,'email':this.users[k].email,'mobile':this.users[k].mobile,'course':this.users[k].course,'fee':this.users[k].fees,'qualification':(element1.qualification)?element1.qualification:null,'institution':(element1.institution)?element1.institution:null,'university':(element1.university)?element1.university:null,'yearofpass':(element1.yearofpass)?element1.yearofpass:null,'percentage':(element1.percentage)?element1.percentage:null})
        }
      }
    }else{
      t.push({'username':this.users[k].username,'dob':moment(this.users[k].dob).format('DD-MM-YYYY'),'email':this.users[k].email,'mobile':this.users[k].mobile,'course':this.users[k].course,'fee':this.users[k].fees,'qualification':'-','institution':'-','university':'-','yearofpass':'-','percentage':'-'})
    }
    
  }
// new jsPDF('l', 'mm', [297, 210]);
  var doc = new jsPDF('landscape');
   var col = [
 
		{title: "Name", dataKey: "username"},
    {title: "Mobile", dataKey: "mobile"},
    {title: "Email", dataKey: "email"},
    {title: "DOB", dataKey: "dob"},
    {title: "Course", dataKey: "course"},
    {title: "Fee", dataKey: "fee"},
    {title: "Qualification", dataKey: "qualification"},
    {title: "Institution", dataKey: "institution"},
    {title: "University", dataKey: "university"},
    {title: "Year", dataKey: "yearofpass"},
    {title: "%", dataKey: "percentage"},
	];
  var rows = t
  doc.autoTable(col, rows);
  doc.save('users.pdf');
 }
}
