import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query';
import { getcsrf } from '../api/instagramApi';

export default function GetCSRFToken() {
    const [csrftoken, setcsrftoken] = useState('');
    const queryClient = useQueryClient();

    const getCookieQuery = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
}

    const { isLoading, isError, error, data, isSuccess } = useQuery('token', getcsrf, {
        onSuccess: () => {
            setcsrftoken(getCookieQuery('csrftoken'))
        } 
    })
    
    console.log(data)

  return (
    <input type='hidden' name='csrfmiddlewaretoken' value={csrftoken} onChange={(e) => setcsrftoken(e.target.value)} />
  )
}
