import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
import {Device} from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import {md5} from './md5';

let URL = 'https://www.ticketbat.com/api/app/';
let APP_KEY = 'base64:MXMi7Cr2zYgbDJzQgPXRtUyYiU1itaIgcbOphZEaW7o=';

@Injectable()
export class Rest {

    location:any='All';
    countries:any=[];
    cities:any=[];
    shows:any=[];
    venues:any=[];

    user:any=null;
    a_token: any='';
    s_token: any='';
    x_token:any='';

    system_info:any='';

    constructor(public http: Http,
                public https: HttpClient,
                private devc: Device,
                public stor: Storage,
                public aler: AlertController) {
              //get system info
              this.system_info = 'UUID: '+this.devc.uuid;
              this.system_info+= ' Model: '+this.devc.model+' Platform: '+this.devc;
              this.system_info+= ' Platform: '+JSON.stringify(this.devc.platform);
              this.system_info+= ' Version: '+this.devc.version;
              this.system_info+= ' Manufacturer: '+this.devc.manufacturer;
              this.system_info+= ' Serial: '+this.devc.serial;
              //generate token
              var unix = Math.round((new Date()).getTime() / 1000);
              this.x_token = unix+'.'+md5(unix+APP_KEY);
              //get store tokens
              this.stor.get('s_token').then((data) => {
                this.s_token = (data)? data : '';
              });
              this.stor.get('a_token').then((data) => {
                this.a_token = (data)? data : '';
              });
              this.stor.get('user').then((data) => {
                this.user = (data)? data : null;
              });
    }

    //general ****************************************

    init() {
            var url = URL+'general_init';
            var response = this.http.post(url,null,this.getHeaders()).map(res => res.json());
            response.subscribe(
              data => {
                if(data.success)
                {
                  this.countries = data.countries;
                  this.cities = data.cities;
                  this.shows = data.shows;
                  this.venues = data.venues;
                  if(this.s_token == '')
                  {
                    this.s_token = data.s_token;
                    this.stor.set('s_token',data.s_token);
                  }
                }
              }
            );
            return response;
        }

/*
    init() {
        var url = URL+'general_init';
        //var response = this.http.post(url,null,this.getHeaders()).map(res => res.json());

        const headerx = new HttpHeaders().set('Content-Type', 'application/json');
        //headers.append('Content-Type', 'application/json');
        headerx.append('A-TOKEN', this.a_token);
        headerx.append('X-TOKEN', this.x_token);
        headerx.append('S-TOKEN', this.s_token);



        var response = this.https.post('https://staging.ticketbat.com/api/app/general_init',{
            headerx
        }).map((rawResponse: any) => {
      return JSON.parse(rawResponse._body);
    });
        response.subscribe(
          data => {
            if(data.success)
            {
              this.countries = data.countries;
              this.cities = data.cities;
              this.shows = data.shows;
              this.venues = data.venues;
              if(this.s_token == '')
              {
                this.s_token = data.s_token;
                this.stor.set('s_token',data.s_token);
              }
            }
          }
        );
        return response;
    }
*/
    getCountries() {
      return this.countries;
    }

    getCity(lat,lon) {
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+'%2C'+lon+'&language=en';
        return this.http.get(url).map(res => res.json()).catch(this.handleError);
    }

    getUser(){
        this.stor.get('user').then((data) => {
          this.user = (data)? data : null;
        });
        return this.user;
    }

    getLocation(){
        return this.location;
    }

    setLocation(location){
        this.location = location;
    }

    getCities() {
        return this.cities;
    }

    getShows() {
        return this.shows;
    }

