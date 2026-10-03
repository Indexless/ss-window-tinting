const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

type ApiEnvelope<T> = {
  data?: T
  error?: { code: string; message: string }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const text = await res.text()
  let json: ApiEnvelope<T> | null = null
  if (text) {
    try {
      json = JSON.parse(text) as ApiEnvelope<T>
    } catch {
      throw new Error(
        res.ok
          ? 'Unexpected response from server'
          : res.status === 404
            ? 'API route not found. Is the backend running the latest build?'
            : `Request failed (${res.status})`,
      )
    }
  }

  if (!res.ok || json?.error) {
    throw new Error(json?.error?.message ?? `Request failed (${res.status})`)
  }
  if (!json || !('data' in json)) {
    throw new Error('Unexpected response from server')
  }
  return json.data as T
}
