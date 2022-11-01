import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}
  username: string = '';
  password: string = '';
  role: string = 'user';
  loginMode: boolean = true;
  ngOnInit(): void {
   // this.authService.signUp(this.username, this.password, this.role).subscribe(res=> console.log(res));


  }

  onSubmit(form: NgForm){
    console.log(form.value);

    if(this.loginMode){
      this.authService.signIn(this.username, this.password).
      subscribe(console.log);
      return;
    } else{
      this.authService.signUp(this.username, this.password, this.role).subscribe(console.log);
    }
  }

  onModeToggle(){
    this.loginMode = !this.loginMode;
  }
}
