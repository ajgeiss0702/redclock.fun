<script>
    import {enhance} from "$app/forms";

    export let form;
</script>
<h1>Editor Sign-in</h1>
<br>
<div class="mx-auto card signin-box p-4">
    <h3>Please enter your two-factor token</h3>
    <br>
    <form method="POST" use:enhance>
        <label class="label">
            <input class="input px-3" name="token" type="text" placeholder="Two-factor token"/>
        </label>
        <br>


        {#if form?.missing}
            <span class="text-primary-500-400-token">
                Please fill in all fields
            </span>
        {/if}
        {#if form?.incorrect}
            <span class="text-primary-500-400-token">
                Invalid two-factor token. Please try again
            </span>
        {/if}
        {#if form?.message}
            <span class="text-primary-500-400-token">
                {form.message}
            </span>
        {/if}
        {#if form?.ratelimited}
            <span class="text-primary-500-400-token">
                You are trying to sign in too fast. Wait a minute and try again.
            </span>
        {/if}


        <br>
        <button class="btn variant-glass-primary">Sign In</button>
    </form>
</div>

<style>
    .signin-box {
        max-width: min(500px, calc(100vw - 1em));
    }
</style>