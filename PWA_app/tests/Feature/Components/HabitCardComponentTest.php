<?php

namespace Tests\Feature\Components;

class HabitCardComponentTest extends ComponentTestCase
{
    /** @test */
    public function it_renders_habit_card_with_title()
    {
        $html = $this->renderComponent('habit-card', [
            'title' => '毎朝のランニング',
            'streak' => 7,
            'completed' => false
        ]);

        $this->assertStringContainsString('毎朝のランニング', $html);
        $this->assertStringContainsString('7日連続', $html);
    }

    /** @test */
    public function it_shows_completed_state()
    {
        $html = $this->renderComponent('habit-card', [
            'title' => '読書',
            'streak' => 3,
            'completed' => true
        ]);

        // Check for SVG checkmark path instead of Unicode character
        $this->assertStringContainsString('M5 13l4 4L19 7', $html);
        $this->assertStringContainsString('bg-primary-container', $html);
    }

    /** @test */
    public function it_shows_streak_badge()
    {
        $html = $this->renderComponent('habit-card', [
            'title' => '瞑想',
            'streak' => 30,
            'completed' => false
        ]);

        $this->assertStringContainsString('30日連続', $html);
        $this->assertStringContainsString('🔥', $html); // Fire emoji for streak
    }
}
