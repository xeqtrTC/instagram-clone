import React, { useState } from 'react'

export default function AddphotoHook() {
    const [start, setStart] = useState(false);
    console.log('STARTTTTTTTTTTT', start)
    return {
        start,
        setStart
    }


}
