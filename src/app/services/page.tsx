import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon, CheckCircleIcon, MapPinIcon, ShieldCheckIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/solid'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import ServicesFilter from '@/components/services/ServicesFilter'
import { siteConfig } from '@/data/siteConfig'
import { pricingPolicy } from '@/data/services'

export const metadata: Metadata = {
  title: 'أسعار وخدمات التمريض المنزلي | نبض — مركز وبندر دمياط',
  description:
    'قائمة أسعار خدمات التمريض المنزلي الاسترشادية بمركز وبندر دمياط: حقن، محاليل، غيار جروح، قسطرة بولية، رايل، وسحب عينات، مع سياسة تشغيل واضحة وشفافة.',
  alternates: { canonical: 'https://nabd-nursing.vercel.app/services' },
}

// Structured data for services page
const servicesPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'خدمات وأسعار نبض للتمريض المنزلي',
  description: 'قائمة خدمات وأسعار التمريض المنزلي الاسترشادية بمركز وبندر دمياط',
  url: 'https://nabd-nursing.vercel.app/services',
}

const pricingTableData = [
  {
    service: 'الزيارة الأساسية (قياس علامات حيوية / حقن)',
    price: '100 - 150 ج.م',
    notes: 'يشمل رسوم الزيارة والفحص المبدئي وسرعة الاستجابة.',
    badge: 'الأكثر طلباً',
  },
  {
    service: 'تركيب كانيولا وتعليق محاليل وريدية',
    price: '200 - 250 ج.م',
    notes: 'يتطلب البقاء ومتابعة المريض حتى استقرار المحلول ومراقبة الوريد.',
    badge: 'متابعة مستمرة',
  },
  {
    service: 'غيار الجروح البسيطة وجروح العمليات',
    price: '150 - 250 ج.م',
    notes: 'يعتمد السعر النهائي على اتساع الجرح والوقت المستغرق والتعقيم.',
    badge: 'تعقيم جراحي',
  },
  {
    service: 'غيار الجروح المعقدة (قرح الفراش / قدم سكري)',
    price: '250 - 400 ج.م',
    notes: 'إجراء دقيق يتطلب مهارة عالية، تعقيم صارم، ومجهوداً أكبر لعلاج الأنسجة.',
    badge: 'عناية متقدمة',
  },
  {
    service: 'تركيب قسطرة بولية (Foley)',
    price: '250 - 350 ج.م',
    notes: 'إجراء معقم بالكامل بتقنية Aseptic Technique لتجنب انتقال أي عدوى للمريض.',
    badge: 'معقم 100%',
  },
  {
    service: 'تركيب أنبوبة معدة (رايل Ryle)',
    price: '300 - 400 ج.م',
    notes: 'يتطلب دقة وخبرة سريرية لضمان المسار الصحيح للأنبوبة والتأكد من أمان المريض.',
    badge: 'دقة سريرية',
  },
  {
    service: 'سحب عينات التحاليل بالمنزل',
    price: '100 - 150 ج.م',
    notes: 'يمكن تقديمها كخدمة مستقلة أو بالتعاقد المباشر مع معامل التحاليل بدمياط.',
    badge: 'سريع وبدون ألم',
  },
  {
    service: 'جلسات الاستنشاق والرذاذ (نيبولايزر)',
    price: '100 - 150 ج.م',
    notes: 'جلسة منزلية ومتابعة التنفس ونسبة تشبع الأكسجين وتقييم استقرار الصدر.',
    badge: 'طوارئ تنفسية',
  },
  {
    service: 'شيفت تمريض منزلي (12 ساعة)',
    price: '600 - 800 ج.م',
    notes: 'يختلف حسب حالة المريض (رعاية يومية للمسنين مقابل حالات حرجة).',
    badge: 'رعاية نصف يوم',
  },
  {
    service: 'شيفت تمريض كامل (24 ساعة)',
    price: '1000 - 1500 ج.م',
    notes: 'يشمل المتابعة الشاملة والمبيت مع المريض وكافة احتياجات الرعاية الشخصية.',
    badge: 'مبيت ومتابعة',
  },
]

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }}
      />
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-primary py-8 sm:py-12">
          <div className="section-container">
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-xl transition-all group"
              >
                <ArrowRightIcon className="w-4 h-4 text-gold-400 transition-transform group-hover:translate-x-1" />
                <span>العودة للرئيسية</span>
              </Link>
              <a
                href="https://wa.me/201001097896?text=السلام+عليكم،+أريد+حجز+خدمة+تمريضية+منزلية"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline"
              >
                💬 احجز عبر واتساب
              </a>
            </div>

            <div className="text-center">
              <span className="badge bg-white/20 text-white mb-3">15 خدمة تمريضية متاحة</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                خدمات وأسعار نبض للتمريض المنزلي
              </h1>
              <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                رعاية تمريضية وطبية معقمة وموثقة داخل <strong>مركز وبندر دمياط</strong>، مع شفافية كاملة في الأسعار والخدمة المهنية.
              </p>

              {/* Zone Highlight Badge */}
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-gold-300 font-semibold">
                <MapPinIcon className="w-4 h-4 text-gold-400 shrink-0" />
                <span>التركيز الأساسي: مركز وبندر دمياط (وسط البلد، السنانية، السيالة، الشعراء)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter + Interactive Service Cards */}
        <ServicesFilter />

        {/* ── جدول الأسعار الاسترشادية الشامل ── */}
        <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
          <div className="section-container">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200 inline-block mb-2">
                شفافية التسعير
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mb-3">
                قائمة أسعار الخدمات الاسترشادية (بدون المستلزمات الطبية)
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                الأسعار المذكورة أدناه هي للخدمة المهنية (المجهود، الوقت، والتعقيم الصارم) وتغطي <strong>مركز وبندر دمياط</strong>.
              </p>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 shadow-xs mb-10">
              <table className="w-full text-start text-sm" role="table">
                <thead className="bg-navy-950 text-white">
                  <tr>
                    <th scope="col" className="py-4 px-5 text-start font-bold">الخدمة الطبية</th>
                    <th scope="col" className="py-4 px-5 text-start font-bold">متوسط السعر العادل</th>
                    <th scope="col" className="py-4 px-5 text-start font-bold">ملاحظات التنفيذ السريري</th>
                    <th scope="col" className="py-4 px-5 text-center font-bold">الحجز السريع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {pricingTableData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 font-bold text-navy-900 flex items-center gap-2">
                        <span>{item.service}</span>
                        {item.badge && (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {item.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 font-black text-emerald-700 whitespace-nowrap">
                        {item.price}
                      </td>
                      <td className="py-4 px-5 text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {item.notes}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <a
                          href={`https://wa.me/201001097896?text=${encodeURIComponent(`السلام عليكم، أود حجز خدمة: ${item.service} من نبض بدمياط.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-all"
                        >
                          حجز واتساب 💬
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 gap-3.5 md:hidden mb-10">
              {pricingTableData.map((item, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-navy-900 text-sm">{item.service}</h3>
                      {item.badge && (
                        <span className="text-[10px] font-semibold bg-white text-navy-800 border border-slate-200 px-2 py-0.5 rounded-md mt-1 inline-block">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-black text-emerald-700 text-sm bg-white px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
                      {item.price}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                    <strong className="text-navy-900 block mb-0.5">ملاحظات التنفيذ:</strong>
                    {item.notes}
                  </p>

                  <a
                    href={`https://wa.me/201001097896?text=${encodeURIComponent(`السلام عليكم، أود حجز خدمة: ${item.service} من نبض بدمياط.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp py-2.5 text-xs justify-center"
                  >
                    💬 احجز هذه الخدمة عبر واتساب
                  </a>
                </div>
              ))}
            </div>

            {/* ── استراتيجيات وسياسة التشغيل والتسعير لـ "نبض" ── */}
            <div className="mt-12 pt-10 border-t border-slate-200">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-navy-900 mb-2">
                  استراتيجيات التسعير وسياسة التشغيل لنبض
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  ضوابط واضحة وعادلة تضمن تقديم أعلى جودة طبية وتعقيم صارم لجميع أهالي دمياط.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Zone Pricing */}
                <div className="bg-gradient-to-br from-amber-50/60 via-white to-slate-50 p-5 rounded-2xl border border-amber-200/70 shadow-xs flex flex-col gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg font-bold">
                    📍
                  </div>
                  <h4 className="font-extrabold text-navy-900 text-sm">
                    تقسيم المناطق الجغرافية (Zone Pricing)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    السعر الأساسي يغطي <strong>مركز وبندر دمياط</strong> (وسط البلد، السنانية، السيالة، الشعراء، الأعصر، شطا). وتضاف رسوم انتقال إضافية (<strong>50 - 100 جنيه</strong>) للزيارات في المناطق الأبعد جغرافياً كدمياط الجديدة ورأس البر وعزبة البرج وكفر البطيخ.
                  </p>
                </div>

                {/* 2. Supplies Separation */}
                <div className="bg-gradient-to-br from-emerald-50/60 via-white to-slate-50 p-5 rounded-2xl border border-emerald-200/70 shadow-xs flex flex-col gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold">
                    🩹
                  </div>
                  <h4 className="font-extrabold text-navy-900 text-sm">
                    فصل تكلفة المستلزمات عن الخدمة المهنية
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    التسعير الموضح للخدمة المهنية (المجهود، الوقت، والتعقيم) فقط؛ لتجنب تذبذب أسعار الصيدليات. في حال طلبت أسرة المريض توفير المستلزمات (قطن، شاش، سرنجات، محاليل، كانيولات)، يتم إضافتها بسعر الصيدلية الفعلي للفاتورة بكل شفافية.
                  </p>
                </div>

                {/* 3. Emergency & Night Service */}
                <div className="bg-gradient-to-br from-sky-50/60 via-white to-slate-50 p-5 rounded-2xl border border-sky-200/70 shadow-xs flex flex-col gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center text-lg font-bold">
                    🌙
                  </div>
                  <h4 className="font-extrabold text-navy-900 text-sm">
                    تسعير الطوارئ والخدمات الليلية (24/7)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    نظراً لتقديم رعاية طبية وتمريضية على مدار 24 ساعة، تضاف زيادة بنسبة <strong>30% إلى 50%</strong> على أسعار الزيارات التي تتم في أوقات متأخرة (بعد منتصف الليل) كرسوم طوارئ وانتقال ليلية.
                  </p>
                </div>

                {/* 4. Chronic Bundles */}
                <div className="bg-gradient-to-br from-purple-50/60 via-white to-slate-50 p-5 rounded-2xl border border-purple-200/70 shadow-xs flex flex-col gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-lg font-bold">
                    🎁
                  </div>
                  <h4 className="font-extrabold text-navy-900 text-sm">
                    نظام الباقات للحالات المزمنة (خصم 10-15%)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    للمرضى الذين يتطلبون رعاية مستمرة مثل الغيار اليومي لقرح الفراش أو كورسات الحقن المتصلة أو متابعة كبار السن، نوفر <strong>باقة أسبوعية وشهرية بخصم 10% إلى 15%</strong> لضمان استقرار العلاج والتوفير على الأسرة.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Booking CTA */}
            <div className="mt-12 bg-navy-950 text-white rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="max-w-xl mx-auto relative z-10">
                <span className="text-3xl mb-2 block" aria-hidden="true">💬</span>
                <h3 className="text-xl sm:text-2xl font-black mb-3">
                  هل تحتاج لحساب تكلفة زيارة خاصة لمريضك في دمياط؟
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mb-6 leading-relaxed">
                  تواصل معنا مباشرة عبر واتساب مع ذكر موقعك في دمياط ونوع الخدمة والمستلزمات المتوفرة لديك، وسنقوم بحساب التكلفة الدقيقة وتأكيد موعد الزيارة فوراً.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href="https://wa.me/201001097896?text=السلام+عليكم،+أريد+الاستفسار+عن+تكلفة+وحجز+زيارة+تمريضية+في+دمياط"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp text-sm px-7 py-3.5 shadow-lg"
                  >
                    💬 تواصل عبر واتساب: 01001097896
                  </a>
                  <a
                    href={siteConfig.contact.callUrl}
                    className="btn-call text-sm px-6 py-3.5"
                  >
                    📞 اتصال هاتفي مباشر
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
