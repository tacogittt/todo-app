# Material Design PWA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a habit tracking PWA with Material Design 3 UI components using Laravel 12, Tailwind CSS, and zero additional cost.

**Architecture:** Laravel 12 backend with SQLite database, Tailwind CSS with Material Design tokens, Blade components for reusable UI, laravelpwa package for PWA functionality.

**Tech Stack:** PHP 8.3, Laravel 12, SQLite, Tailwind CSS, Material Design 3, laravelpwa

---

## Phase 1: Environment Setup

### Task 1: Laravel Project Initialization

**Files:**
- Create: `composer.json` (via Laravel installer)
- Create: `.env`
- Create: `database/database.sqlite`

**Step 1: Check PHP and Composer versions**

Run:
```bash
php --version
composer --version
```

Expected: PHP 8.3+, Composer 2.x

**Step 2: Create Laravel project**

Run:
```bash
composer create-project laravel/laravel:^12.0 .
```

Expected: Laravel 12 project created in current directory

**Step 3: Configure SQLite database**

Run:
```bash
touch database/database.sqlite
```

Modify `.env`:
```env
DB_CONNECTION=sqlite
DB_DATABASE=C:\Users\USER\Desktop\AI_coding\Lectures\claudecode\PWA_app\database\database.sqlite
```

**Step 4: Test database connection**

Run:
```bash
php artisan migrate
```

Expected: Default Laravel migrations run successfully

**Step 5: Commit**

```bash
git add .
git commit -m "feat: initialize Laravel 12 project with SQLite"
```

---

### Task 2: Tailwind CSS Installation

**Files:**
- Create: `tailwind.config.js`
- Modify: `resources/css/app.css`
- Modify: `package.json`

**Step 1: Install Tailwind CSS and dependencies**

Run:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Expected: `tailwind.config.js` and `postcss.config.js` created

**Step 2: Configure Tailwind with Material Design tokens**

Replace `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 Color System
        primary: '#6750A4',
        'on-primary': '#FFFFFF',
        'primary-container': '#EADDFF',
        'on-primary-container': '#21005D',

        secondary: '#625B71',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#E8DEF8',
        'on-secondary-container': '#1D192B',

        tertiary: '#7D5260',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#FFD8E4',
        'on-tertiary-container': '#31111D',

        error: '#B3261E',
        'on-error': '#FFFFFF',
        'error-container': '#F9DEDC',
        'on-error-container': '#410E0B',

        background: '#FEF7FF',
        'on-background': '#1D1B20',

        surface: '#FEF7FF',
        'on-surface': '#1D1B20',
        'surface-variant': '#E7E0EC',
        'on-surface-variant': '#49454F',

        outline: '#79747E',
        'outline-variant': '#CAC4D0',

        'inverse-surface': '#322F35',
        'inverse-on-surface': '#F5EFF7',
        'inverse-primary': '#D0BCFF',
      },

      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },

      fontSize: {
        // Material Design Typography Scale
        'display-large': ['57px', { lineHeight: '64px', fontWeight: '400' }],
        'display-medium': ['45px', { lineHeight: '52px', fontWeight: '400' }],
        'display-small': ['36px', { lineHeight: '44px', fontWeight: '400' }],

        'headline-large': ['32px', { lineHeight: '40px', fontWeight: '400' }],
        'headline-medium': ['28px', { lineHeight: '36px', fontWeight: '400' }],
        'headline-small': ['24px', { lineHeight: '32px', fontWeight: '400' }],

        'title-large': ['22px', { lineHeight: '28px', fontWeight: '400' }],
        'title-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'title-small': ['14px', { lineHeight: '20px', fontWeight: '500' }],

        'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-small': ['12px', { lineHeight: '16px', fontWeight: '400' }],

        'label-large': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-medium': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-small': ['11px', { lineHeight: '16px', fontWeight: '500' }],
      },

      spacing: {
        // Material Design 4dp Grid
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },

      borderRadius: {
        'none': '0px',
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '28px',
        'full': '9999px',
      },

      minHeight: {
        'touch': '44px', // Android minimum touch target
      },

      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}
```

