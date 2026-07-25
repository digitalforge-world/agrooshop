import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCatalogStore = defineStore('catalog', () => {
  const activeUniverse = ref<'all' | 'agrodop' | 'quincaillerie'>('all')
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const minPrice = ref<number | null>(null)
  const maxPrice = ref<number | null>(null)
  const sort = ref<'latest' | 'price_asc' | 'price_desc' | 'name_asc'>('latest')

  function setUniverse(universe: 'all' | 'agrodop' | 'quincaillerie') {
    activeUniverse.value = universe
    if (universe === 'agrodop') {
      selectedCategory.value = 'intrants-agricoles'
    } else if (universe === 'quincaillerie') {
      selectedCategory.value = 'quincaillerie'
    } else {
      selectedCategory.value = ''
    }
  }

  function setSearch(query: string) {
    searchQuery.value = query
  }

  function setCategory(categorySlug: string) {
    selectedCategory.value = categorySlug
  }

  function resetFilters() {
    searchQuery.value = ''
    selectedCategory.value = ''
    minPrice.value = null
    maxPrice.value = null
    sort.value = 'latest'
    activeUniverse.value = 'all'
  }

  return {
    activeUniverse,
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    sort,
    setUniverse,
    setSearch,
    setCategory,
    resetFilters
  }
})
