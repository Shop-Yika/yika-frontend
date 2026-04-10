import {ReactNode} from 'react';
import Image from 'next/image';
import Modes from '@/components/dashboard/modes';

export default function DashboardLayout({children}: {children: ReactNode}) {
    return (
        <div className="min-h-screen pt-[76px] px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center flex-wrap gap-6 mb-2">
                    <Image
                        src="/assets/dashboard/profile-photo.jpg"
                        alt="Tatiana profile photo."
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <h1 className="font-semibold text-[2.5rem] leading-none">
                        Hey there, <span className="text-[#b361a6]">Tatiana!</span>
                    </h1>
                    <Modes />
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
