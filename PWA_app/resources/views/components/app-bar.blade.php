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
