import { Component, OnInit, ViewChild} from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import {Router, RouterLink} from "@angular/router";
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import * as bootstrap from "bootstrap";
import {HttpParams} from "@angular/common/http";
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-listaAlunos',
  standalone: true,
  imports: [
    NgxPaginationModule,
    CommonModule,
    MenuComponent,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './listaAlunos.component.html',
  styleUrl: './listaAlunos.component.css'
})

export class ListaAlunosComponent implements OnInit {
  @ViewChild('cadastroAluno') modalCadastro: any;
  @ViewChild('editAluno') modalEditar: any;
  @ViewChild('matricularAluno') modalMatricular: any;

  modal: any = null;
  cadastroForm!: FormGroup;
  editarForm!: FormGroup;
  matriculaForm!: FormGroup;
  searchForm!: FormGroup;

  alunos: any = [];
  totalPages: number = 1;
  currentPage: number = 1;
  perPage: number = 1;

  turmas: any = [];
  erros: any = {
    nome: '',
    data_nascimento: '',
    id_aluno:'',
    id_turma: ''
  }

  isLoading = true;

  idAlunoSelecionado = 0;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      data_nascimento: ['', Validators.required],
    })

    this.editarForm = this.formBuilder.group({
      nome: ['', Validators.required],
      data_nascimento: ['', Validators.required],
    })

    this.matriculaForm = this.formBuilder.group({
      id_turma: ['', Validators.required],
    })

    this.searchForm = this.formBuilder.group({
      nome: [''],
      usuario: [''],
      status: [''],
    })

    this.listarAlunos()
  }

  async listarAlunos() {
    const url = `http://127.0.0.1:8000/api/aluno?page=${this.currentPage}`;
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
      this.alunos = data.data
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

      this.isLoading = false;
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
      this.turmas = data
      this.isLoading = false
      if(this.modal){
        this.modal.show();
      }

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

      this.isLoading = false;
    }
  }

  async cadastrarAluno() {
    const url = 'http://127.0.0.1:8000/api/aluno';
    const dados = this.cadastroForm.value;

    this.erros = {
      nome: '',
      data_nascimento: ''
    }

    this.isLoading = true;

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

      await this.listarAlunos();
      this.closeModal();
      this.isLoading = false;

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);

          if(block.errors.nome){
            this.erros.nome = block.errors.nome[0]
          }

          if(block.errors.data_nascimento){
            this.erros.data_nascimento = block.errors.data_nascimento[0]
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

  async deletarAluno(id: number) {
    const url = 'http://127.0.0.1:8000/api/aluno/' + id;
    this.isLoading = true;

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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

      await this.listarAlunos();
      this.isLoading = false;

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          console.error(block);
        } catch (e) {
          console.error("Erro ao analisar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado:", error);
      }

      this.isLoading = false;
    }
  }

  async editar(idAluno: number){
    const url = 'http://127.0.0.1:8000/api/aluno/' + idAluno;
    const dados = this.editarForm.value;

    this.isLoading = true;

    this.erros = {
      nome: '',
      data_nascimento: ''
    }

    const options = {
      method: 'PUT',
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

      await this.listarAlunos();
      this.isLoading = false;
      this.closeModal();

    } catch (error: unknown) {
      if (error instanceof Error) {
        try{
          const block = JSON.parse(error.message);
          if(block.errors.nome){
            this.erros.nome = block.errors.nome[0]
          }

          if(block.errors.data_nascimento){
            this.erros.data_nascimento = block.errors.data_nascimento[0]
          }
        } catch(e) {
          console.error("Erro ao editar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado:", error);
      }
    }
  }

  async matricular(idAluno: number) {
    const url = 'http://127.0.0.1:8000/api/matricula';
    let dados = this.matriculaForm.value;
    dados.id_aluno = idAluno;

    this.isLoading = true

    this.erros = {
      id_aluno:'',
      id_turma: ''
    }

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

      await this.listarAlunos();
      this.isLoading = true;
      this.closeModal();

    } catch (error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          console.error(block);
        } catch(e) {
          console.error("Erro ao editar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado");
      }

      this.isLoading = false
    }
  }

  async pesquisar(){
    let dados = this.searchForm.value;
    let url = 'http://127.0.0.1:8000/api/aluno?page=' + this.currentPage;

    if(dados.nome !== 'undefined' && dados.nome !== ''){
      url += "&nome=" + dados.nome;
    }

    if(dados.usuario != 'undefined' && dados.nome !== ''){
      url += "&usuario=" + dados.usuario;
    }

    if(dados.status != 'undefined' && dados.status !== ''){
      url += "&status=" + dados.status;
    }

    this.isLoading = true

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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

      console.log(data)
      this.alunos = data.data
      this.totalPages = data.last_page;
      this.currentPage = data.current_page;
      this.perPage = data.per_page;
      this.isLoading = false
      this.closeModal();

    } catch (error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          console.error(block)
        } catch(e) {
          console.error("Erro ao editar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado");
      }

      this.isLoading = false
    }
  }

  openModalEditarAluno(aluno: any) {
    this.idAlunoSelecionado = aluno.id

    this.editarForm.patchValue(aluno);
    this.openModal('editAluno');
  }

  openModalMatricula(aluno: any) {
    this.openModal('matricularAluno')

    this.listarTurmas()
  }

  openModal(modal: any){

    if (this.modalCadastro && modal == "cadastroAluno") {
      this.modal = new bootstrap.Modal(this.modalCadastro.nativeElement);
    }
    else if (this.modalEditar && modal == "editAluno") {
      this.modal = new bootstrap.Modal(this.modalEditar.nativeElement);
    }
    else if (this.modalMatricular && modal == "matricularAluno") {
      this.modal = new bootstrap.Modal(this.modalMatricular.nativeElement);
    }

    if(this.modal){
      this.modal.show();
    }
  }

  closeModal(){
    this.erros = {
      nome: '',
      descricao: '',
      tipo: ''
    }

    if(this.modal){
      this.modal.hide();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.isLoading = true;
      this.currentPage++;
      this.listarAlunos();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.isLoading = true;
      this.currentPage--;
      this.listarAlunos();
    }
  }

  setPage(page: number) {
    this.isLoading = true;
    this.currentPage = page;
    this.listarAlunos();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
