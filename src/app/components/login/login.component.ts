import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { combineLatest } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private cartService: CartService) {}
  username: string = '';
  password: string = '';
  role: string = 'user';
  loginMode: boolean = true;
  regex: any = String.raw`(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}/((.*[A-Z])((.*[a-z].*\d)|(.*\d.*[a-z])).*)|((.*[a-z])((.*[A-Z].*\d)|(.*\d.*[A-Z])).*)|((.*\d)((.*[a-z].*[A-Z])|(.*[A-Z].*[a-z])).*)//^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]{8,}$/`;
  ngOnInit(): void {
   // this.authService.signUp(this.username, this.password, this.role).subscribe(res=> console.log(res));


  }

  onSubmit(form: NgForm){
    console.log(form.value);

    if(this.loginMode){
      this.authService.signIn(this.username, this.password).
      subscribe(res=>{
        this.authService.snackBarService.openSnackBar(`User ${this.username} logged in successfully`, 'OK', 2000);
        this.authService.router.navigate(['/home']);

        this.cartService.initCart().subscribe(console.log);
      }, error=>{
        this.authService.snackBarService.openSnackBar(`Wrong credentials!`, 'OK', 2000);
      });
      return;
    } else{
      this.authService.signUp(this.username, this.password, this.role).subscribe(res=>{
        this.authService.snackBarService.openSnackBar(`User ${this.username} signed up successfully`, 'OK', 2000);
      },error=>{
        this.authService.snackBarService.openSnackBar(`User ${this.username} is taken!`, 'OK', 2000);
      });
    }
  }

  onModeToggle(){
    this.loginMode = !this.loginMode;
  }
  }

