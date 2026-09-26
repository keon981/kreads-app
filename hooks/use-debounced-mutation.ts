import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { debounce, isEqual, isError, isFunction } from 'es-toolkit'

interface Snapshot<TData> {
  value: TData
  source: TData
}

interface CommittedSnapshot<TData> extends Snapshot<TData> {
  version: number
}

export interface UseDebouncedMutationOptions<TData, TResult> {
  data: TData
  delay?: number
  mutationFn: (variables: TData) => Promise<TResult>
  onSuccess?: (result: TResult, variables: TData) => void
  onError?: (error: Error, variables: TData) => void
  onSettled?: (result: TResult | undefined, error: Error | null, variables: TData) => void
}

export interface UseDebouncedMutationResult<TData> {
  data: TData
  mutate: (updater: TData | ((prev: TData) => TData)) => void
  isPending: boolean
  error: Error | null
}

export function useDebouncedMutation<TData, TResult = unknown>(
  options: UseDebouncedMutationOptions<TData, TResult>,
): UseDebouncedMutationResult<TData> {
  const { data, delay = 300 } = options

  const [optimistic, setOptimistic] = useState<Snapshot<TData> | null>(null)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const optionsRef = useRef(options)
  const committedRef = useRef<CommittedSnapshot<TData> | null>(null)
  const versionRef = useRef<number>(0)
  const inFlightRef = useRef<number>(0)

  useLayoutEffect(() => {
    optionsRef.current = options
  })

  const [debounced] = useState(() => debounce(async (variables: TData, version: number): Promise<void> => {
    const { data: source, mutationFn, onSuccess, onError, onSettled } = optionsRef.current
    const committed = committedRef.current
    const base = committed && isEqual(committed.source, source) ? committed.value : source
    const isLatest = (): boolean => version === versionRef.current

    if (inFlightRef.current === 0 && isEqual(variables, base)) {
      if (isLatest()) setIsPending(false)
      return
    }

    inFlightRef.current += 1
    try {
      const result = await mutationFn(variables)
      if (version > (committedRef.current?.version ?? 0)) {
        committedRef.current = { value: variables, source, version }
      }
      if (isLatest()) setIsPending(false)
      onSuccess?.(result, variables)
      onSettled?.(result, null, variables)
    } catch (e) {
      const err = isError(e) ? e : new Error(String(e))
      if (isLatest()) {
        const last = committedRef.current
        setOptimistic(last ? { value: last.value, source: last.source } : null)
        setError(err)
        setIsPending(false)
      }
      onError?.(err, variables)
      onSettled?.(undefined, err, variables)
    } finally {
      inFlightRef.current -= 1
    }
  }, delay))

  useEffect(() => () => debounced.flush(), [debounced])

  const current = optimistic && (isPending || isEqual(optimistic.source, data))
    ? optimistic.value
    : data

  const mutate = (updater: TData | ((prev: TData) => TData)): void => {
    const next: TData = isFunction(updater) ? updater(current) : updater
    versionRef.current += 1
    setOptimistic({ value: next, source: data })
    setIsPending(true)
    setError(null)
    debounced(next, versionRef.current)
  }

  return {
    data: current,
    mutate,
    isPending,
    error,
  }
}
