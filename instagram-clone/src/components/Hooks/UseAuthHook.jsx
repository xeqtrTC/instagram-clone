import React from 'react'
import { useQuery } from 'react-query'
import { whoami } from '../api/instagramApi'

export const UseAuthHook = () => {
  const { data, isLoading, isSuccess, isError, error } = useQuery('whoami', whoami)



  if(isLoading) {
    return true
  }
  if(isSuccess) {
    
    const { username, isAuth } = data;

    if( username && isAuth ) {
        return { username: username, isAuth: isAuth }
    } 

    return { username: [], isAuth: []}

  }

    
}
