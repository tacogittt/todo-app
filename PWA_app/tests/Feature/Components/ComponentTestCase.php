<?php

namespace Tests\Feature\Components;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class ComponentTestCase extends TestCase
{
    use RefreshDatabase;

    /**
     * Render a Blade component and return the HTML
     */
    protected function renderComponent(string $component, array $attributes = [], string $slot = ''): string
    {
        $attributeString = collect($attributes)
            ->map(fn($value, $key) => is_bool($value)
                ? ($value ? $key : '')
                : sprintf('%s="%s"', $key, htmlspecialchars($value))
            )
            ->filter()
            ->implode(' ');

        $bladeTemplate = "<x-{$component} {$attributeString}>{$slot}</x-{$component}>";

        return \Illuminate\Support\Facades\Blade::render($bladeTemplate, $attributes);
    }

    /**
     * Assert that HTML contains a specific class
     */
    protected function assertHasClass(string $html, string $class): void
    {
        $this->assertStringContainsString("class=\"{$class}\"", $html);
    }

    /**
     * Assert that HTML contains Material Design color
     */
    protected function assertHasMaterialColor(string $html, string $colorName): void
    {
        $this->assertStringContainsString($colorName, $html);
    }
}
