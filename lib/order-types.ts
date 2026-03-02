export interface OrderItemInput {
  productId: string
  nameTr: string
  nameEn: string
  quantity: number
  unitPrice: number
}

export interface OrderItem extends OrderItemInput {
  productId: string
  nameTr: string
  nameEn: string
  quantity: number
  unitPrice: number
}

export type OrderStatus = 'pending' | 'completed'
