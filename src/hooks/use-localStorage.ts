import { useEffect, useState } from "react"

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
      window.dispatchEvent(
        new CustomEvent("local-storage", { detail: { key, newValue: state } })
      )
    } catch {}
  }, [key, state])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return
      try {
        setState(e.newValue ? JSON.parse(e.newValue) : initialValue)
      } catch {}
    }
    const onCustom = (e: Event) => {
      const ce = e as CustomEvent
      if (ce?.detail?.key === key) setState(ce.detail.newValue)
    }

    window.addEventListener("storage", onStorage)
    window.addEventListener("local-storage", onCustom as EventListener)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("local-storage", onCustom as EventListener)
    }
  }, [key, initialValue])

  return [state, setState] as const
}