**Step 3: Add Tailwind directives to CSS**

Replace `resources/css/app.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
}
```

**Step 4: Add Vite build script**

Modify `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

**Step 5: Build CSS**

Run:
```bash
npm install
npm run build
```

Expected: Tailwind CSS compiled successfully

**Step 6: Commit**

```bash
git add tailwind.config.js resources/css/app.css package.json package-lock.json postcss.config.js vite.config.js
git commit -m "feat: configure Tailwind CSS with Material Design tokens"
```

---

### Task 3: PWA Package Installation

**Files:**
- Modify: `composer.json`
- Create: `config/laravelpwa.php`
- Create: `public/manifest.json`
- Create: `public/serviceworker.js`

**Step 1: Install laravelpwa package**

Run:
```bash
composer require ladumor/laravel-pwa
```

Expected: Package installed

**Step 2: Publish PWA assets**

Run:
```bash
php artisan vendor:publish --provider="Ladumor\LaravelPwa\PWAServiceProvider"
```

Expected: Config and views published

**Step 3: Configure manifest.json**

Modify `config/laravelpwa.php`:
```php
return [
    'name' => '習慣化アプリ',
    'short_name' => '習慣',
    'start_url' => '/',
    'background_color' => '#FEF7FF',
    'theme_color' => '#6750A4',
    'display' => 'standalone',
    'orientation'=> 'portrait',
    'status_bar'=> 'black',
    'icons' => [
        '72x72' => [
            'path' => '/images/icons/icon-72x72.png',
            'purpose' => 'any'
        ],
        '96x96' => [
            'path' => '/images/icons/icon-96x96.png',
            'purpose' => 'any'
        ],
        '128x128' => [
            'path' => '/images/icons/icon-128x128.png',
            'purpose' => 'any'
        ],
        '144x144' => [
            'path' => '/images/icons/icon-144x144.png',
            'purpose' => 'any'
        ],
        '152x152' => [
            'path' => '/images/icons/icon-152x152.png',
            'purpose' => 'any'
        ],
        '192x192' => [
            'path' => '/images/icons/icon-192x192.png',
            'purpose' => 'any'
        ],
        '384x384' => [
            'path' => '/images/icons/icon-384x384.png',
            'purpose' => 'any'
        ],
        '512x512' => [
            'path' => '/images/icons/icon-512x512.png',
            'purpose' => 'any'
        ],
    ],
    'splash' => [],
    'shortcuts' => [],
    'custom' => []
];
```

**Step 4: Create placeholder icons**

Run:
```bash
mkdir -p public/images/icons
# Note: Actual icon files will be created later
```

**Step 5: Test PWA configuration**

Run:
```bash
php artisan serve
```

Visit: http://localhost:8000
Check: Manifest.json accessible at http://localhost:8000/manifest.json

**Step 6: Commit**

```bash
git add config/laravelpwa.php composer.json composer.lock
git commit -m "feat: install and configure laravelpwa package"
```

---

## Phase 2: Testing Infrastructure

### Task 4: Set Up PHPUnit for Component Testing

**Files:**
- Modify: `phpunit.xml`
- Create: `tests/Feature/Components/ComponentTestCase.php`

**Step 1: Write base test case for components**

Create `tests/Feature/Components/ComponentTestCase.php`:
```php
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
    protected function renderComponent(string $component, array $attributes = []): string
    {
        $attributeString = collect($attributes)
            ->map(fn($value, $key) => is_bool($value)
                ? ($value ? $key : '')
                : sprintf('%s="%s"', $key, $value)
            )
            ->filter()
            ->implode(' ');

        return view('components.' . $component, $attributes)->render();
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
```

**Step 2: Verify base test case compiles**

Run:
```bash
php artisan test
```

Expected: Tests pass (no tests defined yet, but base case loads)

**Step 3: Commit**

```bash
git add tests/Feature/Components/ComponentTestCase.php
git commit -m "test: add base test case for Blade components"
```

---

## Phase 3: Basic Components (TDD)

### Task 5: Button Component

**Files:**
- Create: `tests/Feature/Components/ButtonComponentTest.php`
- Create: `resources/views/components/button.blade.php`

**Step 1: Write failing test for filled button**

Create `tests/Feature/Components/ButtonComponentTest.php`:
```php
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
        ]);

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
        ]);

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
        ]);

        $this->assertStringContainsString('text-primary', $html);
        $this->assertStringNotContainsString('bg-', $html);
    }

    /** @test */
    public function it_renders_disabled_state()
    {
        $html = $this->renderComponent('button', [
            'variant' => 'filled',
            'color' => 'primary',
            'disabled' => true
        ]);

        $this->assertStringContainsString('opacity-', $html);
        $this->assertStringContainsString('cursor-not-allowed', $html);
    }
}
```

**Step 2: Run test to verify it fails**

Run:
```bash
php artisan test --filter ButtonComponentTest
```

Expected: FAIL - View [components.button] not found

**Step 3: Write minimal implementation**

Create `resources/views/components/button.blade.php`:
```php
@props([
    'variant' => 'filled',
    'color' => 'primary',
    'disabled' => false,
    'type' => 'button'
])

