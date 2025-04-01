import cn from 'classnames';

interface Props {
	provider: 'google' | 'facebook';
	children: React.ReactNode;
	rest?: React.ButtonHTMLAttributes<HTMLButtonElement>;
	onClick?: () => void;
	className?: string;
}

export default function SocialButton({ provider, children, ...rest }: Props) {
	const className = cn(
		'flex-1 text-white rounded-md px-3 mt-3 py-2 font-medium text-center justify-center items-center transition-colors duration-200',
		{
			'bg-red-500 hover:bg-red-400 text-center itmes-center justify-center': provider === 'google',
			'bg-blue-500 hover:bg-blue-400': provider === 'facebook',
		}
	);

	return (
		<button className={className} {...rest}>
			<span className='flex justify-start items-center'>{children}</span>
		</button>
	);
}