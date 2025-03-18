// import React from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// const UserProfile: React.FC = () => (
//   <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
//     <CardHeader className="p-0">
//       <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile</CardTitle>
//     </CardHeader>
//     <CardContent className="p-0 mt-2">
//       <p className="text-sm text-gray-600 dark:text-gray-400">Name: Arun</p>
//       <p className="text-sm text-gray-600 dark:text-gray-400">Progress: 75%</p>
//     </CardContent>
//   </Card>
// );

// export default UserProfile;



'use client';
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";

import {List,Spinner} from '@/components/common';


export default function UserProfile() {
const {data:user,isLoading,isFetching} = useRetrieveUserQuery();

console.log("First Name from UserProfile:", user?.first_name);


const config = [
  {
    label: 'First Name',
    value: user?.first_name,
  },
  {
    label: 'Last Name',
    value: user?.last_name,
  },
  {
    label: 'Email',
    value: user?.email,
  },
];

if (isLoading || isFetching) {
  return (
    <div className='flex justify-center my-8'>
      <Spinner lg />
    </div>
  );
}

return (
  <>


    <header className='bg-white shadow'>
      <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
         User Profile
        </h1>
      </div>
    </header>
    <main className='mx-auto max-w-7xl py-6 my-8 sm:px-6 lg:px-8'>
      <List config={config} />
      
    </main>
  </>
);
}



