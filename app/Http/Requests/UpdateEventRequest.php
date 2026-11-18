<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation for editing an event (admin only). EventController::update used
 * to read the raw request with no validation at all, including uploaded
 * images, which were stored without any type or size check.
 *
 * Unlike creation, the date may be in the past (editing a finished event).
 */
class UpdateEventRequest extends FormRequest
{
    public function authorize()
    {
        $user = $this->user();
        return $user && $user->role === 'admin';
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:20000',
            'event_type' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'date' => 'required|date',
            'start_time' => 'nullable|string|max:8',
            'end_time' => 'nullable|string|max:8',
            'timeRange' => 'nullable|array|size:2',
            'timeRange.*' => 'nullable|string|max:8',
            'location' => 'required|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'organizer' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:30',
            'contact_email' => 'nullable|email|max:255',
            'tags' => 'nullable|array|max:50',
            'tags.*' => 'string|max:50',
            'agenda' => 'nullable|string|max:20000',
            'featured' => 'nullable',
            'existing_images' => 'nullable|array|max:20',
            'existing_images.*' => 'string|max:500',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ];
    }
}
