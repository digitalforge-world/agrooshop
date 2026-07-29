<template>
  <!-- Floating AI Button -->
  <div>
    <button
      @click="toggleChat"
      class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-2xl shadow-emerald-900/50 flex items-center justify-center text-white hover:scale-110 transition-transform"
      title="Assistant IA AgroShop"
    >
      <span v-if="!isOpen"><Bot class="w-7 h-7" /></span>
      <span v-else><X class="w-7 h-7" /></span>
      <span v-if="!isOpen" class="absolute top-0 right-0 w-3 h-3 bg-emerald-300 rounded-full border-2 border-slate-900 animate-pulse"></span>
    </button>

    <!-- Chat Window -->
    <Transition name="chat">
      <div
        v-if="isOpen"
        class="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-800/80 to-slate-900 border-b border-slate-700 p-4 flex items-center gap-3 flex-shrink-0">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot class="w-5 h-5" />
          </div>
          <div>
            <p class="text-sm font-bold text-white">Assistant AgroShop IA</p>
            <div class="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>En ligne — Connaissance des stocks en temps réel</span>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
          <div v-for="(msg, idx) in messages" :key="idx" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
            <!-- AI Message -->
            <div v-if="msg.role === 'assistant'" class="flex items-start gap-2 max-w-[85%]">
              <div class="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot class="w-4 h-4 text-emerald-400" />
              </div>
              <div class="bg-slate-800 border border-slate-700 rounded-xl rounded-tl-none px-3.5 py-2.5">
                <p class="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
              </div>
            </div>
            <!-- User Message -->
            <div v-else class="max-w-[85%]">
              <div class="bg-emerald-600 rounded-xl rounded-tr-none px-3.5 py-2.5">
                <p class="text-xs text-white leading-relaxed">{{ msg.content }}</p>
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="flex items-start gap-2">
            <div class="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Bot class="w-4 h-4 text-emerald-400" />
            </div>
            <div class="bg-slate-800 border border-slate-700 rounded-xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>

        <!-- Suggestions rapides -->
        <div v-if="messages.length <= 1" class="px-4 pb-2 flex flex-wrap gap-2">
          <button
            v-for="sug in suggestions"
            :key="sug"
            @click="sendMessage(sug)"
            class="px-3 py-1.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-full transition-colors"
          >
            {{ sug }}
          </button>
        </div>

        <!-- Input -->
        <div class="p-3 border-t border-slate-700 flex-shrink-0">
          <form @submit.prevent="handleSubmit" class="flex items-center gap-2">
            <input
              v-model="inputText"
              type="text"
              placeholder="Demandez l'état des stocks, les ventes..."
              class="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              :disabled="isTyping"
            />
            <button
              type="submit"
              :disabled="!inputText.trim() || isTyping"
              class="w-9 h-9 flex-shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
            >
              <Send class="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { Bot, X, Send } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const isOpen = ref(false)
const inputText = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)

const suggestions = [
  '🏪 État du stock Quincaillerie ?',
  '📊 Ventes du jour par boutique ?',
  '⚠️ Produits en rupture ?',
  '📈 Meilleure boutique ce mois ?'
]

const messages = ref([
  {
    role: 'assistant',
    content: 'Bonjour ! Je suis votre assistant IA AgroShop. Je connais les stocks et les ventes de toutes vos boutiques en temps réel. Comment puis-je vous aider ? 🌱'
  }
])

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) scrollToBottom()
}

const sendMessage = async (text) => {
  const content = text || inputText.value.trim()
  if (!content) return

  messages.value.push({ role: 'user', content })
  inputText.value = ''
  isTyping.value = true
  await scrollToBottom()

  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/ai/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        Accept: 'application/json'
      },
      body: { message: content }
    })

    messages.value.push({
      role: 'assistant',
      content: res?.reply || res?.message || "Je n'ai pas pu obtenir de réponse. Vérifiez la connexion à l'API."
    })
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: '⚠️ Erreur de connexion à l\'assistant IA. Vérifiez que le serveur Laravel tourne et que la clé API Gemini est configurée dans le fichier .env (GEMINI_API_KEY).'
    })
  } finally {
    isTyping.value = false
    await scrollToBottom()
  }
}

const handleSubmit = () => sendMessage()
</script>

<style scoped>
.chat-enter-active, .chat-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
.chat-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
</style>
