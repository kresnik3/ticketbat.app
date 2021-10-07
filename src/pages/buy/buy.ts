import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Rest } from '../../providers/rest';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ShoppingcartPage } from '../shoppingcart/shoppingcart';

@Component({
  selector: 'page-buy',
  templateUrl: 'buy.html',
  providers: [SocialSharing]
})
export class BuyPage {

  event: any;
  showtime_id: any;
  ticket_id:any;
  maxqty:any;
  qty:any;
  amount:any;

  constructor(public naco: NavController,
              public napa: NavParams,
              public rest: Rest,
              private aler: AlertController,
              public load: LoadingController,
              public sosh: SocialSharing,
              public toas: ToastController,
              public navCtrl: NavController) {
              //init values
              this.event = [];
              this.qty = this.maxqty = 1;
              this.amount = 0;
              //loading msg
              let loader = this.load.create({
                  content: 'Loading event\'s information.<br>Please wait...'
              });
              loader.present();
              //load elements from rest
              this.rest.getEvent(napa.get('id'),napa.get('date')).subscribe(
                data => {
                  if(data.success && data.event)
                  {
                    this.event = data.event;
                    this.showtime_id = this.event.times[0].id;
                    this.ticket_id = this.event.types[0].tickets[0].id;
                    this.maxqty  = this.event.types[0].tickets[0].max_available;
                    this.amount = this.event.types[0].tickets[0].amount;
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
                    title: 'An Error Ocurred!',
                    subTitle: 'We could not connect with our servers.<br>Please check your network.',
                    buttons: ['OK']
                  }).present();
                }
              );
  }
  //navigator
  goBack() {
              this.naco.pop();
  }
  //share social media
  shareSocialMedia(){
              this.sosh.share('Hey! Buy tickets for this event: '+this.event.name+'!','TicketBat Event',null,'https://ticketbat.com/buy/'+this.event.slug+'/'+this.event.id)
               .then(()=>{},
               ()=>{
                 this.aler.create({
                   title: 'Error',
                   subTitle: 'The system has not access to share this event.',
                   buttons: ['OK']
                 }).present();
               });
  }
  //add to cart
  add(){
          this.rest.addCart(this.showtime_id,this.ticket_id,this.qty).subscribe(
            data => {
              if(data.success)
              {
                this.aler.create({
                  title: 'Added to the cart!',
                  message: 'The tickets were added successfully at the shopping cart.',
                  buttons: [
                    {
                      text: 'Continue shopping',
                      handler: () => {
                        this.naco.pop();
                      }
                    },
                    {
                      text: 'Checkout now',
                      handler: () => {
                        this.naco.setRoot(ShoppingcartPage);
                      }
                    }
                  ]
                }).present();
              }
              else {
                this.aler.create({
                  title: 'An Error Ocurred!',
                  subTitle: data.msg,
                  buttons: ['OK']
                }).present();
              }
            },
            err => {
              this.aler.create({
                title: 'Connection Error!',
                message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
                buttons: [ {
                    text: 'RETRY',
                    handler: () => { this.add(); }
                  } ]
              }).present();
            }
          );
  }

}
