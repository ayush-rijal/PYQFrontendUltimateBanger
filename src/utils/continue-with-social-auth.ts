import toast from "react-hot-toast";

export default async function continueWithSocialAuth(
	provider: string,
	redirect: string
) {
	try {
		const url = `${
			process.env.NEXT_PUBLIC_HOST
		}/userapi/o/${provider}/?redirect_uri=${
			process.env.NODE_ENV === 'production'
				? process.env.NEXT_PUBLIC_REDIRECT_URL
				: 'http://localhost:3000'
		}/auth/${redirect}`;

		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			credentials: 'include',
		});
		const data = await res.json();

		if (res.status === 200 && typeof window !== 'undefined') {
			window.location.replace(data.authorization_url);
		} else {
			toast.error('Something went wrong');
		}
	} catch (error) {
		console.error('Error:', error);
		toast.error('Something went wrong');
	}
}