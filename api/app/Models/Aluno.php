<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aluno extends Model
{
    /** @use HasFactory<\Database\Factories\AlunoFactory> */
    use HasFactory;

    protected $table = 'alunos';
    protected $fillable = [
        'usuario',
        'nome',
        'sobrenome',
        'data_nascimento'
    ];

    public function turmas()
    {
        return $this->belongsToMany(Turma::class, 'matriculas', 'id_aluno', 'id_turmas');
    }
}
