import { tryrun } from '$lib/karesz/karesz-dotnet';
import { run } from '$lib/karesz/karesz-ss';
import { init } from '$lib/db/dbinit';

// run();
// await tryrun();

// INITIALIZE
await init();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	return await resolve(request);
}
