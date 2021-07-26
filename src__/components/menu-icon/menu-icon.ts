import { Component } from '@angular/core';

/**
 * Generated class for the MenuIconComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu-icon',
  templateUrl: 'menu-icon.html'
})
export class MenuIconComponent {

  text: string;

  constructor() {
    console.log('Hello MenuIconComponent Component');
    this.text = 'Hello World';
  }

}
