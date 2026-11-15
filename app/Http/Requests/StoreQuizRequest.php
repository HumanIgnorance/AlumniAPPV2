<?php
// app/Http/Requests/StoreQuizRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuizRequest extends FormRequest
{
    public function authorize()
    {
        // Admin-only. Route middleware already enforces this; kept here as
        // defense in depth so the request class is safe if reused elsewhere.
        $user = $this->user();
        return $user && $user->role === 'admin';
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            //'questions' => 'required|array|min:1',
            'questions.*' => 'exists:questions,id',
        ];
    }
}