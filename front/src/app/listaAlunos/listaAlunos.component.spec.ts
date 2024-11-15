import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAlunosComponent } from './listaAlunos.component';

describe('AlunosComponent', () => {
  let component: ListaAlunosComponent;
  let fixture: ComponentFixture<ListaAlunosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAlunosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAlunosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
