import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: number
  nom_commercial: string
  slug: string
  prix_unitaire: number
  unite_mesure: string
  url_image?: string
  quantite: number
  stock_disponible: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)
  const deliveryMode = ref<'domicile' | 'retrait'>('domicile')
  const deliveryFee = ref(5000)

  const totalQuantity = computed(() => items.value.reduce((sum, item) => sum + item.quantite, 0))
  const totalPriceHT = computed(() => items.value.reduce((sum, item) => sum + (item.prix_unitaire * item.quantite), 0))
  const tvaAmount = computed(() => Math.round(totalPriceHT.value * 0.18))
  const totalPriceTTC = computed(() => totalPriceHT.value + tvaAmount.value)
  const grandTotal = computed(() => {
    const fee = deliveryMode.value === 'domicile' ? deliveryFee.value : 0
    return totalPriceTTC.value + fee
  })

  function addItem(product: { id: number; nom_commercial: string; slug: string; prix_unitaire: number; unite_mesure: string; image_principale?: { url_image: string }; url_image?: string; stock_disponible?: number }, quantity = 1) {
    const existing = items.value.find(item => item.id === product.id)
    const stock = product.stock_disponible ?? 999
    const imageUrl = product.image_principale?.url_image || product.url_image || '/images/placeholder.jpg'

    if (existing) {
      existing.quantite = Math.min(existing.quantite + quantity, stock)
    } else {
      items.value.push({
        id: product.id,
        nom_commercial: product.nom_commercial,
        slug: product.slug,
        prix_unitaire: Number(product.prix_unitaire),
        unite_mesure: product.unite_mesure || 'unité',
        url_image: imageUrl,
        quantite: Math.min(quantity, stock),
        stock_disponible: stock
      })
    }
    isOpen.value = true
    saveToStorage()
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(i => i.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantite = Math.min(quantity, item.stock_disponible)
        saveToStorage()
      }
    }
  }

  function removeItem(productId: number) {
    items.value = items.value.filter(i => i.id !== productId)
    saveToStorage()
  }

  function clearCart() {
    items.value = []
    saveToStorage()
  }

  function toggleCart(open?: boolean) {
    isOpen.value = open !== undefined ? open : !isOpen.value
  }

  function saveToStorage() {
    if (import.meta.client) {
      localStorage.setItem('agroshop_cart', JSON.stringify({
        items: items.value,
        deliveryMode: deliveryMode.value
      }))
    }
  }

  function loadFromStorage() {
    if (import.meta.client) {
      const data = localStorage.getItem('agroshop_cart')
      if (data) {
        try {
          const parsed = JSON.parse(data)
          items.value = parsed.items || []
          deliveryMode.value = parsed.deliveryMode || 'domicile'
        } catch (e) {
          console.error('Failed to parse cart storage', e)
        }
      }
    }
  }

  return {
    items,
    isOpen,
    deliveryMode,
    deliveryFee,
    totalQuantity,
    totalPriceHT,
    tvaAmount,
    totalPriceTTC,
    grandTotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    toggleCart,
    saveToStorage,
    loadFromStorage
  }
})
