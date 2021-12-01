<script context="module">
    export function load({ error, status }) {
        console.log(error);
        return {
            props: {
                data: `${status}: ${error.message}`
            }
        };
    }
</script>
  
<script>
  export let data;
</script>
  
<h1>{data}</h1>