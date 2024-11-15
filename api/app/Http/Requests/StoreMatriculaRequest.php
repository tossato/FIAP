<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMatriculaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_aluno' => 'required|exists:alunos,id',
            'id_turma' => 'required|exists:turmas,id',
            'id_aluno' => 'unique:matriculas,id_aluno,NULL,id,id_turma,' . $this->id_turma,
        ];
    }

    public function messages()
    {
        return [
            'id_aluno.required' => 'O campo aluno é obrigatório.',
            'id_aluno.exists' => 'O aluno informado não está cadastrado.',
            'id_aluno.unique' => 'Essa combinação de aluno e turma já está cadastrada.',
            'id_turma.required' => 'O campo turma é obrigatório.',
            'id_turma.exists' => 'A campo turma é obrigatório.',
        ];
    }
}
