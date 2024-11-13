<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Turma extends Model
{
    /** @use HasFactory<\Database\Factories\TurmaFactory> */
    use HasFactory;

    protected $table = 'turmas';
    protected $fillable = [
        'nome',
        'descricao',
        'tipo'
    ];

    public function alunos()
    {
        return $this->belongsToMany(Aluno::class, 'matriculas', 'id_turma', 'id_aluno');
    }
}
