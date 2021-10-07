import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Rest } from '../../providers/rest';
import { MyTicketsPage } from '../mytickets/mytickets';

@Component({
  selector: 'page-mypurchases',
  templateUrl: 'mypurchases.html'
})
export class MyPurchasesPage {

  purchases:any;

  constructor(public naco: NavController,
              public rest: Rest,
              public aler: AlertController,
              public load: LoadingController,
              public napa: NavParams) {
            //init
            if(!this.rest.logged())
                this.naco.pop();
            this.purchases = [];
            this.refresh();
  }

  refresh(){
      //loading msg
      let loader = this.load.create({
          content: 'Loading purchases\' information.<br>Please wait...'
      });
      loader.present();
      //load elements from rest
      this.rest.getPurchases().subscribe(
        data => {
          if(data.success)
            this.purchases = data.purchases;
          else
            this.aler.create({
              title: 'An Error Ocurred!',
              subTitle: data.msg,
              buttons: ['OK']
            }).present();
          loader.dismiss();
        },
        err => {
          loader.dismiss();
          this.aler.create({
            title: 'Connection Error!',
            message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
            buttons: [ {
                text: 'RETRY',
                handler: () => { this.refresh(); }
              } ]
          }).present();
        }
      );
  }

  goToMyTickets(tickets){
          this.naco.push(MyTicketsPage,{tickets:tickets});
  }

}
