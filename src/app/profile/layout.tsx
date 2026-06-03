import {ReactNode} from 'react';
import Image from 'next/image';
import Modes from '@/components/dashboard/modes';

export default function DashboardLayout({children}: {children: ReactNode}) {
    return (
        <div className="min-h-screen pt-[76px] px-8 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-center md:justify-start items-center flex-wrap gap-3 md:gap-4 mb-5">
                    <Image
                        src="/assets/dashboard/profile-photo.jpg"
                        alt="Tatiana profile photo."
                        width={80}
                        height={80}
                        className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover"
                    />
                    <h1 className="font-semibold text-[1.5rem] md:text-[2.5rem] leading-none mr-0 md:mr-5">
                        Hey there, <span className="text-brand-lavender">Tatiana!</span>
                    </h1>
                    <Modes />
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
