import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http, Response, Headers, RequestOptions, Jsonp } from '@angular/http';
import { ConectionService } from '../services/conection.service';
import {PedidosComponent} from './pedidos.component';
import {MatSnackBar} from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'dialog-result-example-dialog',
    template: `
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4>Pedi menú</h4>
                    <small>{{menu}}</small>
                    <form [formGroup]="pedirForm" (submit)="submitpedir($event, pedirForm.value)">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <mat-form-field class="example-full-width input">
                                    <textarea formControlName="extra" matInput class="form-input" placeholder="Editar menú"></textarea>
                                </mat-form-field>
                            </div>
                
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-3 button">
                            <button class="btn btn-primary button" type="submit">Pedir</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    styles:['.input{width: 100%;}']
})
export class PedirDialog  {
    id_menu: any;
    menu:string
    public padre: PedidosComponent;
    pedirForm: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PedirDialog>, public dialog: MatDialog,  public settings: ConectionService, private http: Http, public snackBar: MatSnackBar, fb: FormBuilder) {
        this.id_menu = data.id_menu
        this.menu = data.menu

        this.pedirForm = fb.group({
            'extra': ['']
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
          return this.http.post(endpoint, value, options)
        }
    }

    submitpedir($ev, value: any){
        $ev.preventDefault();
        value['id_menu'] = this.id_menu
        return this.get_query(2, 'pedidos/', value)
        .subscribe(
          (data:any)=>{
            let body_data: any = JSON.parse(data._body);
            this.pedirForm.controls['extra'].setValue("");
            this.padre.get_menus()
            this.snackBar.open(body_data.accion, "Aceptar", {
              duration: 20000,
            });
            this.dialogRef.close('Y');
            this.padre.get_pedidos()
          },
          (error)=>{
            this.snackBar.open("Imposible pedir menú.", "Aceptar", {
              duration: 20000,
            });
            this.dialogRef.close('Y');
          }
        )
    }
}
