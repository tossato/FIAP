<?php

use App\Http\Controllers\AlunoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MatriculaController;
use App\Http\Controllers\TurmaController;
use Illuminate\Support\Facades\Route;

Route::group([], function(){
    Route::post('user', [AuthController::class, 'registrar']);
    Route::post('user/login', [AuthController::class, 'login']);
    Route::middleware('jwt.auth')->post('user/logout', [AuthController::class, 'logout']);
    Route::middleware('jwt.auth')->get('user', [AuthController::class, 'getUsuarioAutenticado']);
});

Route::middleware('jwt.auth')->group(function () {
    Route::get('/aluno', [AlunoController::class, 'showAll']);
    Route::get('/aluno/count', [AlunoController::class, 'countAlunos'])->name('aluno.count');
    Route::get('/aluno/{id}', [AlunoController::class, 'findById']);
    Route::post('/aluno', [AlunoController::class, 'store']);
    Route::put('/aluno/{id}', [AlunoController::class, 'update']);
    Route::patch('/aluno/{id}/inactivate', [AlunoController::class, 'inactivate']);
    Route::patch('/aluno/{id}/activate', [AlunoController::class, 'activate']);
    Route::delete('/aluno/{id}', [AlunoController::class, 'destroy']);
})->middleware('jwt.auth');

Route::middleware('jwt.auth')->group(function () {
    Route::get('/turma', [TurmaController::class, 'showAll']);
    Route::get('/turma/count', [TurmaController::class, 'countTurmas'])->name('turma.count');
    Route::get('/turma/{id}', [TurmaController::class, 'findById']);
    Route::post('/turma', [TurmaController::class, 'store']);
    Route::put('/turma/{id}', [TurmaController::class, 'update']);
    Route::delete('/turma/{id}', [TurmaController::class, 'destroy']);
});

Route::middleware('jwt.auth')->group(function () {
    Route::get('/matricula', [MatriculaController::class, 'showAll']);
    Route::get('/matricula/count', [MatriculaController::class, 'countMatriculas']);
    Route::post('/matricula', [MatriculaController::class, 'store']);
    Route::delete('/matricula', [MatriculaController::class, 'deleteByTurmaAluno']);
    Route::delete('/matricula/{id}', [MatriculaController::class, 'destroy']);
});

