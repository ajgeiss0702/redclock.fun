<script lang="ts">
    import {PersonCircle} from "svelte-bootstrap-icons";
    import {enhance} from "$app/forms";

    export let data;
    export let form;
</script>
<br>
<div class="limit mx-auto text-left">
    <h1 class="mb-2">
        <PersonCircle class="mb-2 mr-2" style="display: inline-block; width: 0.75em; height: 0.75em;"/>
        {data.user.name}
    </h1>
    <br>


    <h2>Personal Preferences</h2>
    <form method="POST" use:enhance={() => {
            return async ({ update }) => {
                await update({ reset: false });
            };
          }}>
        <div class="inline-block mx-auto">
            <table class="table table-hover">
                <tbody>
                    <tr>
                        <td>Username</td>
                        <td>
                            <input class="input px-2" value={data.user.username} disabled title="Your username cannot be changed">
                        </td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>
                            <input name="name" class="input px-2 mb-2" value={data.user.name}>
                            Your name is displayed in the editor and where you are credited
                        </td>
                    </tr>
                    <tr>
                        <td>Want credit?</td>
                        <td>
                            <select name="want-credit" class="select mb-2">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                            This option controls whether your name is shown by the schedule(s) that you added.
                            <br>
                            If you select no, then no credit will be given.
                        </td>
                    </tr>
                    <tr>
                        <td class="!pr-0">
                            {#if form?.blank}
                                <span class="red">
                                    Please do not leave any field blank!
                                </span>
                            {/if}
                            <button class="btn variant-ghost-success mx-auto inline-block">Save</button>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </form>
</div>

<style>
    td:nth-child(1) {
        @apply text-right;
    }

    td {
        padding-left: 2em;
        word-wrap: break-word;
        white-space: normal !important;
    }

    .red {
        color: red;
    }
</style>