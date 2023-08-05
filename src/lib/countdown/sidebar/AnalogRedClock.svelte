<script>
    import {onMount} from "svelte";
    import {currentTime} from "$lib/countdown/CountdownBox.svelte";

    let canvas;
    let radius;

    onMount(() => {
        let ctx = canvas.getContext("2d");
        radius = canvas.height / 2;
        ctx.translate(radius, radius);
        radius *= 0.90;

        drawClock()
    });

    $: drawClock($currentTime);

    function drawClock() {
        if(typeof canvas === "undefined") return;
        let ctx = canvas.getContext("2d");
        ctx.moveTo(radius, radius);
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius);
    }

    function drawFace(ctx, radius) {
        ctx.clearRect(-canvas.width, -canvas.height, canvas.width*2, canvas.height*2);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2*Math.PI);
        ctx.strokeStyle = "#F00";
        ctx.lineWidth = radius*0.1;
        ctx.stroke();
    }

    function drawNumbers(ctx, radius) {
        var ang;
        var num;
        ctx.font = radius*0.15 + "px arial";
        ctx.textBaseline="middle";
        ctx.textAlign="center";
        for(num = 1; num < 13; num++){
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius*0.85);
            ctx.rotate(-ang);

            ctx.beginPath();
            ctx.lineWidth = radius*0.12;

            ctx.lineCap = "round";
            ctx.moveTo(0,0);
            ctx.rotate(ang);
            ctx.lineTo(0, -radius*0.1);

            ctx.stroke();
            ctx.rotate(-ang);
            //ctx.fillText(num.toString(), 0, 0);

            ctx.rotate(ang);
            ctx.translate(0, radius*0.85);
            ctx.rotate(-ang);
        }
    }

    function drawTime(ctx, radius){
        let now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        //hour
        hour=hour%12;
        hour=(hour*Math.PI/6)+
            (minute*Math.PI/(6*60))+
            (second*Math.PI/(360*60));
        drawHand(ctx, hour, radius*0.5, radius*0.09);
        //minute
        minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
        drawHand(ctx, minute, radius*0.73, radius*0.09);
        // second
        second=(second*Math.PI/30);
        drawHand(ctx, second, radius*0.75, radius*0.02);
    }

    function drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

</script>
<canvas class="mx-auto" height="150" width="150" bind:this={canvas}></canvas>