@php
$baseClasses = 'inline-flex items-center justify-center px-6 py-3 text-label-large font-medium rounded-full transition-all duration-200 min-h-touch min-w-touch';

$variantClasses = match($variant) {
    'filled' => "bg-{$color} text-on-{$color} shadow-md hover:shadow-lg active:shadow-sm",
    'outlined' => "border-2 border-outline text-{$color} hover:bg-{$color}-container",
    'text' => "text-{$color} hover:bg-{$color}-container hover:bg-opacity-10",
    default => ''
};

$disabledClasses = $disabled ? 'opacity-38 cursor-not-allowed pointer-events-none' : '';

$classes = implode(' ', array_filter([$baseClasses, $variantClasses, $disabledClasses]));
@endphp

<button
    type="{{ $type }}"
    {{ $attributes->merge(['class' => $classes]) }}
    @if($disabled) disabled @endif
>
    {{ $slot }}
</button>
```

**Step 4: Run test to verify it passes**

Run:
```bash
php artisan test --filter ButtonComponentTest
```

Expected: PASS - All tests pass

**Step 5: Manual visual test**

Create `resources/views/test-button.blade.php`:
```blade
<!DOCTYPE html>
<html>
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-background p-8">
    <div class="space-y-4">
        <x-button variant="filled" color="primary">Filled Button</x-button>
        <x-button variant="outlined" color="primary">Outlined Button</x-button>
        <x-button variant="text" color="primary">Text Button</x-button>
        <x-button variant="filled" color="primary" disabled>Disabled Button</x-button>
    </div>
</body>
</html>
```

Add route in `routes/web.php`:
```php
Route::get('/test-button', function () {
    return view('test-button');
});
```

Run:
```bash
npm run dev
php artisan serve
```

Visit: http://localhost:8000/test-button
Verify: Buttons render with Material Design styling

**Step 6: Commit**

```bash
git add tests/Feature/Components/ButtonComponentTest.php resources/views/components/button.blade.php resources/views/test-button.blade.php routes/web.php
git commit -m "feat: add Material Design button component with tests"
```

---

### Task 6: Card Component

**Files:**
- Create: `tests/Feature/Components/CardComponentTest.php`
- Create: `resources/views/components/card.blade.php`

**Step 1: Write failing test for card variants**

Create `tests/Feature/Components/CardComponentTest.php`:
```php
<?php

namespace Tests\Feature\Components;

