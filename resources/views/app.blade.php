@php

    $atmsTheme = request()->cookie('atms-theme', 'white');
    $atmsTheme = in_array($atmsTheme, ['black', 'white']) ? $atmsTheme : 'white';
    $atmsHasThemeCookie = in_array(request()->cookie('atms-theme'), ['black', 'white'], true);
    $atmsThemeColor = $atmsTheme === 'black' ? '#0a0c12' : '#ffffff';
    $atmsBootBg = $atmsTheme === 'black' ? '#0a0c12' : '#f4f7fb';
    $atmsStatusBarStyle = $atmsTheme === 'black' ? 'black' : 'default';
    // cache-buster so browsers re-fetch the tab icon when site-logo.png changes
    $faviconV = @filemtime(public_path('images/site-logo.png')) ?: 1;
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="{{ $atmsTheme === 'black' ? 'black' : '' }}"@unless($atmsHasThemeCookie) data-theme-source="system"@endunless style="background:{{ $atmsBootBg }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
    <!-- Google Site Verification -->
    <meta name="google-site-verification" content="EoE6LVDV2xrA2R1kWgPDzyDYU4Dl98Sz5dktxhT68I0">

    <!-- CSRF -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Primary Seo -->

    <title>{{ $seoTitle }}</title>

    <meta name="title" content="{{ $seoTitle }}">

    <meta name="description" content="{{ $seoDescription }}">

    <meta name="keywords" content="{{ $keywords }}">

    <meta name="author" content="{{ $author }}">

    <meta name="application-name" content="{{ $appName }} - {{ $siteName }}">

    <!-- Search Engine -->

    <meta name="robots" content="index, follow, max-image-preview:large">

    <meta name="googlebot" content="index, follow">

    <link rel="canonical" href="{{ $seoCanonical }}">

    <!-- Favicon -->

    <link rel="icon" href="{{ asset('favicon.ico') }}?v={{ $faviconV }}" sizes="any">

    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon-32.png') }}?v={{ $faviconV }}">

    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/favicon-16.png') }}?v={{ $faviconV }}">

    <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('images/icon-192.png') }}?v={{ $faviconV }}">

    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}?v={{ $faviconV }}">

    {{-- iOS home-screen icon: the white 180x180 tile with the padded shield (same as SCLF).
         A transparent logo here is what made the icon look cropped / on black. --}}
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/apple-touch-icon.png') }}?v={{ $faviconV }}">

    <!-- Open Graph -->

    <meta property="og:type" content="website">

    <meta property="og:site_name" content="{{ $siteName }}">

    <meta property="og:locale" content="{{ $locale }}">

    <meta property="og:title" content="{{ $seoTitle }}">

    <meta property="og:description" content="{{ $seoDescription }}">

    <meta property="og:url" content="{{ $seoCanonical }}">

    <meta property="og:image" content="{{ $logo }}">

    <meta property="og:image:alt" content="{{ $siteName }} {{ $appName }} Logo">

    <meta property="og:image:width" content="512">

    <meta property="og:image:height" content="512">

    <!-- Twitter -->

    <meta name="twitter:card" content="summary_large_image">

    <meta name="twitter:title" content="{{ $seoTitle }}">

    <meta name="twitter:description" content="{{ $seoDescription }}">

    <meta name="twitter:image" content="{{ $logo }}">

    <meta name="twitter:image:alt" content="{{ $siteName }} {{ $appName }} Logo">

    <!-- Mobile / Pwa -->

    <meta name="theme-color" content="{{ $atmsThemeColor }}">

    <meta name="apple-mobile-web-app-capable" content="yes">

    <meta name="apple-mobile-web-app-title" content="{{ $appName }}">

    <meta name="apple-mobile-web-app-status-bar-style" content="{{ $atmsStatusBarStyle }}">

    <meta name="mobile-web-app-capable" content="yes">

    <meta name="msapplication-TileColor" content="#01215f">

    <meta name="msapplication-TileImage" content="{{ asset('images/icon-192.png') }}">

    <meta name="format-detection" content="telephone=no">

    {{-- use-credentials: the manifest varies with the "atms-theme" cookie, and browsers
         fetch manifests WITHOUT cookies unless this is set. --}}
    <link rel="manifest" href="{{ route('pwa.manifest') }}" crossorigin="use-credentials">

    <!-- Structured Data -->

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollegeOrUniversity",
                "name": "{{ $siteName }}",
                "url": "{{ url('/') }}",
                "logo": "{{ $logo }}",
                "image": "{{ $logo }}",
                "description": "{{ $seoDescription }}",
                "department": {
                    "@type": "Organization",
                    "name": "Alumni Tracing Management System ({{ $appName }})"
                }
            },
            {
                "@type": "Organization",
                "name": "{{ $siteName }}",
                "url": "{{ url('/') }}",
                "logo": {
                    "@type": "ImageObject",
                    "url": "{{ $logo }}"
                }
            },
            {
                "@type": "WebSite",
                "name": "{{ $siteName }}",
                "alternateName": "{{ $appName }}",
                "url": "{{ url('/') }}",
                "publisher": {
                    "@type": "CollegeOrUniversity",
                    "name": "{{ $siteName }}"
                },
                "inLanguage": "en-PH"
            }
        ]
    }
    </script>

    @stack('schema')
    <!-- Css -->

    {{-- CSS is injected by Vite (imported from resources/js/app.js) --}}

    <!-- Pre-JS paint: matches the saved theme so there is no white flash -->
    <style>
        html,body{margin:0;background:{{ $atmsBootBg }}}
        @if (! $atmsHasThemeCookie)
        @media (prefers-color-scheme:dark){html[data-theme-source="system"],html[data-theme-source="system"] body{background:#0a0c12}}
        @endif
    </style>

    <!-- Fonts -->

    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

</head>

<body>

    <div id="app"><div class="app-boot" role="status" aria-label="Loading"><span class="app-boot__spinner"></span></div></div>

    <!-- React (Vite) -->

    @vite('resources/js/app.js')

</body>

</html>
