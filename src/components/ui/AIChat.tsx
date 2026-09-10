'use client'
/**
 * components/ui/AIChat.tsx — نبض للتمريض المنزلي
 * زر وشاشة المساعد الذكي للمرضى
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const WELCOME = 'أهلاً! 👋 أنا مساعد نبض الذكي. كيف ممكن أساعدك اليوم؟ يمكنني الإجابة على أسئلتك عن خدماتنا التمريضية المنزلية في دمياط.'

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', text: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }))

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json() as { reply: string }
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || 'عذراً، لم أفهم. حاول مرة أخرى أو تواصل معنا عبر واتساب.',
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'عذراً، حدث خطأ مؤقت. تواصل معنا على واتساب مباشرةً! 💙',
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating AI Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed z-40 bottom-20 start-5 w-14 h-14 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 text-white flex items-center justify-center shadow-[0_6px_24px_rgba(27,43,107,0.45)] hover:scale-110 transition-transform no-print"
        aria-label="المساعد الذكي"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      >
        {/* AI sparkle icon */}
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a1 1 0 01.894.553l2.382 4.764 5.26.764a1 1 0 01.554 1.706l-3.808 3.71.899 5.24A1 1 0 0117 19.688L12 17.138l-5 2.55a1 1 0 01-1.451-1.054l.899-5.24-3.808-3.71a1 1 0 01.554-1.706l5.26-.764L11.106 2.553A1 1 0 0112 2z"/>
        </svg>
        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-gold-400"
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          aria-hidden="true"
        />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed z-50 bottom-0 start-0 end-0 md:bottom-5 md:start-5 md:end-auto md:w-80 lg:w-96 bg-white rounded-t-3xl md:rounded-3xl shadow-card-lg flex flex-col overflow-hidden"
              style={{ maxHeight: '80dvh' }}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-primary shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gold-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a1 1 0 01.894.553l2.382 4.764 5.26.764a1 1 0 01.554 1.706l-3.808 3.71.899 5.24A1 1 0 0117 19.688L12 17.138l-5 2.55a1 1 0 01-1.451-1.054l.899-5.24-3.808-3.71a1 1 0 01.554-1.706l5.26-.764L11.106 2.553A1 1 0 0112 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">مساعد نبض الذكي</p>
                    <p className="text-white/60 text-xs">سؤالك هيتجاوب خلال ثواني</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="إغلاق"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth" dir="rtl">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-navy-700 text-white rounded-br-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-end">
                    <div className="bg-slate-100 border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 rounded-full bg-navy-400"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-slate-100 bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="اكتب سؤالك هنا..."
                    className="flex-1 nabd-input text-sm py-2.5 min-h-0"
                    maxLength={300}
                    dir="rtl"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="w-10 h-10 rounded-xl bg-navy-700 hover:bg-navy-800 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all active:scale-90"
                    aria-label="إرسال"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 rotate-180" />
                  </button>
                </div>
                <p className="text-[10px] text-medical-muted text-center mt-1.5">
                  للاستفسارات العاجلة — واتساب مباشرة
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
