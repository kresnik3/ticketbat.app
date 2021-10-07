import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Rest } from '../../providers/rest';

@Component({
  selector: 'page-mytickets',
  templateUrl: 'mytickets.html'
})
export class MyTicketsPage {

  tickets: any;

  constructor(public naco: NavController,
              public rest: Rest,
              public napa: NavParams) {
          //init
          if(!this.rest.logged())
              this.naco.pop();
          this.tickets = napa.get('tickets');
  }

}
