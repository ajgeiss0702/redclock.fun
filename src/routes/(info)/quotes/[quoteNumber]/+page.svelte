<script>
    import {page} from "$app/stores";
    import {quotes} from "$lib/quotes";
    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";

    let quoteNumber = $page.params.quoteNumber
    let quote = quotes[quoteNumber];
</script>
<svelte:head>
    <!-- Primary Meta Tags -->
    <title>Quote #{quoteNumber} - Red Clock</title>
    <meta name="title" content="Quote #{quoteNumber} - Red Clock">
    <meta name="description" content="{quote.quote} —{quote.author}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Quote #{quoteNumber} - Red Clock">
    <meta property="og:description" content="{quote.quote} —{quote.author}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary">
    <meta property="twitter:title" content="Quote #{quoteNumber} - Red Clock">
    <meta property="twitter:description" content="{quote.quote} —{quote.author}">

</svelte:head>
<br>
<div class="text-left mx-4">
    <a href="/quotes" class="hover-underline">
        <CaretLeftFill class="inline-block"/>
        Back to quotes
    </a>
</div>
<br>
<br>

<h1>{quote.quote}</h1>
<br>
<h2>—{quote.author}</h2>
<br>
<br>
<br>
<br>
{#if quote.request}
    This quote was requested by a user.<br>
    <a href="/quotes/request/{quote.request}" class="btn variant-glass-primary">See the request here</a>
{/if}