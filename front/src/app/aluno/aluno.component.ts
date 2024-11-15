import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import {ActivatedRoute, Router} from "@angular/router";
import { CommonModule } from '@angular/common';
import {NgIf} from "@angular/common";
import * as bootstrap from "bootstrap";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [
    MenuComponent,
    NgIf,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.css'
})

export class AlunoComponent implements OnInit {

  @ViewChild('matricularAluno') modalElement: any;
  @ViewChild('editMatricula') modalEditar: any;

  cadastroForm!: FormGroup;
  editarMatriculaForm!: FormGroup;

  isLoading = true;
  modal: any = null;
  alunoId: string|null = null;
  aluno: any = {
    nome: '',
    usuario: '',
    data_nascimento: '',
    status: '',
    turmas: []
  };

  turmas: any = [];

  totalPages: number = 1;
  currentPage: number = 1;
  perPage: number = 5;

  erros: any = {
    id_aluno: ''
  }

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      id_turma: ['', Validators.required],
    })

    this.editarMatriculaForm = this.formBuilder.group({
      id_turma: ['', Validators.required],
    })

    this.alunoId = this.route.snapshot.paramMap.get('id');

    this.render();
  }

  async render(all: boolean = true){
    this.isLoading = true;
    await this.listarAluno();
    if(all){
      await this.listarTurmas();
    }
    this.isLoading = false;
  }

  async listarAluno() {
    const url = 'http://127.0.0.1:8000/api/aluno/' + this.alunoId + '?page=' + this.currentPage + '&per_page=' + this.perPage;
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
      this.aluno = data
      this.totalPages = data.last_page;
      this.currentPage = data.current_page;
      this.perPage = data.per_page;
      this.isLoading = false

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          console.error("Erro:", block);
        } catch (e) {
          console.error("Erro ao analisar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado:", error);
      }
    }
  }

  async listarTurmas() {

    const url = 'http://127.0.0.1:8000/api/turma';
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
      this.turmas = data
      this.isLoading = false

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          console.error("Erro:", block);
        } catch (e) {
          console.error("Erro ao analisar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado:", error);
      }
    }
  }

  async matricular(idAluno: string){
      const url = 'http://127.0.0.1:8000/api/matricula';
      let dados = this.cadastroForm.value;
      dados.id_aluno = idAluno;

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

        await this.listarAluno()
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

  async deletarMatricula(idTurma: string){
    const url = 'http://127.0.0.1:8000/api/matricula';
    let dados = {
      id_aluno: this.alunoId,
      id_turma: idTurma
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

      await this.listarAluno()
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

  openModal(modal: string){
    if (this.modalElement && modal == 'matricular') {
      this.modal = new bootstrap.Modal(this.modalElement.nativeElement);
    }
    else if (this.modalEditar && modal == 'editarMatricula') {
      this.modal = new bootstrap.Modal(this.modalEditar.nativeElement);
    }

    if(this.modal){
      this.modal.show()
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.isLoading = true;
      this.currentPage++;
      this.render(false);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.isLoading = true;
      this.currentPage--;
      this.render(false);
    }
  }

  setPage(page: number) {
    this.isLoading = true;
    this.currentPage = page;
    this.render(false);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
