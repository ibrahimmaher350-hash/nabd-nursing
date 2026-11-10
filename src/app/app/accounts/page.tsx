'use client'

import React, { useState } from 'react'
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ReceiptPercentIcon,
  CheckBadgeIcon,
  PrinterIcon,
  PlusIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline'
import { siteConfig } from '@/data/siteConfig'

interface TransactionItem {
  id: string
  time: string
  patient: string
  service: string
  zone: string
  professionalFee: number
  travelFee: number
  suppliesCost: number
  total: number
  paymentMethod: 'نقدي (كاش)' | 'فودافون كاش / إنستاباي'
}

const initialTransactions: TransactionItem[] = [
  {
    id: 'tx-1',
    time: '10:30 ص',
    patient: 'محمود عبد الرحمن',
    service: 'كانيولا ومحاليل وريدية',
    zone: 'مركز وبندر دمياط',
    professionalFee: 250,
    travelFee: 0,
    suppliesCost: 50,
    total: 300,
    paymentMethod: 'نقدي (كاش)',
  },
  {
    id: 'tx-2',
    time: '12:00 م',
    patient: 'منى السيد إبراهيم',
    service: 'غيار جروح بسيطة وحقن',
    zone: 'السنانية',
    professionalFee: 200,
    travelFee: 0,
    suppliesCost: 30,
    total: 230,
    paymentMethod: 'فودافون كاش / إنستاباي',
  },
  {
    id: 'tx-3',
    time: '02:15 م',
    patient: 'كريم عادل الدسوقي',
    service: 'غيار جروح معقدة وقدم سكري',
    zone: 'الشعراء',
    professionalFee: 350,
    travelFee: 0,
    suppliesCost: 80,
    total: 430,
    paymentMethod: 'نقدي (كاش)',
  },
  {
    id: 'tx-4',
    time: '04:30 م',
    patient: 'هالة فتحي عوض',
    service: 'سحب عينات تحاليل منزلية',
    zone: 'دمياط الجديدة (منطقة خارجية)',
    professionalFee: 150,
    travelFee: 80,
    suppliesCost: 20,
    total: 250,
    paymentMethod: 'نقدي (كاش)',
  },
  {
    id: 'tx-5',
    time: '08:00 م',
    patient: 'الحاج رمضان الشرباصي',
    service: 'شيفت تمريض منزلي (12 ساعة)',
    zone: 'وسط البلد - دمياط',
    professionalFee: 800,
    travelFee: 0,
    suppliesCost: 0,
    total: 800,
    paymentMethod: 'فودافون كاش / إنستاباي',
  },
]

