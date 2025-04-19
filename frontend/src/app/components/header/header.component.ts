import { Component, inject, OnInit } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  configService = inject(ConfigService);
  router = inject(Router);
  
  id = 1; //user_id
  role = "";
  isAdmin: boolean = false;
  isDoctor: boolean = false;
  isPatient: boolean = false;
  isUser: boolean = false;
  getRole(){
    this.configService.getUserRole(this.id).subscribe(
      (response:any) => {
        this.role = response;
      },
      (error:any) => {
        console.error('Error fetching data:', error);
      }
    );
    if (this.role == "admin"){
      this.isAdmin = true;
    }
    else if (this.role == "doctor"){
      this.isDoctor = true;
    }
    else if (this.role == "patient"){
      this.isPatient = true;
    }
    else{
      this.isUser = true;
    }

  }
  ngOnInit(): void {
    this.getRole();
  }
  onLogOff(){
    localStorage.removeItem("token");
    this.router.navigateByUrl("login")
  }

}
