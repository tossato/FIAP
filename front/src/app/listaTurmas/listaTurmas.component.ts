import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import { CommonModule } from '@angular/common';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router, RouterLink} from "@angular/router";
import * as bootstrap from "bootstrap";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-turmas',
  standalone: true,
  imports: [
    MenuComponent,
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './listaTurmas.component.html',
  styleUrl: './listaTurmas.component.css'
})

export class ListaTurmasComponent implements OnInit{

  @ViewChild('cadastroTurma') modalCadastro: any;
  @ViewChild('editTurma') modalEditar: any;

  cadastroForm!: FormGroup;
  editarForm!: FormGroup;
  searchForm!: FormGroup;

  idTurmaSelecionada = 0

  modal:any = null;
  isLoading = true
  turmas: any = []

  totalPages: number = 1;
  currentPage: number = 1;
  perPage: number = 1;

  erros: any = {
    nome: '',
    descricao: '',
    tipo: ''
  }

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      tipo: ['', Validators.required],
    })

    this.editarForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      tipo: ['', Validators.required],
    })

    this.searchForm = this.formBuilder.group({
      nome: [''],
      descricao: [''],
      tipo: [''],
    })

    this.listarTurmas()
  }

  async listarTurmas() {
    const url = `http://127.0.0.1:8000/api/turma?page=${this.currentPage}`;
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
      this.turmas = data.data
      this.totalPages = data.last_page;
      this.currentPage = data.current_page;
      this.perPage = data.per_page;
      this.isLoading = false

    } catch (error: unknown) {
      if(error instanceof Error){
        try{
          const block = JSON.parse(error.message);
          console.error(block)
        } catch(e) {
          console.error("Erro:", e);
        }
      } else {
        console.error("Erro inesperado");
      }
    }
  }

  async cadastrarTurma(){
    const url = 'http://127.0.0.1:8000/api/turma';
    const dados = this.cadastroForm.value;

    this.isLoading = true;

    this.erros = {
      nome: '',
      descricao: '',
      tipo: ''
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

    try{
      const response = await fetch(url, options)

      if(!response.ok && response.status !== 401) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }

      if(!response.ok && response.status === 401){
        this.router.navigate(['/login']);
      }

      await this.listarTurmas();
      this.closeModal();
      this.isLoading = false

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          if (block.errors.nome) {
            this.erros.nome = block.errors.nome[0];
          }
          if (block.errors.descricao) {
            this.erros.descricao = block.errors.descricao[0];
          }
          if (block.errors.tipo) {
            this.erros.tipo = block.errors.tipo[0];
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

  async editarTurma(idTurma: number) {
    const url = 'http://127.0.0.1:8000/api/turma/' + idTurma;
    const dados = this.editarForm.value;

    this.isLoading = true;

    this.erros = {
      nome: '',
      descricao: '',
      tipo: ''
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

    try{
      const response = await fetch(url, options)

      if(!response.ok && response.status !== 401) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }

      if(!response.ok && response.status === 401){
        this.router.navigate(['/login']);
      }

      await this.listarTurmas();
      this.isLoading = false;
      this.closeModal();

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          if (block.errors.nome) {
            this.erros.nome = block.errors.nome[0];
          }
          if (block.errors.descricao) {
            this.erros.descricao = block.errors.descricao[0];
          }
          if (block.errors.tipo) {
            this.erros.tipo = block.errors.tipo[0];
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

  async deletarTurma(idTurma: number) {
    const url = 'http://127.0.0.1:8000/api/turma/' + idTurma;
    this.isLoading = true;

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      }
    }

    try{
      const response = await fetch(url, options)

      if(!response.ok && response.status !== 401) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }

      if(!response.ok && response.status === 401){
        this.router.navigate(['/login']);
      }

      await this.listarTurmas();
      this.isLoading = false;

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          console.error("Erro ao deletar a resposta do erro:", block);
        } catch (e) {
          console.error("Erro ao analisar a resposta do erro:", e);
        }
      } else {
        console.error("Erro inesperado:", error);
      }

      this.isLoading = false;
    }
  }

  async pesquisar(){
    let dados = this.searchForm.value;
    let url = 'http://127.0.0.1:8000/api/turma?page=' + this.currentPage;

    if(dados.nome !== 'undefined' && dados.nome !== ''){
      url += "&nome=" + dados.nome;
    }

    if(dados.descricao != 'undefined' && dados.descricao !== ''){
      url += "&descricao=" + dados.descricao;
    }

    if(dados.tipo != 'undefined' && dados.tipo !== ''){
      url += "&tipo=" + dados.tipo;
    }

    console.log(url)
    this.isLoading = true

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      }
    }

    try{
      const response = await fetch(url, options)

      if(!response.ok && response.status !== 401) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }

      if(!response.ok && response.status === 401){
        this.router.navigate(['/login']);
      }

      const data = await response.json();
      this.turmas = data.data;
      this.isLoading = false;
      this.closeModal();

    } catch(error: unknown) {
      if (error instanceof Error) {
        try {
          const block = JSON.parse(error.message);
          console.error("Erro ao deletar a resposta do erro:", block);
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
      this.listarTurmas();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.isLoading = true;
      this.currentPage--;
      this.listarTurmas();
    }
  }

  setPage(page: number) {
    this.isLoading = true;
    this.currentPage = page;
    this.listarTurmas();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openModalEditarTurma(turma: any){
    this.idTurmaSelecionada = turma.id
    this.editarForm.patchValue(turma);
    this.openModal('editTurma')
  }

  openModal(modal: any){

    if (this.modalCadastro && modal == "cadastroTurma") {
      this.modal = new bootstrap.Modal(this.modalCadastro.nativeElement);
    }
    else if (this.modalEditar && modal == "editTurma") {
      this.modal = new bootstrap.Modal(this.modalEditar.nativeElement);
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
}