export default function AccountsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions)
  const [closedDay, setClosedDay] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // New Transaction Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPatient, setNewPatient] = useState('')
  const [newService, setNewService] = useState('زيارة تمريض منزلي')
  const [newZone, setNewZone] = useState('مركز وبندر دمياط')
  const [newFee, setNewFee] = useState(200)
  const [newTravel, setNewTravel] = useState(0)
  const [newSupplies, setNewSupplies] = useState(0)
  const [newMethod, setNewMethod] = useState<'نقدي (كاش)' | 'فودافون كاش / إنستاباي'>('نقدي (كاش)')

  // Calculations
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)
  const totalProfessionalFees = transactions.reduce((sum, t) => sum + t.professionalFee, 0)
  const totalTravelFees = transactions.reduce((sum, t) => sum + t.travelFee, 0)
  const totalSupplies = transactions.reduce((sum, t) => sum + t.suppliesCost, 0)
  const netIncome = totalProfessionalFees + totalTravelFees

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPatient.trim()) return

    const newTx: TransactionItem = {
      id: 'tx-' + Date.now(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true }),
      patient: newPatient,
      service: newService,
      zone: newZone,
      professionalFee: Number(newFee) || 0,
      travelFee: Number(newTravel) || 0,
      suppliesCost: Number(newSupplies) || 0,
      total: (Number(newFee) || 0) + (Number(newTravel) || 0) + (Number(newSupplies) || 0),
      paymentMethod: newMethod,
    }

    setTransactions([newTx, ...transactions])
    setShowAddModal(false)
    setNewPatient('')
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <BanknotesIcon className="w-6 h-6 text-gold-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">حسابات وتقفيل اليومية</h1>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {closedDay ? 'تم تقفيل اليومية ✓' : 'اليومية جارية'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            متابعة إيراد الزيارات، حساب رسوم الانتقال والمستلزمات، وتقفيل الوردية
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <PlusIcon className="w-4 h-4" />
            <span>تسجيل تحصيل / فاتورة</span>
          </button>

          <button
            onClick={() => setClosedDay(true)}
            disabled={closedDay}
            className={`text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 ${
              closedDay
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gold-500 hover:bg-gold-600 text-navy-950'
            }`}
          >
            <CheckBadgeIcon className="w-4 h-4" />
            <span>{closedDay ? 'تم تقفيل اليومية' : 'تقفيل يومية اليوم'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="no-print bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold p-2.5 rounded-xl transition"
            title="طباعة التقرير المالي"
          >
            <PrinterIcon className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards (Wasl Clinic style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Total Revenue */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400">إجمالي إيراد اليوم</span>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">
            {totalRevenue.toLocaleString()} <span className="text-xs font-normal text-gold-400">ج.م</span>
          </p>
          <span className="text-[10px] text-emerald-400 block font-bold">
            {transactions.length} زيارات تمريضية
          </span>
        </div>

        {/* Professional Service Fees */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400">أتعاب التمريض المهنية</span>
          <p className="text-xl sm:text-2xl font-black text-gold-400 font-mono">
            {totalProfessionalFees.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </p>
          <span className="text-[10px] text-slate-400 block font-medium">بدون مستلزمات الصيدلية</span>
        </div>

        {/* Travel Zone Fees */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400">رسوم الانتقال للمناطق</span>
          <p className="text-xl sm:text-2xl font-black text-blue-400 font-mono">
            {totalTravelFees.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </p>
          <span className="text-[10px] text-slate-400 block font-medium">خارج مركز وبندر دمياط</span>
        </div>

        {/* Net Income */}
        <div className="bg-navy-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-400">صافي التحصيل المتاح</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {netIncome.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </p>
          <span className="text-[10px] text-slate-400 block">بعد خصم المستلزمات ({totalSupplies} ج)</span>
        </div>
      </div>

      {/* Closed Day Alert if finalized */}
      {closedDay && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-navy-950 border border-emerald-500/60 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckBadgeIcon className="w-5 h-5 text-emerald-400" />
            <span>تم تقفيل يومية اليوم وحفظ إجمالي الإيرادات بنجاح. الخزينة جاهزة لليوم التالي.</span>
          </div>
          <button
            onClick={() => setClosedDay(false)}
            className="text-[11px] text-gold-400 underline hover:text-gold-300"
          >
            إعادة فتح الوردية
          </button>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-black text-white">سجل إيصالات وتحصيلات الزيارات لليوم</h2>
          <span className="text-xs text-slate-400 font-mono" dir="ltr">
            {selectedDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 text-start font-bold">الوقت</th>
                <th className="py-3 px-4 text-start font-bold">اسم المريض</th>
                <th className="py-3 px-4 text-start font-bold">الخدمة المنفذة</th>
                <th className="py-3 px-4 text-start font-bold">المنطقة الجغرافية</th>
                <th className="py-3 px-4 text-start font-bold">الأتعاب المهنية</th>
                <th className="py-3 px-4 text-start font-bold">الانتقال</th>
                <th className="py-3 px-4 text-start font-bold">المستلزمات</th>
                <th className="py-3 px-4 text-start font-bold">الإجمالي</th>
                <th className="py-3 px-4 text-start font-bold">طريقة الدفع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3 px-4 font-mono text-cyan-300" dir="ltr">
                    {t.time}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{t.patient}</td>
                  <td className="py-3 px-4 text-slate-300">{t.service}</td>
                  <td className="py-3 px-4 text-slate-400">{t.zone}</td>
                  <td className="py-3 px-4 font-mono text-gold-300 font-bold">{t.professionalFee} ج</td>
                  <td className="py-3 px-4 font-mono text-blue-300">{t.travelFee > 0 ? `+${t.travelFee} ج` : '—'}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{t.suppliesCost > 0 ? `${t.suppliesCost} ج` : '—'}</td>
                  <td className="py-3 px-4 font-mono font-black text-emerald-400 text-sm">
                    {t.total} ج
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-950 border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-lg">
                      {t.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-950 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">تسجيل تحصيل زيارة جديدة</h3>

            <form onSubmit={handleAddTx} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم المريض *</label>
                <input
                  type="text"
                  required
                  value={newPatient}
                  onChange={(e) => setNewPatient(e.target.value)}
                  placeholder="مثال: أحمد محمود"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الخدمة التمريضية</label>
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">المنطقة الجغرافية بدمياط</label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  {siteConfig.location.serviceAreas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">أتعاب الخدمة (ج)</label>
                  <input
                    type="number"
                    value={newFee}
                    onChange={(e) => setNewFee(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-center focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">رسوم انتقال (ج)</label>
                  <input
                    type="number"
                    value={newTravel}
                    onChange={(e) => setNewTravel(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-center focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">مستلزمات (ج)</label>
                  <input
                    type="number"
                    value={newSupplies}
                    onChange={(e) => setNewSupplies(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-center focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">طريقة الدفع</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="نقدي (كاش)">نقدي (كاش)</option>
                  <option value="فودافون كاش / إنستاباي">فودافون كاش / إنستاباي</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-black shadow-md"
                >
                  إضافة الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
