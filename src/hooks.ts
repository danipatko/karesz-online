import { tryrun } from '$lib/karesz/karesz-dotnet';

tryrun();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	return await resolve(request);
}
