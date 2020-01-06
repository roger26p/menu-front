import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http, Response, Headers, RequestOptions, Jsonp } from '@angular/http';
import { ConectionService } from '../services/conection.service';
import {MenuComponent} from './menu.component';
import {MatSnackBar} from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'dialog-result-example-dialog',
    template: `
    <div class="container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4>Crear menú</h4>
                <form [formGroup]="menuForm" (submit)="submitmenu($event, menuForm.value)">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <mat-form-field class="input-form-out input"> 
                        <input formControlName="nombre" matInput type="text" class="form-input" placeholder="Nombre menú">
                        <mat-hint>Introduzca un menú</mat-hint>
                        <mat-error *ngIf="menuForm.controls['nombre'].hasError('required') && (menuForm.controls['nombre'].dirty || menuForm.controls['nombre'].touched)">
                        Nombre es <strong>requerido</strong>
                        </mat-error>
                    </mat-form-field>
                    </div>
        
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <mat-form-field class="example-full-width input">
                        <textarea formControlName="descripcion" matInput class="form-input" placeholder="descripción menú"></textarea>
                        <mat-hint>Introduzca la descripción de un menú</mat-hint>
                        <mat-error *ngIf="menuForm.controls['descripcion'].hasError('required') && (menuForm.controls['descripcion'].dirty || menuForm.controls['descripcion'].touched)">
                        Descripción es <strong>requerido</strong>
                        </mat-error>              
                    </mat-form-field>
                    </div>
        
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <mat-form-field class="input">
                        <input matInput formControlName="fecha" [matDatepicker]="picker" placeholder="Fecha creación menú">
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker #picker></mat-datepicker>
                        <mat-error *ngIf="menuForm.controls['fecha'].hasError('required') && (menuForm.controls['fecha'].dirty || menuForm.controls['fecha'].touched)">
                        Descripción es <strong>requerido</strong>
                        </mat-error> 
                    </mat-form-field>
                    </div>
        
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-3 button">
                    <button class="btn btn-primary button" type="submit">Actualizar</button>
                    </div>
                </div>
            </form>
        </div>
        </div>
    </div>
    `,
    styles:['.input{width: 100%;}']
})
export class UpdateMenuDialog  {
    id_menu: any;
    public padre: MenuComponent;
    menuForm: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UpdateMenuDialog>, public dialog: MatDialog,  public settings: ConectionService, private http: Http, public snackBar: MatSnackBar, fb: FormBuilder) {
        this.id_menu = data
        this.get_menu()

        this.menuForm = fb.group({
            'nombre': ['', Validators.compose([Validators.required])],
            'descripcion': ['', Validators.compose([Validators.required])],
            'fecha': ['', Validators.compose([Validators.required])]
        });
    }

    get_query(accion:number, query:string, value?:any){
        if(accion == 1){
          const endpoint = `${ConectionService.API_ENDPOINT}${query}`
          let token = this.settings.get_token()
          const headers = new Headers();
          headers.append( "Authorization", "Token " + token )
          const options = new RequestOptions({headers: headers});
          return this.http.get(endpoint, options)
        }
        else if(accion == 2){
          const endpoint = `${ConectionService.API_ENDPOINT}${query}`
          let token = this.settings.get_token()
          const headers = new Headers();
          headers.append( "Authorization", "Token " + token )
          const options = new RequestOptions({headers: headers});
          console.log(value)
          return this.http.put(endpoint, value, options)
        }
    }

    get_menu(){    
        return this.get_query(1, 'menu-individual/'+this.id_menu+'/')
        .subscribe(
          (data:any)=>{
            let body_data: any = JSON.parse(data._body);
            this.menuForm.controls['nombre'].setValue(body_data.menu['nombre']);
            this.menuForm.controls['descripcion'].setValue(body_data.menu['descripcion']);
            this.menuForm.controls['fecha'].setValue(body_data.menu['fecha']);

          },
          (error)=>{
            this.snackBar.open("Imposible buscar el menú.", "Aceptar", {
              duration: 20000,
            });
          }
        )
    }

    submitmenu($ev, value: any){
        $ev.preventDefault();
        let date = new Date(value.fecha)
        value['fecha']=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        value['id_menu']=this.id_menu

        return this.get_query(2, 'menu/', value)
        .subscribe(
          (data:any)=>{
            let body_data: any = JSON.parse(data._body);
            this.padre.get_menus()
            this.snackBar.open(body_data.accion, "Aceptar", {
              duration: 20000,
            });
            this.dialogRef.close('Y');
          },
          (error)=>{
            this.snackBar.open("Imposible actualizar menú.", "Aceptar", {
              duration: 20000,
            });
          }
        )
    }
}
