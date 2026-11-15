<?php


namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
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
        $rules = [
            'type' => 'required|in:rate,abcd',
            'question' => 'required|string|max:1000',
            'description' => 'nullable|string|max:2000',
            'required' => 'required|in:true,false,1,0'
        ];

        // Additional rules for ABCD type
        // if ($this->type === 'abcd') {
        //     $rules['choices'] = 'required|array|min:2|max:4';
        //     $rules['choices.*.interpretation'] = 'required|string|max:500';
        //     $rules['choices.*.image'] = 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048';
        // }

        return $rules;
    }

    public function messages()
    {
        return [
            'choices.required' => 'At least 2 choices are required for multiple choice questions.',
            'choices.*.interpretation.required' => 'Each choice must have an interpretation text.',
        ];
    }
}