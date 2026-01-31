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
