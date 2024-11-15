import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [
    MenuComponent,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './matriculas.component.html',
  styleUrl: './matriculas.component.css'
})
export class MatriculasComponent implements OnInit{

  isLoading = true;

  matriculas: any = [];

  totalPages: number = 1;
  currentPage: number = 1;
  perPage: number = 5;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.listarMatriculas();
  }

  async listarMatriculas() {
    const url = 'http://127.0.0.1:8000/api/matricula?page=' + this.currentPage + '&per_page=' + this.perPage;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      }
    }

    try {
      const response = await fetch(url, options)

      if(!response.ok && response.status !== 401) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }

      if(!response.ok && response.status === 401){
        this.router.navigate(['/login']);
      }

      const data = await response.json();
      this.matriculas = data.data
      this.totalPages = data.last_page;
      this.currentPage = data.current_page;
      this.perPage = data.per_page;
      this.isLoading = false

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          console.error("Erro: ", block);
        } catch (e) {
          console.error("Erro ao analisar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado:", error);
      }

      this.isLoading = false;
    }
  }

  async deletarMatricula(matricula: any){
    const url = 'http://127.0.0.1:8000/api/matricula/' + matricula;

    this.isLoading = true

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      },
    }

    try {
      const response = await fetch(url, options)

      if(!response.ok && response.status !== 401) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }

      if(!response.ok && response.status === 401){
        this.router.navigate(['/login']);
      }

      await this.listarMatriculas()
      this.isLoading = false

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          console.error("Erro: ", block);
        } catch (e) {
          console.error("Erro ao analisar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado:", error);
      }

      this.isLoading = false;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.isLoading = true;
      this.currentPage++;
      this.listarMatriculas();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.isLoading = true;
      this.currentPage--;
      this.listarMatriculas();
    }
  }

  setPage(page: number) {
    this.isLoading = true;
    this.currentPage = page;
    this.listarMatriculas();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
