import React from 'react'

export default function ErrorComponent({error}) {
  return (
    <div className='bg-[#EB1D36] py-1.5 px-2 rounded text-white font-semibold text-center'>{error}</div>
  )
}
