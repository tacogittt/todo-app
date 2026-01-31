<?php

namespace Tests\Feature\Components;

class CardComponentTest extends ComponentTestCase
{
    /** @test */
    public function it_renders_elevated_card()
    {
        $html = $this->renderComponent('card', [
            'variant' => 'elevated'
        ], 'Card content');

        $this->assertStringContainsString('bg-surface', $html);
        $this->assertStringContainsString('shadow', $html);
        $this->assertStringContainsString('rounded-lg', $html);
        $this->assertStringContainsString('p-4', $html); // 16px padding
    }

    /** @test */
    public function it_renders_filled_card()
    {
        $html = $this->renderComponent('card', [
            'variant' => 'filled'
        ], 'Card content');

        $this->assertStringContainsString('bg-surface-variant', $html);
    }

    /** @test */
    public function it_renders_outlined_card()
    {
        $html = $this->renderComponent('card', [
            'variant' => 'outlined'
        ], 'Card content');

        $this->assertStringContainsString('border', $html);
        $this->assertStringContainsString('border-outline-variant', $html);
    }
}
