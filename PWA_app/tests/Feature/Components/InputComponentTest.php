<?php

namespace Tests\Feature\Components;

class InputComponentTest extends ComponentTestCase
{
    /** @test */
    public function it_renders_text_input_with_label()
    {
        $html = $this->renderComponent('input', [
            'label' => 'Email',
            'name' => 'email',
            'type' => 'text'
        ]);

        $this->assertStringContainsString('Email', $html);
        $this->assertStringContainsString('name="email"', $html);
        $this->assertStringContainsString('type="text"', $html);
    }

    /** @test */
    public function it_renders_error_state()
    {
        $html = $this->renderComponent('input', [
            'label' => 'Email',
            'name' => 'email',
            'error' => 'Invalid email address'
        ]);

        $this->assertStringContainsString('text-error', $html);
        $this->assertStringContainsString('Invalid email address', $html);
    }

    /** @test */
    public function it_renders_helper_text()
    {
        $html = $this->renderComponent('input', [
            'label' => 'Email',
            'name' => 'email',
            'helper' => 'We will never share your email'
        ]);

        $this->assertStringContainsString('We will never share your email', $html);
        $this->assertStringContainsString('text-on-surface-variant', $html);
    }
}
