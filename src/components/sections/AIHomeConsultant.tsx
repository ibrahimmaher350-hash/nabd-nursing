'use client'
/**
 * components/sections/AIHomeConsultant.tsx — نبض للتمريض المنزلي
 * CareHub-style interactive AI Medical Consultation Hub on the Homepage
 */

import { useState, useEffect, useRef } from 'react'
import {
  SparklesIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const commonQuestions = [
  'ما الإجراء المتبع لمريض سكر يعاني من جرح بطيء الالتئام؟',
  'متى يجب تغيير القسطرة البولية بالمنزل وما هي علامات الالتهاب؟',
  'هل يمكن إعطاء المحاليل الوريدية وكافة أنواع الحقن بالمنزل؟',
  'كيف أعتني بقرح الفراش لمريض طريح الفراش لتفادي تدهورها؟',
]

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  text: 'أهلاً بك في مركز نبض للاستشارة الطبية الذكية 🤖💙\n\nأنا مساعدك الطبي الفوري. اكتب لي أعراض المريض أو الاستفسار المطلوب وسأوضح لك الإجراء الصحيح والخدمة المناسبة فوراً.',
}

export default function AIHomeConsultant() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { getWhatsAppUrl } = useSettings()
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Listen for queries from Hero quick suggestions
  useEffect(() => {
    const handleAsk = (e: Event) => {
      const customEvent = e as CustomEvent<{ query: string }>
      if (customEvent.detail?.query) {
        handleSend(customEvent.detail.query)
      }
    }
    window.addEventListener('nabd_ai_ask', handleAsk)
    return () => window.removeEventListener('nabd_ai_ask', handleAsk)
  }, [messages])

  const handleSend = async (queryText?: string) => {
    const text = (queryText || input).trim()
    if (!text || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    if (!queryText) setInput('')
    setLoading(true)

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }))

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = (await res.json()) as { reply: string }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || 'تم استلام استفسارك. يمكنك التواصل مع الممرض المناوب مباشرة عبر واتساب للمساعدة السريعة.',
      }
      setMessages((prev) => [...prev, assistantMsg])
      analytics.viewService('ai_consultant', 'homepage_chat')
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'عذراً، حدث خطأ مؤقت بالشبكة. يمكنك الضغط على زر واتساب للتحدث فوراً مع أخصائي التمريض المناوب بدمياط.',
        },
      ])
    } finally {
      setLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  return (
    <section
      id="ai-consultant"
      className="py-14 sm:py-20 bg-gradient-to-b from-[#0E285C] via-[#0A1C40] to-slate-50 text-white relative overflow-hidden"
      aria-label="مركز نبض للاستشارة الطبية الذكية"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/3 end-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="absolute bottom-10 start-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="section-container relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-gold-400/40 text-gold-300 rounded-full px-4 py-1.5 text-xs font-bold mb-4 shadow-sm backdrop-blur-md">
            <SparklesIcon className="w-4 h-4 text-gold-400 animate-pulse" />
            <span>مدعوم بالذكاء الاصطناعي الطبي المتقدم</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            مركز الاستشارة والتوجيه التمريضي الذكي
          </h2>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            لست متأكداً من الخدمة المناسبة لحالة مريضك؟ اسأل المساعد الذكي الآن وسيوضح لك الخطوات الإرشادية والخدمة المناسبة بدقة وسرعة.
          </p>
        </div>

        {/* Interactive Chat Console Card (CareHub Style) */}
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-slate-200 overflow-hidden text-slate-900 flex flex-col">

          {/* Console Header Bar */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-4 sm:p-5 flex items-center justify-between border-b border-navy-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold-500 text-navy-950 flex items-center justify-center font-black shadow-md">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base text-white">مساعد نبض الطبي الذكي (دمياط)</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>متصل ومستعد للإجابة على مدار الساعة</span>
                </div>
              </div>
            </div>

            <a
              href={getWhatsAppUrl('أريد استشارة طبية سريعة بخصوص حالة مريض')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all shadow"
            >
              <span>واتساب الممرض المناوب</span>
              <ArrowLeftIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 sm:p-6 bg-slate-50/80 min-h-[300px] max-h-[420px] overflow-y-auto flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.role === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    🤖
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    أنت
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-navy-800 to-navy-900 text-white rounded-tr-sm'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-line font-normal">{msg.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold bg-white border border-slate-200 w-fit px-4 py-2.5 rounded-2xl">
                <span className="w-2 h-2 rounded-full bg-navy-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-navy-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-navy-600 animate-bounce [animation-delay:0.4s]" />
                <span>المساعد الطبي يحلل الاستفسار الآن...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Common Suggestions Bar */}
          <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">أسئلة شائعة:</span>
            {commonQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full shrink-0 transition-colors truncate max-w-[280px]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب استفسارك الطبي أو حالة المريض هنا..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:bg-white focus:ring-2 focus:ring-navy-600 transition-all font-cairo"
              dir="rtl"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-navy-800 hover:bg-navy-900 disabled:opacity-40 text-white font-black px-5 py-3 rounded-2xl transition-all shadow flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
              aria-label="إرسال"
            >
              <span className="hidden sm:inline text-xs">إرسال</span>
              <PaperAirplaneIcon className="w-4 h-4 rotate-180" />
            </button>
          </div>

          {/* Clinical Disclaimer */}
          <div className="bg-slate-50 px-4 py-2 text-center text-[11px] text-slate-500 border-t border-slate-100 flex items-center justify-center gap-2">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>استشارات إرشادية وتوجيهية لخدمات التمريض المنزلي ولا تغني عن الطوارئ 123 في الحالات الحرجة.</span>
          </div>

        </div>

      </div>
    </section>
  )
}
