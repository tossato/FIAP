<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlunoRequest;
use App\Http\Requests\UpdateAlunoRequest;
use App\Models\Aluno;
use Illuminate\Support\Facades\DB;

class AlunoController extends Controller
{

    public function showAll(Aluno $aluno)
    {
        $where = "1 = 1 ";
        $params = [];

        $paginate = request()->query('page');
        $searchByNome = request()->query('nome');
        $searchByUsuario = request()->query('usuario');
        $searchByStatus = request()->query('status');

        if($searchByNome){
            $where .= "AND LOWER(nome) LIKE ? ";
            $params[] = strtolower("%".$searchByNome."%");
        }

        if($searchByUsuario){
            $where .= "AND usuario LIKE ? ";
            $params[] = "%".$searchByUsuario."%";
        }

        if($searchByStatus){
            $where .= "AND status = ? ";
            $params[] = $searchByStatus;
        }

        if($paginate){
            return $aluno->orderBy('nome', 'asc')->whereRaw($where, $params)->paginate(5);
        }
        
        return $aluno->orderBy('nome', 'asc')->whereRaw($where, $params)->get();
    }

    public function countAlunos(Aluno $aluno)
    {
        return Aluno::count();
    }

    public function store(StoreAlunoRequest $request, Aluno $aluno)
    {
        $ultimoAluno = $aluno->latest()->first();
        $usuarioAluno = $ultimoAluno ? $ultimoAluno->usuario + 1 : 100000;

        $aluno->usuario = $usuarioAluno;
        $aluno->nome = $request->get("nome");
        $aluno->data_nascimento = $request->get("data_nascimento");
        $aluno->status = 'ativo';

        $response = $aluno->save();

        if($response){
            return response()->json([
                'message' => "Aluno/a cadastrado/a com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao cadastrar o/a aluno/a!"
        ], 400);
    }

    public function findById(Aluno $aluno, int $id)
    {
        $aluno = DB::selectOne("SELECT * FROM alunos WHERE id = ?", [$id]);


        if(!$aluno){
            return response()->json(['message' => 'Aluno não encontrada'], 404);
        }

        $totalTurmas = DB::selectOne('
            SELECT COUNT(*) as total FROM matriculas 
            INNER JOIN turmas ON matriculas.id_turma = turmas.id 
            WHERE matriculas.id_aluno = ?',
            [$id]
        );

        $perPage = request()->query('per_page', 5);
        $page = request()->query('page', 1);
        $offset = ($page - 1) * $perPage;

        $turmas = DB::select('
            SELECT turmas.* FROM matriculas 
            INNER JOIN turmas ON matriculas.id_turma = turmas.id 
            WHERE matriculas.id_aluno = ? 
            ORDER BY turmas.nome ASC 
            LIMIT ? OFFSET ?',
            [$id, $perPage, $offset]
        );

        $response = [
            'nome' => $aluno->nome,
            'usuario' => $aluno->usuario,
            'data_nascimento' => $aluno->data_nascimento,
            'status' => $aluno->status,
            'turmas' => $turmas,
            'current_page' => $page,
            'last_page' => ceil($totalTurmas->total / $perPage),
            'per_page' => $perPage
        ];

        return response()->json($response, 200);
    }

    public function update(UpdateAlunoRequest $request, Aluno $aluno, int $id)
    {
        $request->validated();
        $alunoSelecionado = $aluno->find($id);

        $alunoSelecionado->fill($request->all());
        $response = $alunoSelecionado->save();

        if($response){
            return response()->json([
                'message' => "Aluno/a alterado/a com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao alterar o/a aluno/a!"
        ], 400);
    }

    public function activate(Aluno $aluno, int $id)
    {
        $alunoSelecionado = $aluno->find($id);
        $alunoSelecionado->status = 'ativo';

        $response = $alunoSelecionado->save();

        if($response){
            return response()->json([
                'message' => "Aluno/a alterado/a com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao alterar o/a aluno/a!"
        ], 400);
    }

    public function inactivate(Aluno $aluno, int $id)
    {
        $alunoSelecionado = $aluno->find($id);
        $alunoSelecionado->status = 'inativo';

        $response = $alunoSelecionado->save();

        if($response){
            return response()->json([
                'message' => "Aluno/a alterado/a com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao alterar o/a aluno/a!"
        ], 400);
    }

    public function destroy(Aluno $aluno, int $id)
    {
        $alunoSelecionado = $aluno->find($id);

        $response = $alunoSelecionado->delete();

        if($response){
            return response()->json([
                'message' => "Aluno/a excluído/a com sucesso!"
            ], 201);
        }

        return response()->json([
            'message' => "Erro ao excluir o/a aluno/a!"
        ], 400);
    }
}
