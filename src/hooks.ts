// import { init } from '$lib/db/dbinit';
import { KareszDotnet } from '$lib/karesz/dotnet/karesz-dotnet';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	return await resolve(request);
}
