'use client';

import { useSocialAuthenticateMutation } from '@/redux/features/authApiSlice';
import { useSocialAuth } from '@/hooks';
import { Spinner } from '@/components/common';

export default function Page() {
	const [googleAuthenticate] = useSocialAuthenticateMutation();
	useSocialAuth((...args) => ({
		unwrap: async () => {
			await googleAuthenticate(...args).unwrap();
		},
	}), 'google-oauth2');

	return (
		<div className='my-8'>
			<Spinner  />
		</div>
	);
}