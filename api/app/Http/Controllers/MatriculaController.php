<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMatriculaRequest;
use App\Http\Requests\UpdateMatriculaRequest;
use App\Models\Matricula;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class MatriculaController extends Controller
{

    public function showAll(Matricula $matricula){
        $results = DB::table('matriculas')
            ->select('matriculas.id', 'alunos.nome as aluno_nome', 'turmas.nome as turma_nome', 'matriculas.created_at')
            ->join('alunos', 'matriculas.id_aluno', '=', 'alunos.id')
            ->join('turmas', 'matriculas.id_turma', '=', 'turmas.id')
            ->paginate(5);

        return $results;
    }

    public function countMatriculas(Matricula $matricula)
    {
        return $matricula->count();
    }

    public function store(StoreMatriculaRequest $request, Matricula $matricula)
    {
        $request->validated();
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

    public function deleteByTurmaAluno(FormRequest $request, Matricula $matricula)
    {
        $matriculaSelecionada = $matricula->where('id_turma', $request->get('id_turma'))->where('id_aluno', $request->get('id_aluno'))->first();
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

    public function destroy(FormRequest $request, Matricula $matricula, int $id)
    {
        $matriculaSelecionada = $matricula->find($id);
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
