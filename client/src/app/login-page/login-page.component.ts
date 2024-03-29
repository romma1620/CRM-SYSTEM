import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MaterialService} from '../shared/classes/material.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  aSub: Subscription;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(
        null,
        [Validators.required, Validators.email]
      ),

      password: new FormControl(
        null,
        [Validators.required, Validators.minLength(6)]
      )
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params.registered){
        MaterialService.toast('Now You can login with your email and password');
      } else if (params.accessDenied){
        MaterialService.toast('Login in the system');
      } else if (params.sessionExpired ){
        MaterialService.toast('Please login again');
      }
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();

    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']),
      error => {
        console.log(error);
        this.form.enable();
      }
    );
  }
}
