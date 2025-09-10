import Image from 'next/image'
import React from 'react'

export default function Navbar() {
    return (
        <nav className='w-full h-38 bg-blue-400 flex items-center justify-between'>
            <div className='flex flex-col px-10'>
                <h1 className='text-4xl mb-2'>Patient Directory</h1>
                <p className=''>1000 Patient Found</p>
            </div>
            <Image className="overflow-hidden" src="/medplusdes.png" alt="MedPlus" width={800} height={159} />
        </nav>
    )
}
