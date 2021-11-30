import { tryrun } from '$lib/karesz/karesz-dotnet';
import { run } from '$lib/karesz/karesz-ss';

// run();
await tryrun();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	return await resolve(request);
}
