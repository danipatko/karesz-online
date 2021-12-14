import { tryrun } from '$lib/karesz/dotnet/karesz-dotnet';
// import { init } from '$lib/db/dbinit';

// INITIALIZE db
// await init();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	return await resolve(request);
}