    getShow(id) {
        var url = URL+'general_show';
        let body = JSON.stringify({show_id:id});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    getEvent(id,date) {
        var url = URL+'general_event';
        let body = JSON.stringify({show_id:id,date:date});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    getVenues() {
        return this.venues;
    }

    getPurchases() {
        var url = URL+'my_purchases';
        let body = JSON.stringify({user_id:this.user.id});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    getVenuesCheck() {
        var url = URL+'my_venues_check';
        let body = JSON.stringify({user_id:this.user.id});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    getEventsCheck(show_id) {
        var url = URL+'my_events_check';
        let body = JSON.stringify({show_id:show_id});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    getPurchasesCheck(show_time_id) {
        var url = URL+'my_purchases_check';
        let body = JSON.stringify({show_time_id:show_time_id});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    scanTickets(showtime,code) {
        var url = URL+'my_tickets_scan';
        let body = JSON.stringify({show_time_id:showtime,code:code});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    checkTickets(purchase,tickets,showtime) {
        var url = URL+'my_tickets_check';
        let body = JSON.stringify({purchase_id:purchase,tickets:tickets,show_time_id:showtime});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    sendContactEmail(name,email,phone,show_name,message) {
        var url = URL+'general_contact';
        let body = JSON.stringify({name:name,email:email,phone:phone,show_name:show_name,message:message,system_info:this.system_info});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    //shoppingcart ****************************************

    getCart() {
        var url = URL+'cart_get';
        let body = JSON.stringify({s_token:this.s_token});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    addCart(showtime,ticket,qty) {
        var url = URL+'cart_add';
        let body = JSON.stringify({show_time_id:showtime,ticket_id:ticket,qty:qty,s_token:this.s_token});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    updateCart(shoppingcart,qty) {
        var url = URL+'cart_update';
        let body = JSON.stringify({shoppingcart_id:shoppingcart,qty:qty,s_token:this.s_token});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    removeCart(shoppingcart) {
        var url = URL+'cart_remove';
        let body = JSON.stringify({shoppingcart_id:shoppingcart,s_token:this.s_token});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    couponCart(code) {
        var url = URL+'cart_coupon';
        let body = JSON.stringify({code:code,s_token:this.s_token});
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    //purchase ****************************************

    purchaseMake(cardholder,address,city,country,region,zip,phone,email,card,month,year,cvv) {
        var url = URL+'purchase_make';
        let body = JSON.stringify({
                                   cardholder:cardholder,
                                   address:address,
                                   city:city,
                                   country:country,
                                   region:region,
                                   zip:zip,
                                   phone:phone,
                                   email:email,
                                   card:card,
                                   month:month,
                                   year:year,
                                   cvv:cvv,
                                   s_token:this.s_token,
                                   x_token:this.x_token
                                 });
        return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }
    //auth ****************************************

    login(email,password){
      var url = URL+'auth_login';
      let body = JSON.stringify({email:email,password:md5(password)});
      var response = this.http.post(url,body,this.getHeaders()).map(res => res.json());
      response.subscribe(
        data => {
          if(data.success)
          {
            this.user = data.user;
            this.a_token = data.a_token;
            this.stor.set('a_token',this.a_token);
            this.stor.set('user',this.user);
          }
        }
      );
      return response;
    }

    register(email,first_name,last_name,phone,address,city,region,country,zip,password){
      var url = URL+'auth_register';
      let body = JSON.stringify({
                                  email:email,
                                  first_name:first_name,
                                  last_name:last_name,
                                  phone:phone,
                                  address:address,
                                  city:city,
                                  region:region,
                                  country:country,
                                  zip:zip,
                                  password:password
                                });
      return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    recover(email){
      var url = URL+'auth_recover';
      let body = JSON.stringify({email:email});
      return this.http.post(url,body,this.getHeaders()).map(res => res.json()).catch(this.handleError);
    }

    change(old_pass,new_pass){
      var url = URL+'auth_change';
      let body = JSON.stringify({a_token:this.a_token,old_pass:old_pass,new_pass:new_pass});
      var response = this.http.post(url,body,this.getHeaders()).map(res => res.json());
      response.subscribe(
        data => {
          if(data.success)
          {
            this.a_token = data.a_token;
            this.stor.set('a_token',this.a_token);
          }
        }
      );
      return response;
    }

    logged(){
      if(this.a_token != '' && this.user!=null)
        return true;
      return false;
    }

    logout(){
      this.a_token = '';
      this.user = null;
      this.stor.set('a_token',this.a_token);
      this.stor.set('user',this.user);
    }

    //get headers ********************************************************************
    getHeaders(){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('A-TOKEN', this.a_token);
        headers.append('X-TOKEN', this.x_token);
        headers.append('S-TOKEN', this.s_token);
        let options = new RequestOptions({ headers: headers });
        return options;
    }

    //errors handle****************************************
    handleError(error) {
        return Observable.throw(error.json().error || 'Server error');
    }

}
