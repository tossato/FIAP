<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTurmaRequest;
use App\Http\Requests\UpdateTurmaRequest;
use App\Models\Turma;
use Illuminate\Support\Facades\DB;

class TurmaController extends Controller
{

    public function showAll(Turma  $turma)
    {
        $where = "1 = 1 ";
        $params = [];

        $paginate = request()->query('page');
        $searchByNome = request()->query('nome');
        $searchByDescricao = request()->query('descricao');
        $searchByTipo = request()->query('tipo');

        if($searchByNome){
            $where .= "AND LOWER(nome) LIKE ? ";
            $params[] = strtolower("%".$searchByNome."%");
        }

        if($searchByDescricao){
            $where .= "AND LOWER(descricao) LIKE ? ";
            $params[] = "%".$searchByDescricao."%";
        }

        if($searchByTipo){
            $where .= "AND LOWER(tipo) LIKE ? ";
            $params[] = "%".$searchByTipo."%";
        }

        if($paginate){
            return $turma->orderBy('nome', 'asc')->whereRaw($where, $params)->paginate(5);
        }

        return $turma->orderBy('nome', 'asc')->whereRaw($where, $params)->get();
    }

    public function countTurmas(Turma $turma)
    {
        return $turma->count();
    }

    public function store(StoreTurmaRequest $request, Turma $turma)
    {
        $turma->nome = $request->get('nome');
        $turma->descricao = $request->get('descricao');
        $turma->tipo = $request->get('tipo');

        $response = $turma->save();

        if($response){
            return response()->json([
                'message' => "Turma cadastrada com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao cadastrar a turma!"
        ], 400);
    }

    public function findById(Turma $turma, int $id)
    {

        $turma = DB::selectOne("SELECT * FROM turmas WHERE id = ?", [$id]);

        if(!$turma){
            return response()->json(['message' => 'Turma não encontrada'], 404);
        }

        $totalAlunos = DB::selectOne('
            SELECT COUNT(*) as total FROM matriculas
            INNER JOIN alunos ON matriculas.id_aluno = alunos.id
            WHERE matriculas.id_turma = ?',
            [$id]
        );

        $perPage = request()->query('per_page', 5);
        $page = request()->query('page', 1);
        $offset = ($page - 1) * $perPage;

        $alunos = DB::select('
            SELECT alunos.* FROM matriculas
            INNER JOIN alunos ON matriculas.id_aluno = alunos.id
            WHERE matriculas.id_turma = ?
            ORDER BY alunos.nome ASC
            LIMIT ? OFFSET ?',
            [$id, $perPage, $offset]
        );

        $response = [
            'nome' => $turma->nome,
            'descricao' => $turma->descricao,
            'tipo' => $turma->tipo,
            'alunos_matriculados' => $alunos,
            'current_page' => $page,
            'last_page' => ceil($totalAlunos->total / $perPage),
            'per_page' => $perPage
        ];

        return response()->json($response, 200);
    }

    public function update(UpdateTurmaRequest $request, Turma $turma, int $id)
    {

        $turmaSelecionada = $turma->find($id);
        $turmaSelecionada->fill($request->all());

        $response = $turmaSelecionada->save();

        if($response){
            return response()->json([
                'message' => "Turma alterada com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao alterar a turma!"
        ], 400);
    }

    public function destroy(Turma $turma, int $id)
    {
        $turmaSelecionada = $turma->find($id);
        $response = $turmaSelecionada->delete();

        if($response){
            return response()->json([
                'message' => "Turma excluída com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao excluir a turma!"
        ], 400);
    }
}
