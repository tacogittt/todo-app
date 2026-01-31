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
