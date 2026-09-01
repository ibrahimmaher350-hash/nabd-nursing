/**
 * lib/timeUtils.ts — نبض للتمريض المنزلي
 * 12-Hour Time & Date Formatter with Arabic Day Names, Follow-up Scheduler, and Reminder Generator.
 */

export const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
]

export const TIME_SLOTS_12H = [
  { value: '08:00 AM', label12: '08:00 AM', labelAr: '08:00 صباحاً', time24: '08:00' },
  { value: '09:00 AM', label12: '09:00 AM', labelAr: '09:00 صباحاً', time24: '09:00' },
  { value: '10:00 AM', label12: '10:00 AM', labelAr: '10:00 صباحاً', time24: '10:00' },
  { value: '11:00 AM', label12: '11:00 AM', labelAr: '11:00 صباحاً', time24: '11:00' },
  { value: '12:00 PM', label12: '12:00 PM', labelAr: '12:00 ظهراً',   time24: '12:00' },
  { value: '01:00 PM', label12: '01:00 PM', labelAr: '01:00 مساءً',  time24: '13:00' },
  { value: '02:00 PM', label12: '02:00 PM', labelAr: '02:00 مساءً',  time24: '14:00' },
  { value: '03:00 PM', label12: '03:00 PM', labelAr: '03:00 مساءً',  time24: '15:00' },
  { value: '04:00 PM', label12: '04:00 PM', labelAr: '04:00 مساءً',  time24: '16:00' },
  { value: '05:00 PM', label12: '05:00 PM', labelAr: '05:00 مساءً',  time24: '17:00' },
  { value: '06:00 PM', label12: '06:00 PM', labelAr: '06:00 مساءً',  time24: '18:00' },
  { value: '07:00 PM', label12: '07:00 PM', labelAr: '07:00 مساءً',  time24: '19:00' },
  { value: '08:00 PM', label12: '08:00 PM', labelAr: '08:00 مساءً',  time24: '20:00' },
  { value: '09:00 PM', label12: '09:00 PM', labelAr: '09:00 مساءً',  time24: '21:00' },
  { value: '10:00 PM', label12: '10:00 PM', labelAr: '10:00 مساءً',  time24: '22:00' },
]

export const FOLLOW_UP_INTERVALS = [
  { value: 'none', label: 'زيارة واحدة فقط (بدون متابعة مجدولة)', days: 0 },
  { value: '3_days', label: 'متابعة دورية بعد 3 أيام', days: 3 },
  { value: '1_week', label: 'متابعة دورية بعد أسبوع (7 أيام)', days: 7 },
  { value: '2_weeks', label: 'متابعة دورية بعد أسبوعين (14 يوم)', days: 14 },
  { value: '1_month', label: 'متابعة دورية بعد شهر (30 يوم)', days: 30 },
  { value: '3_months', label: 'متابعة دورية بعد 3 شهور (90 يوم)', days: 90 },
]

/**
 * Calculates next follow up date given base date and interval
 */
export function calculateNextFollowUpDate(baseDateStr: string, intervalKey: string): string {
  if (!baseDateStr || intervalKey === 'none') return ''
  try {
    const item = FOLLOW_UP_INTERVALS.find((i) => i.value === intervalKey)
    if (!item || item.days === 0) return ''
    const d = new Date(baseDateStr)
    if (isNaN(d.getTime())) return ''
    d.setDate(d.getDate() + item.days)
    return d.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

/**
 * Converts any time string (e.g. '14:00', '14:00:00', '2:00 PM', '02:00 م') to standard 12-Hour format '02:00 PM'
 */
export function formatTo12Hour(timeStr?: string): string {
  if (!timeStr) return ''
  const trimmed = timeStr.trim()

  // If already contains AM or PM
  if (trimmed.toUpperCase().includes('AM') || trimmed.toUpperCase().includes('PM')) {
    return trimmed.toUpperCase()
  }

  // If Arabic ص or م
  if (trimmed.includes('ص') || trimmed.includes('صباح')) {
    const clean = trimmed.replace(/[^0-9:]/g, '')
    const parts = clean.split(':')
    const h = (parts[0] || '12').padStart(2, '0')
    const m = (parts[1] || '00').padStart(2, '0')
    return `${h}:${m} AM`
  }
  if (trimmed.includes('م') || trimmed.includes('مساء')) {
    const clean = trimmed.replace(/[^0-9:]/g, '')
    const parts = clean.split(':')
    const h = (parts[0] || '12').padStart(2, '0')
    const m = (parts[1] || '00').padStart(2, '0')
    return `${h}:${m} PM`
  }

  // Assume 24-hour format HH:MM
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/)
  if (match) {
    let hour = parseInt(match[1], 10)
    const minute = match[2]
    const period = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12 || 12
    return `${hour.toString().padStart(2, '0')}:${minute} ${period}`
  }

  return trimmed
}

/**
 * Format to Arabic 12-hour: e.g. '02:00 م'
 */
export function formatTo12HourArabic(timeStr?: string): string {
  const h12 = formatTo12Hour(timeStr)
  if (h12.includes('AM')) return h12.replace('AM', 'ص').trim()
  if (h12.includes('PM')) return h12.replace('PM', 'م').trim()
  return h12
}

/**
 * Get Arabic Day name for a given Date
 */
export function getArabicDayName(dateInput?: string | Date): string {
  if (!dateInput) return ''
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(d.getTime())) return ''
    return ARABIC_DAYS[d.getDay()] || ''
  } catch {
    return ''
  }
}

