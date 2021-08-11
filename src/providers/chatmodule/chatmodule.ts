import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ChatmoduleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatmoduleProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ChatmoduleProvider Provider');
  }

}
