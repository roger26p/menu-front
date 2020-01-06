import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConectionService {

  public static API_ENDPOINT='http://localhost:8000/';

  constructor() { }

  get_token()
  {
    return localStorage.getItem("token");
  }
}
