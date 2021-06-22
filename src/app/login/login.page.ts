import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["dashboard"]);
    }
  }

  ngOnInit() {}

  async logIn(email, password) {
    await this.authService.presentLoading();
    this.authService
      .SignIn(email.value, password.value)
      .then((res) => {
        // if(this.authService.isEmailVerified) {
        this.router.navigate(["dashboard"]);
        // } else {
        //   this.authService.showToast('Email is not verified');
        //   return false;
        // }
      })
      .catch((error) => {
        this.authService.showToast(error.message);
      });
      await this.authService.loading.dismiss();
  }
}
