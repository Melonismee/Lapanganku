<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\ConnectionException;

class SupportChatController extends Controller
{
    public function chat(Request $request)
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $apiKey = config('services.huggingface.token');
        $model = config('services.huggingface.model');

        if (!$apiKey) {
            return response()->json([
                'message' => 'Hugging Face API key not configured.',
            ], 500);
        }

        $prompt = "You are a helpful support assistant for Lapanganku.\nUser: {$data['message']}\nAssistant:";

        try {
            $response = Http::withToken($apiKey)
                ->timeout(20)
                ->post("https://api-inference.huggingface.co/models/{$model}", [
                    'inputs' => $prompt,
                    'parameters' => [
                        'max_new_tokens' => 200,
                        'temperature' => 0.6,
                        'return_full_text' => false,
                    ],
                    'options' => [
                        'wait_for_model' => true,
                    ],
                ]);
        } catch (ConnectionException $exception) {
            return response()->json([
                'reply' => $this->fallbackReply($data['message']),
            ]);
        }

        if (!$response->successful()) {
            $error = $response->json('error') ?? 'AI service unavailable.';

            return response()->json([
                'message' => $error,
            ], 502);
        }

        $payload = $response->json();
        $reply = null;

        if (is_array($payload)) {
            if (isset($payload['error'])) {
                return response()->json([
                    'message' => $payload['error'],
                ], 502);
            }

            $reply = $payload[0]['generated_text'] ?? $payload['generated_text'] ?? null;
        }

        if (!$reply) {
            return response()->json([
                'message' => 'AI response unavailable.',
            ], 502);
        }

        $cleanedReply = trim(str_replace($prompt, '', $reply));

        return response()->json([
            'reply' => $cleanedReply !== '' ? $cleanedReply : trim($reply),
        ]);
    }

    private function fallbackReply(string $message): string
    {
        $text = strtolower($message);

        if (str_contains($text, 'harga') || str_contains($text, 'biaya')) {
            return 'Harga tergantung lapangan dan jam. Coba pilih lapangan di dashboard untuk lihat harga per jam.';
        }

        if (str_contains($text, 'membership')) {
            return 'Membership memberi akses jam ramai dan booking lebih awal. Buka menu Membership untuk detail.';
        }

        if (str_contains($text, 'booking') || str_contains($text, 'pesan')) {
            return 'Untuk booking, pilih lapangan lalu pilih tanggal dan jam yang tersedia.';
        }

        if (str_contains($text, 'refund') || str_contains($text, 'batal') || str_contains($text, 'cancel')) {
            return 'Pembatalan booking bisa dilakukan di menu Pesanan. Status refund mengikuti kebijakan lapangan.';
        }

        return 'Maaf, sistem chat sedang offline. Silakan coba lagi sebentar atau hubungi admin.';
    }
}
