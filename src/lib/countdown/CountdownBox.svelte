<style>
    :global(.default) .countdown-container {
        width: 65vw;
        min-height: 50vh;
        position: fixed;
        top: 1vh;
        left: 1vw;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 1em;
        padding-right: 1em;
        border-radius: 8px;
    }
    .countdown-text, .countdown-period {
        display: inline-block;
        vertical-align: middle;
        line-height: 0.8em;
    }
    .countdown-text {
        font-size: 10em;
    }
    .countdown-period {
        font-size: 4em;
    }

    .countdown-container {
        background-color: rgba(242, 242, 242, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    :global(.dark) .countdown-container {
        background-color: rgba(52, 52, 52, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }
</style>
<div class="countdown-container">
    <div class="countdown-inner">
        <div class="countdown-text">a</div>
        <br>
        <div class="countdown-period">until b</div>
    </div>
</div>