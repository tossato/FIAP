import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{

  loginForm!: FormGroup;

  isLoading = false;

  error = '';

  constructor(private $formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loginForm = this.$formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(){
    if (this.loginForm.valid) {
      const url = 'http://127.0.0.1:8000/api/user/login';
      const dados = this.loginForm.value;

      this.isLoading = true;

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dados)
      }

      fetch(url, options as RequestInit)
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.message || 'Erro desconhecido');
            });
          }
          return response.json()
        })
        .then(
          data => {
            if(data.token){
              sessionStorage.setItem('auth_token', data.token);

              this.getAdmin()
            }
          }
        )
        .catch(
          error => {
            console.error('Erro de login:', error.message);
            this.isLoading = false;
            this.error = error.message;
          }
        )
    } else {
      console.log('Formulário inválido');
    }
  }

  getAdmin(){
    const url = 'http://127.0.0.1:8000/api/user';

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      },
      credentials: 'include',
    }

    fetch(url, options as RequestInit)
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.message || 'Erro desconhecido');
          });
        }
        return response.json()
      })
      .then(
        data => {
          sessionStorage.setItem('admin', data.user.name);

          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
          this.isLoading = false;
        }
      )
      .catch(
        error => {
          console.error('Erro de login:', error.message);
          this.isLoading = false;
          alert(error.message);
        }
      )
  }

}
