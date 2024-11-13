<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlunoRequest;
use App\Http\Requests\UpdateAlunoRequest;
use App\Models\Aluno;
use Illuminate\Support\Facades\Request;

class AlunoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function showAll(Aluno $aluno)
    {
        return $aluno->all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAlunoRequest $request, Aluno $aluno)
    {
        $aluno->usuario = $request->get("usuario");
        $aluno->nome = $request->get("nome");
        $aluno->sobrenome = $request->get("sobrenome");
        $aluno->data_nascimento = $request->get("data_nascimento");
        $aluno->status = $request->get("status");

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

    /**
     * Display the specified resource.
     */
    public function findById(Aluno $aluno, int $id)
    {
        return $aluno->find($id);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAlunoRequest $request, Aluno $aluno, int $id)
    {
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

    /**
     * Remove the specified resource from storage.
     */
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
