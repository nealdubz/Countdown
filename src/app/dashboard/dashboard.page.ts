import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, Platform } from '@ionic/angular';
import { AuthenticationService } from '../authentication.service';
import { Event } from "./../models/event.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  events = [];
  constructor(
    public authService: AuthenticationService,
    private afAuth: AngularFireAuth,
    private nav: NavController,
    private firestore: AngularFirestore,
    public plateform: Platform
  ) { }

  ngOnInit() {
    //this.getEvents();
  }
  
  
}
