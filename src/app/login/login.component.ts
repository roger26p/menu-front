import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Http, Headers, RequestOptions} from '@angular/http';
import { ConectionService } from '../services/conection.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  
  constructor(fb: FormBuilder, private http: Http, public settings: ConectionService, private router: Router, public snackBar: MatSnackBar) { 
    this.loginForm = fb.group({
      'user': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  }

  get_query(query:string, value){
    return this.http.post(query, value) 
  }

  submitlogin($ev, value: any) {
    $ev.preventDefault();
    return this.get_query(ConectionService.API_ENDPOINT + 'login/', value)
    .subscribe(
      (data:any)=>{
        let body_data: any = JSON.parse(data._body);
        if(body_data.token!=0){
          localStorage.setItem("token", body_data.token);
          this.router.navigate(['home']);  
        }else{
          this.snackBar.open("Imposible iniciar sesión.", "Aceptar", {
            duration: 20000,
          });  
        }
      },
      (error)=>{
        this.snackBar.open("Imposible iniciar sesión.", "Aceptar", {
          duration: 20000,
        });
      }
    )
  }
}
