/**
 * app/api/ai-chat/route.ts — نبض للتمريض المنزلي
 * AI Chat endpoint using Google Gemini API
 */

import { NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/data/siteConfig'

const SYSTEM_PROMPT = `أنت مساعد طبي ذكي تابع لـ"نبض للتمريض المنزلي" في دمياط، مصر.
مهمتك: مساعدة المرضى وعائلاتهم في:
- الإجابة على أسئلة عامة عن الخدمات التمريضية المنزلية
- شرح إجراءات التمريض المنزلي بلغة بسيطة
- توجيه المريض لحجز الخدمة المناسبة
- تقديم نصائح صحية عامة وأولية

**الخدمات المتاحة من نبض:**
- تركيب وتغيير القسطرة البولية
- تركيب المحاليل الوريدية والكانيولا
- غيار الجروح والحروق وقرح الفراش
- تركيب أنبوبة التغذية المعوية (الرايل)
- سحب عينات التحاليل الطبية من المنزل
- إعطاء الحقن المنزلية
- قياس السكر والضغط والعلامات الحيوية
- رعاية المرضى بعد العمليات
- رعاية مرضى الشلل وكبار السن
- خدمات التغذية الوريدية (TPN)

**معلومات التواصل:**
- واتساب: ${siteConfig.contact.whatsapp}
- هاتف: ${siteConfig.contact.phone}

**قواعد مهمة:**
1. تكلم بالعربية العامية المصرية البسيطة
2. لا تقدم تشخيصاً طبياً دقيقاً
3. في الحالات الطارئة، دائماً انصح بالاتصال بـ 123 أو الذهاب لأقرب مستشفى
4. إجاباتك تكون مختصرة وواضحة (2-4 جمل)
5. اذكر دائماً إمكانية التواصل عبر واتساب للحجز`

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json() as {
      message: string
      history?: { role: 'user' | 'model'; text: string }[]
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'رسالة فارغة' }, { status: 400 })
    }

    // Use Gemini API if key is available, otherwise use fallback
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

    if (apiKey) {
      const contentsHistory = (history || []).map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      }))

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [
              ...contentsHistory,
              { role: 'user', parts: [{ text: message }] },
            ],
            generationConfig: {
              maxOutputTokens: 300,
              temperature: 0.7,
              topP: 0.9,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json() as {
        candidates?: { content?: { parts?: { text?: string }[] } }[]
      }
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? getFallbackReply(message)
      return NextResponse.json({ reply })
    }

    // Fallback: simple rule-based responses
    const reply = getFallbackReply(message)
    return NextResponse.json({ reply })

  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json({
      reply: 'عذراً، حدث خطأ مؤقت. تواصل معنا مباشرة عبر واتساب أو الهاتف وهنساعدك بكل تأكيد! 💙',
    })
  }
}

function getFallbackReply(message: string): string {
  const msg = message.toLowerCase()

  if (msg.includes('قسطرة') || msg.includes('catheter')) {
    return 'تركيب وتغيير القسطرة البولية من أهم خدماتنا — بتتم في المنزل بأيدي متخصصين وبمعايير تعقيم عالية. تواصل معنا عبر واتساب لحجز موعد. 🩺'
  }
  if (msg.includes('حقن') || msg.includes('injection')) {
    return 'بنقدم كافة أنواع الحقن المنزلية (عضل، وريد، تحت الجلد) بأمان تام. احجز موعدك عبر الموقع أو واتساب! 💉'
  }
  if (msg.includes('سعر') || msg.includes('تكلفة') || msg.includes('كام')) {
    return 'الأسعار بتختلف حسب نوع الخدمة والحالة. تواصل معنا عبر واتساب وهنوفرلك السعر المناسب بكل وضوح وأمانة. 💰'
  }
  if (msg.includes('موعد') || msg.includes('حجز') || msg.includes('وقت')) {
    return 'ممكن تحجز موعدك بسهولة من خلال صفحة الحجز في الموقع، أو تواصل معنا على واتساب وهنحدد معاك الموعد الأنسب! 📅'
  }
  if (msg.includes('جرح') || msg.includes('غيار') || msg.includes('ضمادة')) {
    return 'غيار الجروح والحروق وقرح الفراش من خدماتنا الأساسية — بنوفر أعلى معايير التعقيم والرعاية في منزلك. 🩹'
  }
  if (msg.includes('محلول') || msg.includes('سيروم') || msg.includes('وريد')) {
    return 'تركيب المحاليل الوريدية والكانيولا بيتم في المنزل بأمان تام على أيدي ممرضين متخصصين. تواصل معنا للحجز! 💊'
  }
  if (msg.includes('طوارئ') || msg.includes('إسعاف') || msg.includes('مستعجل')) {
    return '⚠️ في الحالات الطارئة الحرجة اتصل فوراً بـ 123 أو روح لأقرب مستشفى. أما لخدمات التمريض المنزلي العادية والمتابعة، اتصل بنا على الفور! 🚑'
  }

  return `أهلاً وسهلاً! 👋 أنا مساعد نبض للتمريض المنزلي في دمياط. ممكن أساعدك في:
• معرفة خدماتنا التمريضية المنزلية
• حجز موعد أو الاستفسار عن الأسعار
• نصائح صحية عامة

تواصل معنا عبر واتساب أو الهاتف لأي مساعدة فورية! 💙`
}
