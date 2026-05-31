<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SupportChatTest extends TestCase
{
    public function test_support_chat_returns_reply()
    {
        config()->set('services.huggingface.token', 'test-token');
        config()->set('services.huggingface.model', 'test-model');

        Http::fake([
            'https://api-inference.huggingface.co/models/test-model' => Http::response([
                [
                    'generated_text' => 'Halo, ada yang bisa dibantu?',
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/support/chat', [
            'message' => 'Halo',
        ]);

        $response->assertOk();
        $response->assertJson([
            'reply' => 'Halo, ada yang bisa dibantu?',
        ]);
    }
}

