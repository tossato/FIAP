<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMatriculaRequest;
use App\Http\Requests\UpdateMatriculaRequest;
use App\Models\Matricula;
use App\Models\Turma;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Http\FormRequest;

class MatriculaController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMatriculaRequest $request, Matricula $matricula)
    {
        $matricula->id_aluno = $request->get('id_aluno');
        $matricula->id_turma = $request->get('id_turma');

        $response = $matricula->save();

        if($response){
            return response()->json([
                'message' => "Matrícula cadastrada com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao cadastrar a matrícula!"
        ], 400);
    }

    /**
     * Display the specified resource.
     */
    public function findByIdAluno(int $id_aluno)
    {
        return DB::select('
            SELECT
                alunos.usuario,
                alunos.nome,
                alunos.sobrenome,
                alunos.data_nascimento,
                alunos.status,
                turmas.nome AS curso,
                turmas.descricao,
                turmas.tipo
            FROM matriculas
            INNER JOIN alunos
                ON matriculas.id_aluno = alunos.id
            INNER JOIN turmas
                ON matriculas.id_turma = turmas.id
            WHERE matriculas.id_aluno = ?;',
            [$id_aluno]
        );
    }

    /**
     * Display the specified resource.
     */
    public function findByIdTurma(Turma $turma, int $id_turma)
    {
        $turmaSelecionada = $turma->find($id_turma);
        $alunos = $turmaSelecionada->alunos()->where('status', 'ativo')->get();

        return $alunos;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMatriculaRequest $request, Matricula $matricula)
    {
        $matriculaSelecionada = $matricula->where('id_aluno', $request->get('id_aluno'))->where('id_turma', $request->get('id_turma'))->first();
        $matriculaSelecionada->id_turma = $request->get('nova_turma');

        $response = $matriculaSelecionada->save();

        if($response){
            return response()->json([
                'message' => "Matrícula alterada com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao alterar a matrícula!"
        ], 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FormRequest $request, Matricula $matricula)
    {
        $matriculaSelecionada = $matricula->where('id_aluno', $request->get('id_aluno'))->where('id_turma', $request->get('id_turma'))->first();
        $response = $matriculaSelecionada->delete();

        if($response){
            return response()->json([
                'message' => "Matrícula excluída com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao excluir a matrícula!"
        ], 400);
    }
}
