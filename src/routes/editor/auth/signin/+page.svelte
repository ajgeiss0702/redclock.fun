<script lang="ts">
    import type { ActionData } from './$types';
    import { enhance } from '$app/forms';
    import {page} from "$app/stores";
    export let form: ActionData;
</script>
<h1>Editor Sign-in</h1>
<br>
{#if $page.url.searchParams.has("reauth")}
    <span class="text-primary-500-400-token">
        Please sign in again
    </span>
    <br>
    <br>
{/if}
<div class="mx-auto card signin-box p-4">
    <form method="POST" use:enhance>
        <label class="label">
            <span>Username</span>
            <input class="input px-3" name="username" type="text" value={form?.username ?? ''}/>
        </label>
        <br>
        <label class="label">
            <span>Password</span>
            <input class="input px-3" name="password" type="password"/>
        </label>
        <br>


        {#if form?.missing}
            <span class="text-primary-500-400-token">
                Please fill in all fields
            </span>
        {/if}
        {#if form?.incorrect}
            <span class="text-primary-500-400-token">
                Incorrect username or password
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