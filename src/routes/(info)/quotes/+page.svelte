<script>
    import Quote from "$lib/countdown/sidebar/Quote.svelte";
    import {quotes} from "$lib/quotes";
    import {dev} from "$app/environment";
</script>

<svelte:head>
    <title>Quotes - Red Clock</title>
</svelte:head>

<h1>Quotes</h1>
Here, you can see all of the quotes that Red Clock has. You can also suggest new ones
<br>
<br>
<br>
<h2>Random quote</h2>
This is the same thing that's on the countdown page
<div class="random mx-auto">
    <Quote/>
</div>

<br>
<br>
<a class="btn variant-glass-primary" href={dev ? "/quotes/request" : "https://ul.redclock.fun/quotes/request"}>
    Request Quote
</a>
<br>
<br>
<br>
<h2>Full quote list</h2>

<br>
Total quotes: {quotes.length}
<br><br>
<div class="quotes mx-auto p-2">
    <hr>
    {#each quotes as quote, i}
        <div>
            <a class="inline-block quote unstyled" href="/quotes/{i}">
                {quote.quote}<br>
                <span class="author">{quote.author}</span>
            </a>
        </div>
        <hr>
    {/each}
</div>


<style>
    div.random {
        max-width: 10in;
        height: max(calc(40vh - 40vw), 7em);
    }
    h1,h2 {
        margin-bottom: 0.25em;
        margin-top: 0.25em;
    }
    div.quotes {
        max-width: 10in;
        margin-bottom: 5em;
    }
    .author {
        display: inline-block;
        padding-left: 1em;
        margin-left: auto;
        text-align: right;
    }
    .author::before {
        content: "—";
    }
</style>