<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTurmaRequest;
use App\Http\Requests\UpdateTurmaRequest;
use App\Models\Turma;

class TurmaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function showAll(Turma  $turma)
    {
        return $turma->all();
    }

    /**
     * Store a newly created resource in storage.
     */
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

    /**
     * Display the specified resource.
     */
    public function findById(Turma $turma, int $id)
    {
        return $turma->find($id);
    }

    /**
     * Update the specified resource in storage.
     */
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
