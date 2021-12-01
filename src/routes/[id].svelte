<script lang="ts" context="module">

  export async function load({ page, fetch }) {
    const { id } = page.params;

    if(! id) return {
        status: 200,
        props: {
          status:404
        }
    };

    const result = await fetch(`/projects/${id}`);
    return {
      status: 200,
      props: { 
        status: result.status,
        data: await result.json() 
      }
    };
  }
</script>

<script>
	import ErrorPage from '$lib/svelte-components/error.svelte';
  export let data;
	export let status;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if status == 404}
  <!-- PROJECT NOT FOUND  -->
  <ErrorPage status={status} />

{:else}

  <!-- PROJECT FOUND  -->
  <p>{JSON.stringify(data)}</p>

{/if}

