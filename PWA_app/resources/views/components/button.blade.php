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
