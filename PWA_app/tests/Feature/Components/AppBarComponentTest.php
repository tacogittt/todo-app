<?php

namespace Tests\Feature\Components;

class AppBarComponentTest extends ComponentTestCase
{
    /** @test */
    public function it_renders_app_bar_with_title()
    {
        $html = $this->renderComponent('app-bar', [
            'title' => '習慣トラッカー'
        ]);

        $this->assertStringContainsString('習慣トラッカー', $html);
        $this->assertStringContainsString('bg-primary', $html);
        $this->assertStringContainsString('text-on-primary', $html);
    }
}
