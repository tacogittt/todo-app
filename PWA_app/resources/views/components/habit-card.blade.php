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
