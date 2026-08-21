/**
 * components/sections/WhyNabd.tsx
 */

const features = [
  {
    emoji: '🏠',
    title: 'رعاية داخل المنزل',
    description: 'احنا بنيجي ليك، مش محتاج تتعب وتمشي.',
  },
  {
    emoji: '📞',
    title: 'تواصل مباشر',
    description: 'كلمنا في أي وقت عبر واتساب أو مكالمة.',
  },
  {
    emoji: '🎯',
    title: 'حسب احتياج المريض',
    description: 'كل خدمة بنقدمها حسب الحالة والتوجيه الطبي.',
  },
  {
    emoji: '📋',
    title: 'سهولة الحجز',
    description: 'احجز خدمتك في دقيقتين من هاتفك.',
  },
  {
    emoji: '🔔',
    title: 'متابعة المواعيد',
    description: 'بنذكرك بموعدك ومستعدين لأي تعديل.',
  },
  {
    emoji: '🔒',
    title: 'خصوصية المريض',
    description: 'بياناتك وبيانات مريضك في أمان تام.',
  },
]

export default function WhyNabd() {
  return (
    <section
      className="bg-gradient-section"
      aria-labelledby="why-heading"
    >
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h2 id="why-heading" className="section-title">
            ليه تختار نبض؟
          </h2>
          <p className="section-subtitle">
            خدمات تمريضية منزلية بشكل مهني وإنساني
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="nabd-card p-5 flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center text-2xl shrink-0"
                aria-hidden="true"
              >
                {feature.emoji}
              </div>
              <div>
                <h3 className="font-bold text-navy-700 text-base mb-1">{feature.title}</h3>
                <p className="text-medical-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
