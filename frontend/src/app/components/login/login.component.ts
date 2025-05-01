import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterOutlet, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  apiObj: any = {
    "username":"",
    "password":""
  }
  router = inject(Router);
  http = inject(HttpClient);

  onLogin(){

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = `username=${this.apiObj.username}&password=${this.apiObj.password}`;

    this.http.post("http://127.0.0.1:8000/auth/login/", body, { headers }).subscribe((res:any)=>{
      localStorage.setItem("token",res.access_token);
      this.router.navigateByUrl("/home")

    }, error=>{
      console.error("Login failed:", error);
      alert("Login failed");
    })
  }
}
