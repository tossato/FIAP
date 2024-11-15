import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-turma',
  standalone: true,
  imports: [
    MenuComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './turma.component.html',
  styleUrl: './turma.component.css'
})

export class TurmaComponent implements OnInit, AfterViewInit {

  @ViewChild('matricularAluno') modalElement: any;

  cadastroForm!: FormGroup;
  modal: any = null;

  isLoading = true;
  turmaId: string|null = null;
  turma: any = {
    alunos_matriculados:[]
  };
  alunos: any = [];

  totalPages: number = 1;
  currentPage: number = 1;
  perPage: number = 5;

  erros: any = {
    id_aluno: ''
  }

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      id_aluno: ['', Validators.required],
    })
    this.turmaId = this.route.snapshot.paramMap.get('id');

    this.listarTurmasAlunos()
  }

  ngAfterViewInit() {
    if (this.modalElement) {
      this.modal = new bootstrap.Modal(this.modalElement.nativeElement);
    }
  }

  async listarTurmasAlunos() {
    const url = 'http://127.0.0.1:8000/api/turma/' + this.turmaId + '?page=' + this.currentPage + '&per_page=' + this.perPage;
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
      this.turma = data
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

  async listarAlunos() {
    if(this.alunos.length > 0){
      this.modal.show();
      return this.alunos;
    }

    const url = 'http://127.0.0.1:8000/api/aluno';
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      }
    }

    this.isLoading = true;

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
      this.alunos = data
      this.isLoading = false
      this.modal.show();

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

  async matricular() {
    const url = 'http://127.0.0.1:8000/api/matricula';
    let dados = this.cadastroForm.value;
    dados.id_turma = this.turmaId;

    this.isLoading = true

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      },
      body: JSON.stringify(dados)
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

      await this.listarTurmasAlunos()
      this.isLoading = false
      this.modal.hide()

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          if(block.message){
            this.erros.id_aluno = block.message
          }
        } catch (e) {
          console.error("Erro ao analisar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado:", error);
      }

      this.isLoading = false;
    }
  }

  async deletarMatricula(idAluno: string){
    const url = 'http://127.0.0.1:8000/api/matricula';
    let dados = {
      id_aluno: idAluno,
      id_turma: this.turmaId
    }

    this.isLoading = true

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      },
      body: JSON.stringify(dados)
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

      await this.listarTurmasAlunos()
      this.isLoading = false
      this.modal.hide()

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
      this.listarTurmasAlunos();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.isLoading = true;
      this.currentPage--;
      this.listarTurmasAlunos();
    }
  }

  setPage(page: number) {
    this.isLoading = true;
    this.currentPage = page;
    this.listarTurmasAlunos();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
