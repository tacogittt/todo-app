<?php

namespace Tests\Feature\Components;

class ButtonComponentTest extends ComponentTestCase
{
    /** @test */
    public function it_renders_filled_button_with_primary_color()
    {
        $html = $this->renderComponent('button', [
            'variant' => 'filled',
            'color' => 'primary'
        ], 'Click me');

        // Material Design filled button classes
        $this->assertStringContainsString('bg-primary', $html);
        $this->assertStringContainsString('text-on-primary', $html);
        $this->assertStringContainsString('rounded-full', $html);
        $this->assertStringContainsString('min-h-touch', $html); // 44px minimum
        $this->assertStringContainsString('min-w-touch', $html);
    }

    /** @test */
    public function it_renders_outlined_button()
    {
        $html = $this->renderComponent('button', [
            'variant' => 'outlined',
            'color' => 'primary'
        ], 'Click me');

        $this->assertStringContainsString('border', $html);
        $this->assertStringContainsString('border-outline', $html);
        $this->assertStringContainsString('text-primary', $html);
    }

    /** @test */
    public function it_renders_text_button()
    {
        $html = $this->renderComponent('button', [
            'variant' => 'text',
            'color' => 'primary'
        ], 'Click me');

        $this->assertStringContainsString('text-primary', $html);
        // Text buttons don't have default background, but have hover state
        $this->assertStringNotContainsString('bg-primary text-on-primary', $html);
        $this->assertStringContainsString('hover:bg-', $html);
    }

    /** @test */
    public function it_renders_disabled_state()
    {
        $html = $this->renderComponent('button', [
            'variant' => 'filled',
            'color' => 'primary',
            'disabled' => true
        ], 'Click me');

        $this->assertStringContainsString('opacity-', $html);
        $this->assertStringContainsString('cursor-not-allowed', $html);
    }
}
