import adapter from '@sveltejs/adapter-vercel';

export default {
	kit: {
		env: {
			dir:'./'

		},
		adapter: adapter({
			runtime: 'nodejs20.x',
		})
	}
};