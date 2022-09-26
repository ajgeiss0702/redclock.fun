<style>
    :global(.default) .weather-container {
        width: 65vw;
        min-height: 45vh;
        padding-top: 1em;
        padding-bottom: 1em;
        position: fixed;
        top: 53vh;
        left: 1vw;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
    }
    .weather-container {
        background-color: rgba(242, 242, 242, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    :global(.dark) .weather-container {
        background-color: rgba(52, 52, 52, 0.5);
        box-shadow: 0 0 33px -15px rgba(0,0,0,0.75);
    }

    @media(orientation: portrait) {
        .weather-container {
            position: static !important;
            width: auto !important;
            margin-bottom: 1em;
        }
    }
</style>
<div class="weather-container">
    Weather is cool (but actually hot because its arizona)
</div>