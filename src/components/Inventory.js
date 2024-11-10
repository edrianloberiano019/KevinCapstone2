import React from 'react'

function Inventory() {
  return (
    <div className='flex w-full p-5'>
        <div className='flex text-2xl w-full bg-[#185519] text-white rounded-xl p-5'>
          <div className=''>
            <div className='text-left'>Inventory</div>
            <div className='mt-5 flex justify-end w-full'>
              <div className='flex justify-end w-full'>
                <input type='search' />
                <button>search</button>
              </div>
            </div>
          
          </div>
        </div>
    </div>
  )
}

export default Inventory