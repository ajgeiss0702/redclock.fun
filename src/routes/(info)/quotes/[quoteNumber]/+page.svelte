<script>
    import {page} from "$app/stores";
    import {quotes} from "$lib/quotes";
    import CaretLeftFill from "svelte-bootstrap-icons/lib/CaretLeftFill.svelte";

    let quote = quotes[$page.params.quoteNumber];
</script>
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