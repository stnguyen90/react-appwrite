'use client'

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { Models } from 'appwrite'
import { useEffect, useMemo } from 'react'
import { useAppwrite } from 'react-appwrite'

export function useFile(
  bucketId: string,
  fileId: string,
  options?: UseQueryOptions<Models.File, unknown, Models.File, string[]>
) {
  const { storage } = useAppwrite()
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['appwrite', 'storage', bucketId, fileId], [bucketId, fileId])
  const queryResult = useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, , bucketId, fileId] }) => {
      return await storage.getFile(bucketId, fileId)
    },

    ...options,
  })

  useEffect(() => {
    const unsubscribe = storage.client.subscribe(`buckets.${bucketId}.files.${fileId}`, response => {
      queryClient.setQueryData(queryKey, response.payload)
    })

    return unsubscribe
  }, [bucketId, fileId, queryKey])

  return queryResult
}