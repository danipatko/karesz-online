import { tryrun } from '$lib/karesz/karesz-dotnet';

await tryrun();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	return await resolve(request);
}
