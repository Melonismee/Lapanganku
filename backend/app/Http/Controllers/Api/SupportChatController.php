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

        // We explicitly tell Gemini its persona in the prompt.
        $prompt = "Anda adalah asisten support untuk Lapanganku, platform pemesanan lapangan olahraga. Jawab selalu dalam bahasa Indonesia yang ramah, singkat, dan jelas (1-3 kalimat, kecuali pengguna meminta jawaban detail). Jangan mengarang fakta. Jika data spesifik lapangan tidak tersedia, arahkan pengguna untuk melihat detail lapangan di aplikasi.\n\nFakta terbaru aplikasi Lapanganku (gunakan saat relevan):\n- Kategori lapangan: futsal, mini soccer, padel, dan bulu tangkis.\n- Pengguna dapat filter kategori di dashboard.\n- Setiap lapangan punya lokasi, harga per jam, rating, dan halaman detail.\n- Booking: pilih lapangan -> pilih tanggal -> pilih jam -> buat booking -> bayar QRIS -> upload bukti pembayaran -> admin validasi.\n- Biaya admin booking adalah 4% dari total pembayaran dan ditampilkan pada ringkasan pembayaran.\n- Pembatalan booking bisa dilakukan di menu Bookings selama status masih memungkinkan.\n- Membership premium seharga Rp 29.900 untuk 30 hari.\n- Membership memberi akses jam ramai seperti 18:00, 19:00, dan 20:00 serta booking sampai 3 hari ke depan.\n- Pembayaran membership tidak auto aktif: user membayar QRIS, upload bukti, lalu admin konfirmasi. Setelah valid, status Premium Member aktif.\n- User bisa cancel membership lewat halaman Membership. Admin juga bisa membatalkan membership dari panel admin.\n- Untuk owner lapangan, Lapanganku menerima pendaftaran lapangan dan pengajuan promosi.\n- Harga promosi lapangan adalah Rp 39.900 per hari.\n- Kontak WhatsApp admin perusahaan: 895-3407-19657. Tombol WhatsApp di halaman Support sudah menyediakan template chat untuk tambah lapangan dan ajukan promosi.\n- Halaman About menjelaskan profil bisnis Lapanganku.\n- Jika ditanya promo/featured/recommendation: itu adalah lapangan yang dipromosikan atau ditandai featured agar tampil di dashboard user.\n\nTugas Anda: bantu pengguna memahami cara mencari lapangan, melihat harga, booking, pembayaran, upload bukti, pembatalan, membership, promosi lapangan, dan kontak admin.\n\nPertanyaan pengguna: {$data['message']}";

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
            return 'Harga lapangan tergantung lapangan dan jam. Biaya admin booking adalah 4%, membership Rp 29.900 per 30 hari, dan promosi lapangan Rp 39.900 per hari.';
        }

        if (str_contains($text, 'membership')) {
            return 'Membership seharga Rp 29.900 untuk 30 hari. Setelah bayar QRIS dan upload bukti, admin akan validasi sebelum status Premium Member aktif.';
        }

        if (str_contains($text, 'booking') || str_contains($text, 'pesan')) {
            return 'Untuk booking, pilih lapangan lalu pilih tanggal dan jam yang tersedia.';
        }

        if (str_contains($text, 'refund') || str_contains($text, 'batal') || str_contains($text, 'cancel')) {
            return 'Cancel booking bisa dilakukan di menu Bookings selama status masih memungkinkan. Cancel membership bisa dilakukan dari halaman Membership.';
        }

        if (str_contains($text, 'promosi') || str_contains($text, 'promote') || str_contains($text, 'owner')) {
            return 'Promosi lapangan tersedia mulai Rp 39.900 per hari. Buka halaman Support dan klik Ajukan Promosi untuk lanjut ke WhatsApp dengan template chat.';
        }

        return 'Maaf, sistem chat sedang offline. Silakan coba lagi sebentar atau hubungi admin.';
    }
}
