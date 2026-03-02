'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OrderItem {
  productId: string
  nameTr: string
  nameEn: string
  quantity: number
  unitPrice: number
}

interface Order {
  id: string
  tableNumber: string
  items: string
  totalPrice: number
  status: string
  createdAt: string
}

function playNewOrderSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // ignore
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const previousIdsRef = useRef<Set<string>>(new Set())

  const fetchOrders = useCallback(async () => {
    const res = await fetch('/api/orders?status=pending')
    if (!res.ok) return
    const data: Order[] = await res.json()
    const ids = new Set(data.map((o) => o.id))
    const prev = previousIdsRef.current
    const hasNew = data.some((o) => !prev.has(o.id))
    if (hasNew && prev.size > 0) {
      playNewOrderSound()
    }
    previousIdsRef.current = ids
    setOrders(data)
  }, [])

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false))
    const interval = setInterval(fetchOrders, 3500)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const handleComplete = async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    })
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id))
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Canlı Siparişler</h2>
        <p className="text-muted-foreground">
          Bekleyen siparişler anlık güncellenir. Tamamlanan siparişleri işaretleyin.
        </p>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-950/50">
            <CardContent className="flex min-h-[200px] items-center justify-center py-12">
              <p className="text-zinc-500">Bekleyen sipariş yok.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            let items: OrderItem[] = []
            try {
              items = JSON.parse(order.items) as OrderItem[]
            } catch {
              // ignore
            }
            const date = new Date(order.createdAt)
            return (
              <Card
                key={order.id}
                className="border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 shadow-lg"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                  <div>
                    <CardTitle className="text-xl text-zinc-100">
                      Masa {order.tableNumber}
                    </CardTitle>
                    <p className="text-sm text-zinc-500">
                      {date.toLocaleTimeString('tr-TR')} — {date.toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-lime-400">
                      {order.totalPrice.toFixed(2)} ₺
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                    {items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between text-sm text-zinc-300"
                      >
                        <span>
                          {item.nameTr} × {item.quantity}
                        </span>
                        <span className="text-lime-400/90">
                          {(item.quantity * item.unitPrice).toFixed(2)} ₺
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleComplete(order.id)}
                    className="w-full bg-lime-500 text-zinc-950 hover:bg-lime-400"
                  >
                    Tamamlandı
                  </Button>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
