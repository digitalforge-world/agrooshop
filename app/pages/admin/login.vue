<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">
    <span>Redirection sécurisée vers la passerelle SSO Enterprise...</span>
  </div>
</template>

<script setup>
import { SECRET_ADMIN_LOGIN_PATH } from '~/stores/adminAuth'

definePageMeta({
  layout: false
})

onMounted(() => {
  navigateTo(SECRET_ADMIN_LOGIN_PATH, { replace: true })
})
</script>
