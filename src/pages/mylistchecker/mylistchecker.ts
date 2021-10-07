import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Rest } from '../../providers/rest';

@Component({
  selector: 'page-mylistchecker',
  templateUrl: 'mylistchecker.html'
})
export class MyListCheckerPage {

  tickets:any;
  showtime:any;
  purchase:any;
  checked:any;

  constructor(public naco: NavController,
              public rest: Rest,
              private aler: AlertController,
              public load: LoadingController,
              public napa: NavParams) {
            //init
            if(!this.rest.logged())
                this.naco.pop();
            this.showtime = napa.get('showtime');
            this.purchase = napa.get('purchase');
            this.tickets = napa.get('tickets');
            this.checked = [];
  }

  check(value) {
      var cbIdx = this.checked.indexOf(value);
      if(cbIdx < 0 )
        this.checked.push(value);
      else
        this.checked.splice(cbIdx,1);
  }

  submit() {
    if(this.checked.length)
    {
          //loading msg
          let loader = this.load.create({
              content: 'Checking Tickets.<br>Please wait...'
          });
          loader.present();
          //load elements from rest
          this.rest.checkTickets(this.purchase,this.checked.join(),this.showtime).subscribe(
            data => {
              loader.dismiss();
              if(data.success)
                this.naco.pop();
              else
                this.aler.create({
                  title: 'An Error Ocurred!',
                  subTitle: data.msg,
                  buttons: ['OK']
                }).present();
            },
            err => {
              loader.dismiss();
              this.aler.create({
                title: 'Connection Error!',
                message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
                buttons: [ {
                    text: 'RETRY',
                    handler: () => { this.submit(); }
                  } ]
              }).present();
            }
          );
    }
    else
        this.naco.pop();
  }

}