class CardComponentTest extends ComponentTestCase
{
    /** @test */
    public function it_renders_elevated_card()
    {
        $html = $this->renderComponent('card', [
            'variant' => 'elevated'
        ]);

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
        ]);

        $this->assertStringContainsString('bg-surface-variant', $html);
    }

    /** @test */
    public function it_renders_outlined_card()
    {
        $html = $this->renderComponent('card', [
            'variant' => 'outlined'
        ]);

        $this->assertStringContainsString('border', $html);
        $this->assertStringContainsString('border-outline-variant', $html);
    }
}
```

**Step 2: Run test to verify it fails**

Run:
```bash
php artisan test --filter CardComponentTest
```

Expected: FAIL - View [components.card] not found

**Step 3: Write minimal implementation**

Create `resources/views/components/card.blade.php`:
```php
@props([
    'variant' => 'elevated'
])

@php
$baseClasses = 'rounded-lg p-4 transition-shadow duration-200';

$variantClasses = match($variant) {
    'elevated' => 'bg-surface shadow-md hover:shadow-lg',
    'filled' => 'bg-surface-variant',
    'outlined' => 'bg-surface border border-outline-variant',
    default => ''
};

$classes = implode(' ', array_filter([$baseClasses, $variantClasses]));
@endphp

<div {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</div>
```

**Step 4: Run test to verify it passes**

Run:
```bash
php artisan test --filter CardComponentTest
```

Expected: PASS

**Step 5: Commit**

```bash
git add tests/Feature/Components/CardComponentTest.php resources/views/components/card.blade.php
git commit -m "feat: add Material Design card component with tests"
```

---

### Task 7: Input Component

**Files:**
- Create: `tests/Feature/Components/InputComponentTest.php`
- Create: `resources/views/components/input.blade.php`

**Step 1: Write failing test for input field**

Create `tests/Feature/Components/InputComponentTest.php`:
```php
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
```

**Step 2: Run test to verify it fails**

Run:
```bash
php artisan test --filter InputComponentTest
```

Expected: FAIL - View [components.input] not found

**Step 3: Write minimal implementation**

Create `resources/views/components/input.blade.php`:
```php
@props([
    'label' => '',
    'name' => '',
    'type' => 'text',
    'error' => '',
    'helper' => '',
    'required' => false
])

@php
$inputClasses = 'w-full px-4 py-3 bg-surface-variant rounded-sm text-body-large text-on-surface border-0 focus:outline-none focus:ring-2 transition-all duration-200';
$inputClasses .= $error ? ' focus:ring-error ring-2 ring-error' : ' focus:ring-primary';
@endphp

<div class="mb-4">
    @if($label)
        <label for="{{ $name }}" class="block mb-2 text-body-small font-medium text-on-surface-variant">
            {{ $label }}
            @if($required)
                <span class="text-error">*</span>
            @endif
        </label>
    @endif

    <input
        type="{{ $type }}"
        name="{{ $name }}"
        id="{{ $name }}"
        {{ $attributes->merge(['class' => $inputClasses]) }}
        @if($required) required @endif
    />

    @if($error)
        <p class="mt-2 text-body-small text-error">{{ $error }}</p>
    @elseif($helper)
        <p class="mt-2 text-body-small text-on-surface-variant">{{ $helper }}</p>
    @endif
</div>
```

**Step 4: Run test to verify it passes**

Run:
```bash
php artisan test --filter InputComponentTest
```

Expected: PASS

**Step 5: Commit**

```bash
git add tests/Feature/Components/InputComponentTest.php resources/views/components/input.blade.php
git commit -m "feat: add Material Design input component with tests"
```

---

## Phase 4: Habit-Specific Components

### Task 8: Habit Card Component

**Files:**
- Create: `tests/Feature/Components/HabitCardComponentTest.php`
- Create: `resources/views/components/habit-card.blade.php`

**Step 1: Write failing test for habit card**

Create `tests/Feature/Components/HabitCardComponentTest.php`:
```php
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

        $this->assertStringContainsString('✓', $html); // Checkmark
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
```

**Step 2: Run test to verify it fails**

Run:
```bash
php artisan test --filter HabitCardComponentTest
```

Expected: FAIL

**Step 3: Write minimal implementation**

Create `resources/views/components/habit-card.blade.php`:
```php
@props([
    'title' => '',
    'streak' => 0,
    'completed' => false,
    'description' => ''
])

@php
$cardClasses = $completed
    ? 'bg-primary-container border-2 border-primary'
    : 'bg-surface border border-outline-variant';
@endphp

<x-card variant="outlined" :class="$cardClasses">
    <div class="flex items-center justify-between">
        <div class="flex-1">
            <h3 class="text-title-medium text-on-surface mb-1">
                {{ $title }}
            </h3>

            @if($description)
                <p class="text-body-small text-on-surface-variant mb-2">
                    {{ $description }}
                </p>
            @endif

            @if($streak > 0)
                <div class="inline-flex items-center px-3 py-1 bg-tertiary-container rounded-full">
                    <span class="mr-1">🔥</span>
                    <span class="text-label-small text-on-tertiary-container font-medium">
                        {{ $streak }}日連続
                    </span>
                </div>
            @endif
        </div>

        <div class="ml-4">
            @if($completed)
                <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <svg class="w-6 h-6 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            @else
                <button type="button" class="w-12 h-12 rounded-full border-2 border-outline hover:border-primary transition-colors duration-200">
                </button>
            @endif
        </div>
    </div>
</x-card>
```

**Step 4: Run test to verify it passes**

Run:
```bash
php artisan test --filter HabitCardComponentTest
```

Expected: PASS

**Step 5: Commit**

```bash
git add tests/Feature/Components/HabitCardComponentTest.php resources/views/components/habit-card.blade.php
git commit -m "feat: add habit card component with streak tracking"
```

---

## Phase 5: Layout Components

### Task 9: App Bar Component

**Files:**
- Create: `tests/Feature/Components/AppBarComponentTest.php`
- Create: `resources/views/components/app-bar.blade.php`

**Step 1: Write failing test**

Create `tests/Feature/Components/AppBarComponentTest.php`:
```php
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
```

**Step 2: Run test to verify it fails**

Run:
```bash
php artisan test --filter AppBarComponentTest
```

Expected: FAIL

**Step 3: Write minimal implementation**

Create `resources/views/components/app-bar.blade.php`:
```php
@props([
    'title' => ''
])

<header class="bg-primary text-on-primary shadow-md">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between min-h-touch">
        <h1 class="text-title-large font-medium">{{ $title }}</h1>

        <div class="flex items-center gap-2">
            {{ $slot }}
        </div>
    </div>
</header>
```

**Step 4: Run test to verify it passes**

Run:
```bash
php artisan test --filter AppBarComponentTest
```

Expected: PASS

**Step 5: Commit**

```bash
git add tests/Feature/Components/AppBarComponentTest.php resources/views/components/app-bar.blade.php
git commit -m "feat: add app bar component"
```

---

## Phase 6: Main Application Pages

### Task 10: Home Page with Habit List

**Files:**
- Create: `resources/views/home.blade.php`
- Create: `app/Http/Controllers/HabitController.php`
- Modify: `routes/web.php`

**Step 1: Create route**

Modify `routes/web.php`:
```php
use App\Http\Controllers\HabitController;

Route::get('/', [HabitController::class, 'index'])->name('home');
```

**Step 2: Create controller**

Create `app/Http/Controllers/HabitController.php`:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HabitController extends Controller
{
    public function index()
    {
        // TODO: Fetch from database later
        $habits = [
            [
                'title' => '毎朝のランニング',
                'description' => '30分のジョギング',
                'streak' => 7,
                'completed' => false
            ],
            [
                'title' => '読書',
                'description' => '10ページ読む',
                'streak' => 3,
                'completed' => true
            ],
            [
                'title' => '瞑想',
                'description' => '5分間の瞑想',
                'streak' => 30,
                'completed' => false
            ]
        ];

        return view('home', compact('habits'));
    }
}
```

**Step 3: Create home view**

Create `resources/views/home.blade.php`:
```blade
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#6750A4">
    <title>習慣トラッカー</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @laravelPWA
</head>
<body class="bg-background min-h-screen">
    <x-app-bar title="習慣トラッカー" />

    <main class="container mx-auto px-4 py-6">
        <div class="mb-6">
            <h2 class="text-headline-medium text-on-background mb-2">
                今日の習慣
            </h2>
            <p class="text-body-medium text-on-surface-variant">
                継続は力なり 💪
            </p>
        </div>

        <div class="space-y-4">
            @foreach($habits as $habit)
                <x-habit-card
                    :title="$habit['title']"
                    :description="$habit['description']"
                    :streak="$habit['streak']"
                    :completed="$habit['completed']"
                />
            @endforeach
        </div>
    </main>

    <!-- FAB for adding new habits -->
    <button
        class="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center"
        aria-label="習慣を追加"
    >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
    </button>
</body>
</html>
```

**Step 4: Test in browser**

Run:
```bash
npm run dev
php artisan serve
```

Visit: http://localhost:8000

Verify:
- App bar displays
- Habit cards show with streak badges
- Material Design colors applied
- FAB button in bottom right
- Responsive on mobile view (Chrome DevTools)

**Step 5: Commit**

```bash
git add resources/views/home.blade.php app/Http/Controllers/HabitController.php routes/web.php
git commit -m "feat: add home page with habit list display"
```

---

## Phase 7: PWA Testing

### Task 11: Test PWA Installation on Android

**Prerequisites:**
- Android device with Chrome v131+
- USB cable
- ADB enabled on Android

**Step 1: Enable USB debugging on Android**

On Android device:
1. Settings → About Phone → Tap "Build number" 7 times
2. Settings → Developer Options → Enable "USB debugging"

**Step 2: Connect device and start port forwarding**

Run on PC:
```bash
# Start Laravel server
php artisan serve

# In another terminal, forward port (if using ADB)
adb reverse tcp:8000 tcp:8000
```

**Step 3: Test on Android Chrome**

On Android device:
1. Open Chrome
2. Navigate to: http://localhost:8000
3. Chrome should show "Install app" prompt
4. Install to home screen
5. Open from home screen (should be standalone, no address bar)

**Verification checklist:**
- [ ] App installs to home screen
- [ ] Icon displays correctly
- [ ] Opens in standalone mode (no address bar)
- [ ] Theme color matches (#6750A4)
- [ ] All components render correctly
- [ ] Touch targets are at least 44px
- [ ] Scrolling is smooth

**Step 4: Document results**

Create `docs/testing/pwa-android-test-results.md`:
```markdown
# PWA Android Test Results

**Test Date:** 2026-01-31
**Device:** [Your Android device]
**Chrome Version:** [Version number]

## Installation
- [ ] Install prompt appeared
- [ ] App added to home screen successfully
- [ ] Icon displays correctly

## Standalone Mode
- [ ] No address bar visible
- [ ] Full screen experience
- [ ] Theme color applied

## UI Components
- [ ] App bar renders correctly
- [ ] Habit cards display properly
- [ ] FAB button accessible
- [ ] Touch targets adequate (44px+)

## Performance
- [ ] Initial load time: [X] seconds
- [ ] Smooth scrolling
- [ ] No visual glitches

## Notes
[Any observations or issues]
```

**Step 5: Commit test results**

```bash
git add docs/testing/pwa-android-test-results.md
git commit -m "docs: add PWA Android test results"
```

---

## Phase 8: Cleanup and Documentation

### Task 12: Remove Test Routes and Update README

**Files:**
- Modify: `routes/web.php`
- Delete: `resources/views/test-button.blade.php`
- Create: `README.md`

**Step 1: Remove test routes**

Modify `routes/web.php`:
```php
<?php

use App\Http\Controllers\HabitController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HabitController::class, 'index'])->name('home');
```

**Step 2: Delete test files**

Run:
```bash
rm resources/views/test-button.blade.php
```

**Step 3: Create comprehensive README**

Create `README.md`:
```markdown
# 習慣化支援PWAアプリ

Material Design 3を採用した習慣トラッキングPWAアプリ（Android対応）

## 技術スタック

- **バックエンド**: Laravel 12 + PHP 8.3
- **データベース**: SQLite
- **フロントエンド**: Tailwind CSS + Material Design 3
- **PWA**: laravelpwa
- **テスト**: PHPUnit

## セットアップ

### 必要要件

- PHP 8.3+
- Composer 2.x
- Node.js 18+
- NPM

### インストール

```bash
# 依存関係のインストール
composer install
npm install

# 環境設定
cp .env.example .env
php artisan key:generate

# データベース準備
touch database/database.sqlite
php artisan migrate

# アセットビルド
npm run build
```

### 開発サーバー起動

```bash
# フロントエンドのビルド（開発モード）
npm run dev

# Laravelサーバー起動
php artisan serve
```

http://localhost:8000 でアクセス

## Android実機テスト

### USB接続でのテスト

1. Android端末でUSBデバッグを有効化
2. PCと接続
3. ADBでポートフォワーディング:

```bash
adb reverse tcp:8000 tcp:8000
```

4. Android ChromeでアクセスしてPWAインストール

### PWA機能確認

- ✅ ホーム画面への追加
- ✅ スタンドアロン表示
- ✅ オフライン対応（Service Worker）
- ✅ Material Designテーマカラー

## コンポーネント

### 基礎コンポーネント

- `<x-button>` - Material Design ボタン（filled/outlined/text）
- `<x-card>` - カード（elevated/filled/outlined）
- `<x-input>` - テキストフィールド

### アプリ固有コンポーネント

- `<x-habit-card>` - 習慣トラッキングカード
- `<x-app-bar>` - アプリバー

## テスト

```bash
# 全テスト実行
php artisan test

# コンポーネントテストのみ
php artisan test --filter Components
```

## プロジェクト構成

```
PWA_app/
├── app/
│   └── Http/Controllers/
│       └── HabitController.php
├── resources/
│   ├── css/
│   │   └── app.css
│   └── views/
│       ├── components/
│       │   ├── app-bar.blade.php
│       │   ├── button.blade.php
│       │   ├── card.blade.php
│       │   ├── habit-card.blade.php
│       │   └── input.blade.php
│       └── home.blade.php
├── tests/
│   └── Feature/
│       └── Components/
├── docs/
│   ├── plans/
│   └── testing/
└── tailwind.config.js
```

## ライセンス

MIT

## 参考資料

- [Material Design 3](https://m3.material.io/)
- [Laravel Documentation](https://laravel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
```

**Step 4: Commit**

```bash
git add README.md routes/web.php
git commit -m "docs: add comprehensive README and cleanup test routes"
```

---

## Completion Checklist

### Environment Setup
- [ ] Laravel 12 project initialized with SQLite
- [ ] Tailwind CSS configured with Material Design tokens
- [ ] laravelpwa package installed and configured
- [ ] PHPUnit testing infrastructure ready

### Components (TDD)
- [ ] Button component (filled/outlined/text variants)
- [ ] Card component (elevated/filled/outlined variants)
- [ ] Input component (with label/error/helper text)
- [ ] Habit card component (with streak tracking)
- [ ] App bar component

### Pages
- [ ] Home page with habit list
- [ ] Material Design styling applied
- [ ] Responsive design verified

### PWA
- [ ] PWA manifest configured
- [ ] Service Worker active
- [ ] Android device testing completed
- [ ] Standalone mode verified

### Documentation
- [ ] Implementation plans saved
- [ ] README created
- [ ] Test results documented
- [ ] Code committed with meaningful messages

---

## Next Steps (Future Enhancements)

1. Database integration (Habit model, migrations)
2. CRUD operations for habits
3. Web Push notifications
4. App Badge API integration
5. Calendar view for habit history
6. Statistics and progress tracking
