<script>

    export let data;
</script>

Quote: {data?.value?.quote}<br>
Author: {data?.value?.author}<br>
Note: {data?.value?.author}<br>
Status: {data?.metadata?.status}<br>
Submitted: {new Date(data?.metadata?.submitted)}