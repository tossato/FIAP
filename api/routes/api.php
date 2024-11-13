<?php

use App\Http\Controllers\AlunoController;
use App\Http\Controllers\MatriculaController;
use App\Http\Controllers\TurmaController;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    Route::get('/aluno', [AlunoController::class, 'showAll']);
    Route::get('/aluno/{id}', [AlunoController::class, 'findById']);
    Route::post('/aluno', [AlunoController::class, 'store']);
    Route::put('/aluno/{id}', [AlunoController::class, 'update']);
    Route::patch('/aluno/{id}/inactivate', [AlunoController::class, 'inactivate']);
    Route::patch('/aluno/{id}/activate', [AlunoController::class, 'activate']);
    Route::delete('/aluno/{id}', [AlunoController::class, 'destroy']);
});

Route::group([], function () {
    Route::get('/turma', [TurmaController::class, 'showAll']);
    Route::get('/turma/{id}', [TurmaController::class, 'findById']);
    Route::post('/turma', [TurmaController::class, 'store']);
    Route::put('/turma/{id}', [TurmaController::class, 'update']);
    Route::delete('/turma/{id}', [TurmaController::class, 'destroy']);
});

Route::group([], function () {
    Route::get('/matricula/aluno/{id_aluno}', [MatriculaController::class, 'findByIdAluno']);
    Route::get('/matricula/turma/{id_turma}', [MatriculaController::class, 'findByIdTurma']);
    Route::post('/matricula', [MatriculaController::class, 'store']);
    Route::put('/matricula', [MatriculaController::class, 'update']);
    Route::delete('/matricula', [MatriculaController::class, 'destroy']);
});

