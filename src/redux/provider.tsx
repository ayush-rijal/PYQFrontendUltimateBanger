'use client';
// used as client because we have to use it in layout
import { store } from './store';
// import { makeStore } from './store';
import { Provider } from 'react-redux';

interface Props {
	children: React.ReactNode;
}

export default function CustomProvider({ children }: Props) {
	return <Provider store={store}>{children}</Provider>;
	// return <Provider store={makeStore()}>{children}</Provider>;
}