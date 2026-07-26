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

const fallbackImage = '/images/Agroshopproduit .png'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)
  const isCheckoutOpen = ref(false)
  const isBouncing = ref(false)
  const deliveryMode = ref<'domicile' | 'retrait'>('domicile')
  const deliveryFee = ref(5000)

  const totalQuantity = computed(() => items.value.reduce((sum, item) => sum + item.quantite, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + (item.prix_unitaire * item.quantite), 0))
  const totalPriceHT = totalPrice
  const totalPriceTTC = totalPrice
  const tvaAmount = computed(() => 0)
  const grandTotal = computed(() => {
    const fee = deliveryMode.value === 'domicile' ? deliveryFee.value : 0
    return totalPrice.value + fee
  })

  const { getImageUrl } = useMedia()

  function triggerCartAnimation() {
    isBouncing.value = true
    setTimeout(() => {
      isBouncing.value = false
    }, 800)
  }

  function openCheckout() {
    isOpen.value = false
    isCheckoutOpen.value = true
  }

  function closeCheckout() {
    isCheckoutOpen.value = false
  }

  function addItem(product: { id: number; nom_commercial: string; slug: string; prix_unitaire: number; unite_mesure: string; image_principale?: { url_image: string }; url_image?: string; stock_disponible?: number }, quantity = 1) {
    const existing = items.value.find(item => item.id === product.id)
    const stock = product.stock_disponible ?? 999
    const rawImage = product.image_principale?.url_image || product.url_image || fallbackImage
    const imageUrl = getImageUrl(rawImage)

    if (existing) {
      existing.quantite = Math.min(existing.quantite + quantity, stock)
      if (!existing.url_image || existing.url_image === '/images/placeholder.jpg') {
        existing.url_image = imageUrl
      }
    } else {
      items.value.push({
        id: product.id,
        nom_commercial: product.nom_commercial,
        slug: product.slug,
        prix_unitaire: Number(product.prix_unitaire),
        unite_mesure: product.unite_mesure || 'unité',
        url_image: imageUrl || fallbackImage,
        quantite: Math.min(quantity, stock),
        stock_disponible: stock
      })
    }
    
    // Do NOT open cart automatically, trigger wiggle animation on navbar cart icon
    triggerCartAnimation()
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
    isCheckoutOpen,
    isBouncing,
    deliveryMode,
    deliveryFee,
    totalQuantity,
    totalPrice,
    totalPriceHT,
    tvaAmount,
    totalPriceTTC,
    grandTotal,
    addItem,
    openCheckout,
    closeCheckout,
    triggerCartAnimation,
    updateQuantity,
    removeItem,
    clearCart,
    toggleCart,
    saveToStorage,
    loadFromStorage
  }
})
