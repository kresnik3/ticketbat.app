import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Rest } from '../../providers/rest';
import { MyListCheckerPage } from '../mylistchecker/mylistchecker';

@Component({
  selector: 'page-mylist',
  templateUrl: 'mylist.html'
})
export class MyListPage {

  purchases:any;
  showtime:any;

  constructor(public naco: NavController,
              public rest: Rest,
              private aler: AlertController,
              public load: LoadingController,
              public napa: NavParams) {
            //init
            if(!this.rest.logged())
                this.naco.pop();
            this.showtime = napa.get('showtime');
            this.purchases = [];
  }

  ionViewWillEnter(){
    this.refresh();
  }

  refresh() {
      //loading msg
      let loader = this.load.create({
          content: 'Loading purchases\' information.<br>Please wait...'
      });
      loader.present();
      //load elements from rest
      this.rest.getPurchasesCheck(this.showtime).subscribe(
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

  goToMyListChecker(id,to_check){
      if(to_check.length)
          this.naco.push(MyListCheckerPage,{showtime:this.showtime,purchase:id,tickets:to_check});
      else
          this.aler.create({
            title: 'Error!',
            subTitle: 'This purchase has no tickets to check.<br>Please select a different one.',
            buttons: ['OK']
          }).present();
  }

}
