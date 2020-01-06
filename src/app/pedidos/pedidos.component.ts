import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ConectionService } from '../services/conection.service';
import {MatSnackBar} from '@angular/material';
import { Http, Headers, RequestOptions} from '@angular/http';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PedirDialog } from './pedir.component'

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private http: Http, public settings: ConectionService) { }

  ELEMENT_DATA_MENU:Menu[]=[];
  displayedColumnsMenu: string[] = ['nombre', 'descripcion', 'fecha', 'acciones'];
  dataSourceMenu = new MatTableDataSource<Menu>(this.ELEMENT_DATA_MENU);
  menu_length:number=0
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;

  ELEMENT_DATA_PEDIDOS:Extra[]=[];
  displayedColumnsPedidos: string[] = ['nombre', 'descripcion', 'extra'];
  dataSourcePedidos = new MatTableDataSource<Extra>(this.ELEMENT_DATA_PEDIDOS);

  ngOnInit() {
    this.get_menus()
    this.get_pedidos()
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

  get_pedidos(){
    this.ELEMENT_DATA_PEDIDOS=[] 
    this.dataSourcePedidos = new MatTableDataSource(this.ELEMENT_DATA_PEDIDOS);
    this.dataSourcePedidos._updateChangeSubscription()

    return this.get_query(1, 'pedidos/')
    .subscribe(
      (data:any)=>{
        let body_data: any = JSON.parse(data._body);
        let x =  body_data.pedidos
        
        for (let i = 0; i < x.length; i++)
        {
          let pedidos = {nombre: x[i].nombre, descripcion: x[i].descripcion, extra: x[i].extra}
          this.ELEMENT_DATA_PEDIDOS.push(pedidos)   
          this.dataSourcePedidos = new MatTableDataSource(this.ELEMENT_DATA_PEDIDOS);
          this.dataSourcePedidos._updateChangeSubscription()
        }
      },
      (error)=>{
        this.snackBar.open("Imposible buscar los pedidos.", "Aceptar", {
          duration: 20000,
        });
      }
    )
  }

  pedir(id_menu:number, nombre:string){
    let dialogRef = this.dialog.open(PedirDialog, {
      data: {"id_menu": id_menu, "menu": nombre},
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

export interface Extra{
  nombre:string,
  descripcion:string,
  extra:string
}