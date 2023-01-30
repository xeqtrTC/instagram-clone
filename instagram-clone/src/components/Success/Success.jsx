import React from 'react'

export default function Success({successMessage}) {
  return (
    <div className='bg-[#2ECC71] py-1.5 px-2 rounded text-white font-semibold text-center'>{successMessage}</div>
  )
}
