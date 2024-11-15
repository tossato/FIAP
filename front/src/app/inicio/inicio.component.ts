import {Component, OnInit} from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { Router } from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MenuComponent, NgIf],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{

  isLoadingAluno = true;
  isLoadingTurma = true;
  isLoadingMatricula = true;

  qtdAlunos = 0;
  qtdTurmas = 0;
  qtdMatriculas = 0;

  constructor(private router: Router) { }

  ngOnInit() {
    this.countAlunos();
    this.countTurmas();
    this.countMatriculas();
  }

  redirecionar(uri: string) {
    this.router.navigate([uri]);
  }

  countAlunos(): void {
    const url = 'http://127.0.0.1:8000/api/aluno/count';

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      },
      credentials: 'include'
    }

    fetch(url, options as RequestInit)
      .then(
        response => {
          if(!response.ok && response.status !== 401) {
            response.json().then(data => {
              throw new Error(JSON.stringify(data));
            })
          }

          if(response.status === 401){
            this.router.navigate(['/login']);
          }

          return response.json()
        }
      )
      .then(
        data => {
          this.qtdAlunos = data;
          this.isLoadingAluno = false;
        }
      )
      .catch(
        error => {
          console.log(error)
        }
      )
  }

  countTurmas(): void {
    const url = 'http://127.0.0.1:8000/api/turma/count';

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      },
      credentials: 'include'
    }

    fetch(url, options as RequestInit)
      .then(
        response => {
          if(!response.ok && response.status !== 401) {
            response.json().then(data => {
              throw new Error(JSON.stringify(data));
            })
          }

          if(response.status === 401){
            this.router.navigate(['/login']);
          }

          return response.json()
        }
      )
      .then(
        data => {
          this.qtdTurmas = data;
          this.isLoadingTurma = false;
        }
      )
      .catch(
        error => {
          console.log(error)
        }
      )
  }

  countMatriculas(): void {
    const url = 'http://127.0.0.1:8000/api/matricula/count';

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      },
      credentials: 'include'
    }

    fetch(url, options as RequestInit)
      .then(
        response => {
          if(!response.ok && response.status !== 401) {
            response.json().then(data => {
              throw new Error(JSON.stringify(data));
            })
          }

          if(response.status === 401){
            this.router.navigate(['/login']);
          }

          return response.json()
        }
      )
      .then(
        data => {
          this.qtdMatriculas = data;
          this.isLoadingMatricula = false;
        }
      )
      .catch(
        error => {
          console.log(error)
        }
      )
  }
}
