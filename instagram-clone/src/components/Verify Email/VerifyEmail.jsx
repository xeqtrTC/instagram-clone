import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query';
import { verifyEmail } from '../api/instagramApi';

export default function VerifyEmail() {
  const { token } = useParams()

  const {data, isError, error, isSuccess} = useQuery(['verifyEmail', token], () => verifyEmail(token))

  return (
    <div>VerifyEmail</div>
  )
}
