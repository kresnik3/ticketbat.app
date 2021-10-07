import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Rest } from '../../providers/rest';

@Component({
  selector: 'page-myscanner',
  templateUrl: 'myscanner.html',
  providers: [BarcodeScanner]
})
export class MyScannerPage {

  access:any;
  header:any='WAITING TO SCAN!';
  msg:any='';

  showtime:any;

  constructor(public naco: NavController,
              public napa: NavParams,
              public rest: Rest,
              private aler: AlertController,
              public load: LoadingController,
              public qrsc: BarcodeScanner) {
          //init
          if(!this.rest.logged())
              this.naco.pop();
          this.showtime = napa.get('showtime');
          this.scan();
  }

  scan() {
      this.access = false;
      this.msg = '';
      this.qrsc.scan().then((barcodeData) => {
        //loading msg
        let loader = this.load.create({
            content: 'Checking QR Code.<br>Please wait...'
        });
        loader.present();
        //load elements from rest
        this.rest.scanTickets(this.showtime,barcodeData.text).subscribe(
          data => {
            loader.dismiss();
            if(data.success)
            {
              this.access = true;
              this.msg = '<b>Venue: </b>'+data.purchase.venue_name+'<br>';
              this.msg+= '<b>Show: </b>'+data.purchase.show_name+'<br>';
              this.msg+= '<b>Customer: </b>'+data.purchase.first_name+' '+data.purchase.last_name+'<br>';
              this.msg+= '<b>Event: </b>'+data.purchase.show_time+'<br>';
              this.msg+= '<b>Ticket Type: </b>'+data.purchase.ticket_type_type+'<br>';
              this.msg+= '<b>Package: </b>'+data.purchase.title+'<br>';
              this.msg+= '<b>Checked/Tickets: </b>'+data.purchase.checked+' / '+data.purchase.tickets;
              this.header='ACCESS GRANTED!<br>:)';
            }
            else
            {
              this.msg = '<center>'+data.msg+'</center>';
              this.header='ACCESS DENIED!<br>:(';
            }
          },
          err => {
            loader.dismiss();
            this.aler.create({
              title: 'Connection Error!',
              message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
              buttons: [ {
                  text: 'RETRY',
                  handler: () => { this.scan(); }
                } ]
            }).present();
          }
        );
      }, (err) => {
        this.aler.create({
          title: 'An Error Ocurred!',
          subTitle: 'There is an error with the scanner.<br>You must give us permission to access the camera, and then "RETRY".<br>If that is not the case, contact us.',
          buttons: [ {
              text: 'RETRY',
              handler: () => { this.scan(); }
            } ]
        }).present();
      });
  }

}
