import React from 'react'

function Dashboard() {
    return (
        <div>
            <div className='w-full flex flex-row gap-5 px-10'>
                <div className='flex w-full bg-white rounded-xl drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10'>
                        <div className='flex text-sm'>Cash Sales</div>
                        <div>71456</div>
                    </div>
                </div>
                <div className='flex w-full bg-white rounded-xl drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10'>
                        <div className='flex text-sm'>Credit Sales</div>
                        <div>71456</div>
                    </div>
                </div>
                <div className='flex w-full  bg-white rounded-xl drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10'>
                        <div className='flex text-sm'>Lease Sales</div>
                        <div>71456</div>
                    </div>
                </div>
                <div className='flex w-full bg-white rounded-xl drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10'>
                        <div className='flex text-sm'>Stock Sales</div>
                        <div>71456</div>
                    </div>
                </div>

            </div>
            <div className='w-full flex flex-row mt-5 gap-5 px-10'>
                <div className='flex w-full bg-white rounded-xl drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10'>
                        <div className='flex text-sm'>Users</div>
                        <div>118</div>
                    </div>
                </div>
                <div className='flex w-full bg-white rounded-xl drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10'>
                        <div className='flex text-sm'>Customers</div>
                        <div>619</div>
                    </div>
                </div>
                <div className='flex w-full  bg-white rounded-xl drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10'>
                        <div className='flex text-sm'>Stores</div>
                        <div>71456</div>
                    </div>
                </div>
                <div className='flex w-full bg-white rounded-xl drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10'>
                        <div className='flex text-sm'>Products</div>
                        <div>71456</div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Dashboard