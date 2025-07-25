import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI
} from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		return new Response('Missing code parameter', { status: 400 });
	}

	const response = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: DISCORD_CLIENT_ID, // Your Discord client ID
			client_secret: DISCORD_CLIENT_SECRET, // Your Discord client secret
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: DISCORD_REDIRECT_URI // Your redirect URI
		})
	});

	if (!response.ok) {
    const error = await response.json();
    return new Response(`Error fetching token: ${error.error_description}`, { status: response.status });
  }

  const data = await response.json();

  if (data.access_token) {
    return new Response('Login successful', { status: 200 });
  } else {
    return new Response('Failed to retrieve access token', { status: 500 });
  }
};
