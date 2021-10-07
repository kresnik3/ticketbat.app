import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Rest } from '../../providers/rest';
import { DomSanitizer } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BuyPage } from '../buy/buy';

@Component({
  selector: 'page-show-details',
  templateUrl: 'show-details.html',
  providers: [SocialSharing]
})
export class ShowDetailsPage {

  show: any;
  header: any;

  constructor(public naco: NavController,
              public napa: NavParams,
              public rest: Rest,
              private aler: AlertController,
              public load: LoadingController,
              public satz:DomSanitizer,
              public sosh: SocialSharing,
              public toas: ToastController) {
              //init values
              this.show = [];
              this.header = null;
              this.loadEvent();
  }

  loadEvent(){
    //loading msg
    let loader = this.load.create({
        content: 'Loading event\'s information.<br>Please wait...'
    });
    loader.present();
    //load elements from rest
    this.rest.getShow(this.napa.get('id')).subscribe(
      data => {
        if(data.success && data.show)
        {
          data.show.videos.forEach(e=>{ e.embed_code = this.satz.bypassSecurityTrustResourceUrl(e.embed_code); });
          this.show = data.show;
          this.header = data.show.header;
          loader.dismiss();
        }
        else {
          loader.dismiss();
          this.aler.create({
            title: 'An Error Ocurred!',
            subTitle: data.msg,
            buttons: ['OK']
          }).present();
        }
      },
      err => {
        loader.dismiss();
        this.aler.create({
          title: 'Connection Error!',
          message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
          buttons: [ {
              text: 'RETRY',
              handler: () => { this.loadEvent(); }
            } ]
        }).present();
      }
    );
  }
  //navigator
  goBack() {
              this.naco.pop();
  }
  goToBuy(date){
              this.naco.push(BuyPage,{id:this.show.id,date:date});
  }
  //share social media
  shareSocialMedia() {
              this.sosh.share('Hey! Checkout this event: '+this.show.name+'!','TicketBat Event',null,'https://ticketbat.com/event/'+this.show.slug).then(() => {
                this.toas.create({
                  message: 'Event\'s info shared!',
                  position: 'middle',
                  duration: 1000
                }).present();
              }).catch(() => {
                this.aler.create({
                   title: 'Error',
                   subTitle: 'The system has not access to share this event.',
                   buttons: ['OK']
                 }).present();
              });
  }

}
