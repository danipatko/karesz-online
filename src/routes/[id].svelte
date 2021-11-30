<script>
import { page } from "$app/stores";
  const id = $page.params;

  export async function load({ fetch }) {
    const res = await fetch(`/`).then(r => r.json());

    return {
      props: { model:'b' }
    };
  }
</script>


<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
