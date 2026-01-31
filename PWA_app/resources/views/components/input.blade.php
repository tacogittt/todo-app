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
