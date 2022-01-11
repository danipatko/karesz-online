// import { init } from '$lib/db/dbinit';
import { KareszDotnet } from '$lib/karesz/dotnet/karesz-dotnet';
import { spwn } from '$lib/util/command';

// INITIALIZE db
// await init();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	return await resolve(request);
}
