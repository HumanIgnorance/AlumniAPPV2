<?php
// app/Http/Requests/UpdateQuizOrderRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuizOrderRequest extends FormRequest
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
            'questions' => 'required|array|min:1',
            'questions.*' => 'exists:questions,id',
        ];
    }
}