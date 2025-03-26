// 'use client';

// import { redirect } from 'next/navigation';
// import { useAppSelector } from '@/redux/hooks';
// import { Spinner } from '@/components/common';

// interface Props {
// 	children: React.ReactNode;
// }

// export default function RequireAuth({ children }: Props) {
// 	const { isLoading, isAuthenticated } = useAppSelector(state => state.auth);

// 	if (isLoading) {
// 		return (
// 			<div className='flex justify-center my-8'>
// 				<Spinner  />
// 			</div>
// 		);
// 	}

// 	if (!isAuthenticated) {
// 		redirect('/auth/login');
// 	}

// 	return <>{children}</>;
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "@/components/common";

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
