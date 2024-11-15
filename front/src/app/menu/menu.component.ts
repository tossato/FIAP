import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  isLoading = false;
  admin: string|null = sessionStorage.getItem('admin');

  constructor(private router: Router) {}

  ngOnInit() {}

  logout(){
      const url = 'http://127.0.0.1:8000/api/user/logout';

      this.isLoading = true;

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
        },
        credentials: 'include'
      }

      fetch(url, options as RequestInit)
        .then(
          response => response.json()
        )
        .then(
          data => {
            this.isLoading = false;
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('admin');
            this.router.navigate(['/login']);
          }
        )
        .catch(
          error => {
            console.log(error)
            this.isLoading = false;
          }
        )
  }
}
