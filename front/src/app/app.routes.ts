import {provideRouter, Routes} from '@angular/router';

import { LoginComponent } from './login/login.component';
import { InicioComponent } from "./inicio/inicio.component";
import { ListaTurmasComponent } from "./listaTurmas/listaTurmas.component";
import { MatriculasComponent } from "./matriculas/matriculas.component";
import { ListaAlunosComponent } from "./listaAlunos/listaAlunos.component";
import { AlunoComponent } from "./aluno/aluno.component";
import {TurmaComponent} from "./turma/turma.component";
import {AuthGuard} from "./auth.guard";


export const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'lista-alunos',
    component: ListaAlunosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lista-alunos/aluno/:id',
    component: AlunoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lista-turmas',
    component: ListaTurmasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lista-turmas/turma/:id',
    component: TurmaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'matriculas',
    component: MatriculasComponent,
    canActivate: [AuthGuard]
  }
];
