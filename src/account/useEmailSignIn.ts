'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Models } from 'appwrite'
import { useAppwrite } from 'react-appwrite'

type TRequest = {
  email: string,
  password: string,
}

function useEmailSignIn() {
  const { account } = useAppwrite()
  const queryClient = useQueryClient()
  const mutation = useMutation<Models.Session, unknown, TRequest, unknown>({
    mutationFn: async request => {
      return await account.createEmailSession(request.email, request.password)
    },

    onSuccess: async () => {
      queryClient.setQueryData(['appwrite', 'account'], await account.get())
    },
  })

  return mutation
}

export { useEmailSignIn }
