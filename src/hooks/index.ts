import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/api-client'

export function useFeatures() {
  return useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      const res = await client.api.features.$get()
      return res.json()
    }
  })
}

export function useFeature(featureId: string) {
  return useQuery({
    queryKey: ['features', featureId],
    queryFn: async () => {
      const res = await client.api.features[':id'].$get({ param: { id: featureId } })
      return res.json()
    },
    enabled: !!featureId
  })
}

export function useCreateFeature() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { title: string; description: string; authorName?: string }) => {
      const res = await client.api.features.$post({ json: data })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
    }
  })
}

export function useUpdateFeature() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; title?: string; description?: string; status?: string }) => {
      const res = await client.api.features[':id'].$put({ param: { id }, json: data })
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
      queryClient.invalidateQueries({ queryKey: ['features', variables.id] })
    }
  })
}

export function useDeleteFeature() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await client.api.features[':id'].$delete({ param: { id } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
    }
  })
}

export function useCreateVote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (featureId: string) => {
      const res = await client.api.votes.$post({ json: { featureId } })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
      queryClient.invalidateQueries({ queryKey: ['votes'] })
    }
  })
}

export function useDeleteVote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (featureId: string) => {
      await client.api.votes[':featureId'].$delete({ param: { featureId } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
      queryClient.invalidateQueries({ queryKey: ['votes'] })
    }
  })
}

export function useHasVoted(featureId: string) {
  return useQuery({
    queryKey: ['votes', featureId, 'check'],
    queryFn: async () => {
      const res = await client.api.votes[':featureId'].check.$get({ param: { featureId } })
      const data = await res.json()
      return data.hasVoted as boolean
    },
    enabled: !!featureId
  })
}

