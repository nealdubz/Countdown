import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireStorage } from "@angular/fire/storage";
import { Event } from "./../models/event.model";
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {

  event = {} as Event;
  file: any;

  loading: HTMLIonLoadingElement;
  percentageVal: Observable<number>;
  isFileUploaded: boolean;
  UploadedImageURL: any;
  imgUrl: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private nav: NavController,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  }
  async create(event: Event) {
    if (this.formValidate()) {
      
      try {
        this.firestore.collection("events").add(event).then(
          async resp => { 
            this.event.photoURL = await this.uploadfile(resp.id, this.file);   
            await this.firestore.doc("events/"+resp.id).update(event);
          }
        );
      } catch (e) {
        this.authService.showToast(e);
      }
    }
  }

  async uploadfile(id, file): Promise<any>{
    if(file && file.length){
      try {
        await this.authService.presentLoading();
        const fileStoragePath = `images/events/${file[0].name}`;
        const task=  this.storage.upload(fileStoragePath, file[0]);
        // Show percentage
        task.percentageChanges().subscribe(resp => {
          this.authService.loading.style.setProperty('--percent-uploaded', `${resp.toFixed()}%`)
        });

        // important as it needs to await
        await task;
        this.UploadedImageURL  = this.storage.ref(fileStoragePath).getDownloadURL();
        this.UploadedImageURL.subscribe(async resp=>{
          this.isFileUploaded = true;
          this.authService.loading.dismiss();
          this.nav.navigateRoot("dashboard");
        },error=>{
          this.authService.showToast(error);
        });
        
        return  this.UploadedImageURL.toPromise();
      } catch (error) {
        this.authService.showToast(error);
      }
    }
  }

  formValidate() {
    if (!this.event.eventName) {
      this.authService.showToast("Enter Title");
      return false;
    }
    if (!this.event.eventDescription){
      this.authService.showToast("Enter Details");
      return false;
    }
    return true;
  }

  chooseFile(event){
    this.file = event.target.files;
    this.isFileUploaded  = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event:any) => {
        this.imgUrl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);  // to trigger onload
    }
  }
}
