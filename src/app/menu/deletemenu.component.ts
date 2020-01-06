import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http, Response, Headers, RequestOptions, Jsonp } from '@angular/http';
import { ConectionService } from '../services/conection.service';
import {MenuComponent} from './menu.component';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'dialog-result-example-dialog',
    template: `
        <h1 mat-dialog-title>Eliminar Menú</h1>
        <div mat-dialog-content>¿Estas seguro que deseas eliminar el menú?</div>
        <div mat-dialog-actions>
          <button mat-button (click)="delete_menu()" [disabled]="disabled">Si</button>
          <button mat-button (click)="dialogRef.close('N')">No</button>
        </div>
    `,
})
export class DeleteMenuDialog  {
    id_menu: any;
    public padre: MenuComponent;


    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteMenuDialog>, public dialog: MatDialog,  public settings: ConectionService, private http: Http, public snackBar: MatSnackBar) {
        this.id_menu = data
    }

    delete_menu()
    {
        var endpoint = ConectionService.API_ENDPOINT + 'menu/'+this.id_menu+'/'
        let token = this.settings.get_token()    
        const headers = new Headers();
        headers.append( "Authorization", "Token " + token )
        const options = new RequestOptions({headers: headers});
        this.http.delete(endpoint, options) 
        .subscribe(
            (data: any)=>{ 
                var body_data: any = JSON.parse(data._body);
                this.snackBar.open("Menú eliminado", "Aceptar", {
                    duration: 3000,
                    panelClass: ['snackbar-out-main-success']
                });
                this.padre.get_menus();   
                this.dialogRef.close('Y');
            },
            (error)=>{ 
                this.snackBar.open("Imposible eliminar menú", "Aceptar", {
                    duration: 3000,
                    panelClass: ['snackbar-out-main-success']
                });
            }
        )
    }
}
