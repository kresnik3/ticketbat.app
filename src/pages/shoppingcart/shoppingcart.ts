import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Rest } from '../../providers/rest';
import { PaymentPage } from '../payment/payment';

@Component({
  selector: 'page-shoppingcart',
  templateUrl: 'shoppingcart.html'
})
export class ShoppingcartPage {

  totals:any=[];

  unavailable:any=false;

  constructor(public naco: NavController,
              public rest: Rest,
              private aler: AlertController,
              public load: LoadingController,
              public toas: ToastController,
              public moda: ModalController,
              public napa: NavParams) {
          this.totals.items = [];
  }

  ionViewWillEnter(){
    this.refresh();
  }

  refresh() {
      //loading msg
      let loader = this.load.create({
          content: 'Loading items.<br>Please wait...'
      });
      loader.present();
      //load elements from rest
      this.rest.getCart().subscribe(
        data => {
          if(data.success)
          {
              this.totals = data.totals;
              this.totals.items.forEach(e=>{
                if(e.unavailable > 0)
                  this.unavailable = true;
                if(e.unavailable == 1)
                  e.unavailable = 'PASSED';
                else if(e.unavailable == 2)
                  e.unavailable = 'SOLDOUT';
                else if(e.unavailable == 3)
                  e.unavailable = 'NOT AVAILABLE';
              });
          }
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

  coupon_add() {
    //show prompt code
    this.aler.create({
      title: 'Add Coupon',
      message: 'Enter the coupon code for this purchase.',
      inputs: [{
          name: 'code',
          placeholder: 'Code'
        }],
      buttons: [{
          text: 'Cancel',
          handler: (data: any) => {}
        },{
          text: 'Add it!',
          handler: (data: any) => {
            //checking code entered
            if(data.code.trim()=='')
              this.aler.create({
                title: 'Error',
                subTitle: 'You must enter a valid coupon code!',
                buttons: ['Dismiss']
              }).present();
            else{
              //apply code
              this.rest.couponCart(data.code).subscribe(
                data => {
                  if(data.success)
                  {
                    this.totals = data.totals;
                    this.toas.create({
                      message: 'Coupon '+data.code+' added successfully!',
                      position: 'middle',
                      duration: 1500
                    }).present();
                  }
                  else
                    this.aler.create({
                      title: 'An Error Ocurred!',
                      subTitle: data.msg,
                      buttons: ['OK']
                    }).present();
                },
                err => {
                  this.aler.create({
                    title: 'Connection Error!',
                    message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
                    buttons: [ {
                        text: 'RETRY',
                        handler: () => { this.coupon_add(); }
                      } ]
                  }).present();
                }
              );
            }
          }
        }]
    }).present();
  }

  coupon_remove() {
    this.aler.create({
      title: 'Remove Coupon',
      message: 'Are you sure about remove this coupon?',
      buttons: [{
          text: 'Cancel',
          handler: (data: any) => {}
        },{
          text: 'Yes, remove it!',
          handler: (data: any) => {
            //remove code
            this.rest.couponCart('0').subscribe(
              data => {
                if(data.success)
                {
                  this.totals = data.totals;
                  this.toas.create({
                    message: 'Coupon removed successfully!',
                    position: 'middle',
                    duration: 1500
                  }).present();
                }
                else
                  this.aler.create({
                    title: 'An Error Ocurred!',
                    subTitle: data.msg,
                    buttons: ['OK']
                  }).present();
              },
              err => {
                this.aler.create({
                  title: 'Connection Error!',
                  message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
                  buttons: [ {
                      text: 'RETRY',
                      handler: () => { this.coupon_remove(); }
                    } ]
                }).present();
              }
            );
          }
        }]
    }).present();
  }

  remove(id) {
    this.aler.create({
      title: 'Remove Tickets',
      message: 'Are you sure about remove this tickets?',
      buttons: [{
          text: 'Cancel',
          handler: (data: any) => {}
        },{
          text: 'Yes, remove it!',
          handler: (data: any) => {
            //remove code
            this.rest.removeCart(id).subscribe(
              data => {
                if(data.success)
                {
                  this.totals = data.totals;
                  this.toas.create({
                    message: 'Tickets removed successfully!',
                    position: 'middle',
                    duration: 1500
                  }).present();
                }
                else
                  this.aler.create({
                    title: 'An Error Ocurred!',
                    subTitle: data.msg,
                    buttons: ['OK']
                  }).present();
              },
              err => {
                this.aler.create({
                  title: 'Connection Error!',
                  message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
                  buttons: [ {
                      text: 'RETRY',
                      handler: () => { this.remove(id); }
                    } ]
                }).present();
              }
            );
          }
        }]
    }).present();
  }

  update(index) {
    this.totals.items[index].number_of_items = Math.ceil(this.totals.items[index].number_of_items);
    var id = this.totals.items[index].id;
    var qty = this.totals.items[index].number_of_items;
    this.aler.create({
      title: 'Update Quantity of Tickets',
      message: 'Are you sure about this quantity?',
      buttons: [{
          text: 'Cancel',
          handler: (data: any) => {
              this.refresh();
          }
        },{
          text: 'Yes!',
          handler: (data: any) => {
            //remove code
            this.rest.updateCart(id,qty).subscribe(
              data => {
                if(data.success)
                {
                  this.totals = data.totals;
                  this.toas.create({
                    message: 'Quantity updated successfully!',
                    position: 'middle',
                    duration: 1500
                  }).present();
                }
                else
                  this.aler.create({
                    title: 'An Error Ocurred!',
                    subTitle: data.msg,
                    buttons: ['OK']
                  }).present();
              },
              err => {
                this.aler.create({
                  title: 'Connection Error!',
                  message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
                  buttons: [ {
                      text: 'RETRY',
                      handler: () => { this.update(index); }
                    } ]
                }).present();
              }
            );
          }
        }]
    }).present();
  }

  goToPayment(){
    if(this.unavailable)
    {
      this.aler.create({
        title: 'Check out!',
        subTitle: 'You have unavailable(s) item(s) in the shoppingcart.<br>Please, remove them first.',
        buttons: ['OK']
      }).present();
    }
    else if(this.totals.quantity<1)
    {
      this.aler.create({
        title: 'Check out!',
        subTitle: 'You have have not items in the shoppingcart.<br>Please, add some first.',
        buttons: ['OK']
      }).present();
    }
    else
    {
      let payment = this.moda.create(PaymentPage,{total:this.totals.total,qty:this.totals.quantity,user:this.rest.getUser()});
      payment.onDidDismiss(() => {
        this.refresh();
      });
      payment.present();
    }
  }

}
