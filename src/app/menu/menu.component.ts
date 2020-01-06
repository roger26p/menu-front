import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions} from '@angular/http';
import { ConectionService } from '../services/conection.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import {MatSnackBar} from '@angular/material';
import { DeleteMenuDialog } from './deletemenu.component';
import { UpdateMenuDialog } from './updatemenu.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuForm: FormGroup;

  ELEMENT_DATA_MENU:Menu[]=[];
  displayedColumnsMenu: string[] = ['nombre', 'descripcion', 'fecha', 'acciones'];
  dataSourceMenu = new MatTableDataSource<Menu>(this.ELEMENT_DATA_MENU);
  menu_length:number=0
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;

  constructor(public dialog: MatDialog, fb: FormBuilder, public snackBar: MatSnackBar, private http: Http, public settings: ConectionService) {
    this.menuForm = fb.group({
      'nombre': ['', Validators.compose([Validators.required])],
      'descripcion': ['', Validators.compose([Validators.required])],
      'fecha': ['', Validators.compose([Validators.required])]
    });
   }

  ngOnInit() {
    this.get_menus()
    this.dataSourceMenu.paginator = this.paginator;
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

  get_menus(){
    this.ELEMENT_DATA_MENU=[] 
    this.dataSourceMenu = new MatTableDataSource(this.ELEMENT_DATA_MENU);
    this.dataSourceMenu.paginator = this.paginator;
    this.dataSourceMenu._updateChangeSubscription()

    return this.get_query(1, 'menu/')
    .subscribe(
      (data:any)=>{
        let body_data: any = JSON.parse(data._body);
        let x =  body_data.menu
        this.menu_length = body_data.menu.length
        for (let i = 0; i < x.length; i++)
        {
          let menu = {id: x[i].id, nombre: x[i].nombre, descripcion: x[i].descripcion, fecha: x[i].date_created}
          this.ELEMENT_DATA_MENU.push(menu)   
          this.dataSourceMenu = new MatTableDataSource(this.ELEMENT_DATA_MENU);
          this.dataSourceMenu.paginator = this.paginator;
          this.dataSourceMenu._updateChangeSubscription()
        }
      },
      (error)=>{
        this.snackBar.open("Imposible buscar los menú.", "Aceptar", {
          duration: 20000,
        });
      }
    )
  }

  submitmenu($ev, value: any){
    $ev.preventDefault();
    let date = new Date(value.fecha)
    value['fecha']=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
 
    return this.get_query(2, 'menu/', value)
    .subscribe(
      (data:any)=>{
        let body_data: any = JSON.parse(data._body);

        this.menuForm.controls['nombre'].setValue("");
        this.menuForm.controls['descripcion'].setValue("");
        this.menuForm.controls['fecha'].setValue("");
        this.get_menus()

        this.snackBar.open(body_data.accion, "Aceptar", {
          duration: 20000,
        });

      },
      (error)=>{
        this.snackBar.open("Imposible crear menú.", "Aceptar", {
          duration: 20000,
        });
      }
    )
  }

  actualizar_menu(id_menu:number){
    let dialogRef = this.dialog.open(UpdateMenuDialog, {
      data: id_menu,
    });
    dialogRef.componentInstance.padre = this;
    dialogRef.afterClosed().subscribe(result => {
    }); 
  }

  eliminar_menu(id_menu:number){
    let dialogRef = this.dialog.open(DeleteMenuDialog, {
      data: id_menu,
    });
    dialogRef.componentInstance.padre = this;
    dialogRef.afterClosed().subscribe(result => {
    }); 
  }
}

export interface Menu{
  id:number,
  nombre:string,
  descripcion:string,
  fecha:string
}