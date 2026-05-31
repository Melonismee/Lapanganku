<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupportChatController extends Controller
{
    public function chat(Request $request)
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $mode = env('SUPPORT_CHAT_MODE', 'auto');

        if ($mode === 'mock') {
            return response()->json([
                'reply' => $this->fallbackReply($data['message']),
            ]);
        }

        // Using Gemini API instead of HuggingFace
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            Log::error('Gemini API key not configured.');
            return response()->json([
                'message' => 'AI API key not configured.',
            ], 500);
        }

        // We explicitly tell Gemini its persona in the prompt
        $prompt = "Anda adalah asisten support untuk Lapanganku, platform pemesanan lapangan olahraga. Jawab selalu dalam bahasa Indonesia yang ramah, singkat, dan jelas (1-3 kalimat, terkecuali jika pengguna dengan jelas meminta untuk memberi jawaban lebih lengkap, panjang, atau detail). Jangan mengarang fakta. Jika data spesifik tidak tersedia, arahkan pengguna untuk melihat detail lapangan di aplikasi.\n\nFakta aplikasi Lapanganku (gunakan saat relevan):\n- Kategori lapangan: futsal, mini soccer, padel, bulu tangkis.\n- Pengguna dapat filter kategori di dashboard.\n- Setiap lapangan punya lokasi, harga per jam, rating, dan halaman detail.\n- Booking: pilih lapangan -> pilih tanggal -> pilih jam -> lanjut pembayaran.\n- Pembayaran ditangani di aplikasi setelah booking dibuat.\n- Pembatalan booking bisa dilakukan di menu Pesanan.\n- Membership memberi akses jam ramai dan booking lebih awal (lihat menu Membership untuk detail).\n- Jika ditanya promo/featured: tampilkan lapangan yang ditandai featured pada dashboard.\n\nTugas Anda: bantu pengguna memahami cara mencari lapangan, melihat harga, booking, pembayaran, pembatalan/refund, dan membership.\n\nPertanyaan pengguna: {$data['message']}";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->withoutVerifying()
            ->timeout(15)
            ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.4, // Keep it focused for support
                    'maxOutputTokens' => 200,
                ]
            ]);

        } catch (\Exception $exception) {
            Log::error('Gemini API Network Error: ' . $exception->getMessage());
            return response()->json([
                'reply' => $this->fallbackReply($data['message']),
            ]);
        }

        if (!$response->successful()) {
            Log::error('Gemini API Rejection: ' . $response->status() . ' - ' . $response->body());
            return response()->json([
                'message' => 'AI service unavailable.',
            ], 502);
        }

        $payload = $response->json();
        $reply = $payload['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (!$reply) {
            Log::error('Gemini Missing Reply in Payload: ' . json_encode($payload));
            return response()->json([
                'message' => 'AI response unavailable.',
            ], 502);
        }

        return response()->json([
            'reply' => trim($reply),
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
