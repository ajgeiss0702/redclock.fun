<script>
    export let length = 1;

    export let circle = false;

    if(circle) length = 1;

    let add = "-";
    while(length > add.length) {
        add += "-";
    }

</script>
<style>
    @keyframes placeHolderShimmer {
        0% {
            background-position: -800px 0
        }
        100% {
            background-position: 800px 0
        }
    }

    .animated-background {
        animation-duration: 2s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: placeHolderShimmer;
        animation-timing-function: linear;
        background: rgba(0, 0, 0, 0.08) linear-gradient(to right, #eeeeee00 8%, #ffffff5f 18%, #eeeeee00 33%);
        background-size: 800px 104px;
        color: rgba(0, 0, 0, 0);
        position: relative;
        border-radius: 4px;
    }

    .circle {
        border-radius: 50%;
        display: inline-block;
        width: 100%;
        height: 100%;
    }
</style>
<span class="animated-background" class:circle={circle}>{add}</span>