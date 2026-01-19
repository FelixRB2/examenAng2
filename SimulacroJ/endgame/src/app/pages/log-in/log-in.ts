import { Component, inject, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink} from "@angular/router";
import { LogInServices } from '../../services/log-in-services';
import { Iuser } from '../../interfaces/iuser';

@Component({
  selector: 'app-log-in',
  imports: [FormsModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {

  private logInServices = inject(LogInServices);
  private router = inject(Router);

  ngOnInit(): void{
    if(localStorage.getItem('access_token')) {
      this.router.navigate(['/home']);
    }
  }

  async getLogInInfo(logInForm: any){
    const logInUser: Iuser = logInForm.value as Iuser;
    try{
      let response = await this.logInServices.logIn(logInUser);
      console.log(response);
      if(response.access_token && response.refresh_token){
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        this.router.navigate(['/home']);
        logInForm.reset();
      }
    } catch (error) {
      console.error('Log In failed', error);
      logInForm.reset();
    }
  }
}