/**
 * Format date to Arabic full string with day name: e.g. "الخميس 01/09/2026"
 */
export function formatArabicDateWithDay(dateInput?: string | Date): string {
  if (!dateInput) return ''
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(d.getTime())) return String(dateInput)
    const dayName = ARABIC_DAYS[d.getDay()]
    const yyyy = d.getFullYear()
    const mm = (d.getMonth() + 1).toString().padStart(2, '0')
    const dd = d.getDate().toString().padStart(2, '0')
    return `${dayName} ${dd}/${mm}/${yyyy}`
  } catch {
    return String(dateInput)
  }
}

/**
 * Cleans messy raw GMT / Google Sheets serializations:
 * e.g. "Tue Sep 01 2026 00:00:00 GMT+0300 (Eastern European Summer Time) Sat Dec 30 1899 14:00:00..."
 * converts into: "الثلاثاء 01/09/2026 — 02:00 م"
 */
export function cleanDateAndTimeString(raw?: string): string {
  if (!raw) return ''
  const trimmed = raw.trim()

  const lines = trimmed.split('\n')
  const cleanedLines = lines.map((line) => {
    if (line.includes('GMT') || line.includes('Eastern European') || line.includes('Standard Time') || line.includes('Summer Time')) {
      // Look for year 202X
      const yearMatch = line.match(/\b(202\d)\b/)
      // Look for time HH:MM
      const timeMatches = line.match(/(\d{1,2}):(\d{2}):(\d{2})/g)

      let dateFormatted = ''
      try {
        const firstPart = line.split('GMT')[0].trim()
        const d = new Date(firstPart)
        if (!isNaN(d.getTime()) && yearMatch) {
          dateFormatted = formatArabicDateWithDay(d)
        }
      } catch {}

      let timeFormatted = ''
      if (timeMatches && timeMatches.length > 0) {
        const lastTime = timeMatches[timeMatches.length - 1]
        const tParts = lastTime.split(':')
        timeFormatted = formatTo12HourArabic(`${tParts[0]}:${tParts[1]}`)
      }

      if (dateFormatted && timeFormatted) {
        return `📅 ${dateFormatted} — ⏰ ${timeFormatted}`
      }
      if (dateFormatted) return `📅 ${dateFormatted}`
      if (timeFormatted) return `⏰ ${timeFormatted}`
    }
    return line
  })

  return cleanedLines.join('\n')
}

/**
 * Generates the official Nabd Customer Reminder Message according to exact specification:
 */
export function buildCustomerReminderMessage(params: {
  customerName: string
  serviceName: string
  preferredDate: string
  preferredTime: string
  address: string
}): string {
  const dayDate = formatArabicDateWithDay(params.preferredDate) || params.preferredDate || ''
  const time12 = formatTo12HourArabic(params.preferredTime) || params.preferredTime || ''

  return `السلام عليكم يا أستاذ / ة ${params.customerName || 'العميل الكريم'}،
نتمنى تكون بخير وبأفضل حال. 🤍
📅 تذكير بموعد زيارة نبض للتمريض المنزلي
🩺 الخدمة المطلوبة: ${params.serviceName || 'خدمة تمريضية'}
📆 التاريخ: ${dayDate}
⏰ الساعة: ${time12}
📍 مكان الزيارة: ${params.address || 'دمياط'}
🤍 بنفكّرك بموعد الزيارة علشان نضمن انتظام الرعاية وتقديم الخدمة في الموعد المحدد، ونتمنى إن الزيارة تكون سبب في راحتك واطمئنانك.
🏥 نبض للتمريض المنزلي
رعايتك الصحية تبدأ من مكانك، ونحن أقرب إليك. 💙`
}
