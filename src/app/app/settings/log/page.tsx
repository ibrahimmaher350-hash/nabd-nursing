'use client'

import React, { useState } from 'react'
import SettingsNav from '../components/SettingsNav'
import {
  ShieldCheckIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  BanknotesIcon,
  DocumentTextIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

interface AuditLogItem {
  id: string
  time: string
  action: 'view' | 'create' | 'update' | 'financial' | 'auth'
  title: string
  details: string
  operator: string
  ip: string
}

const mockLogs: AuditLogItem[] = [
  {
    id: 'log-1',
    time: '2026-11-10 10:45 ص',
    action: 'view',
    title: 'فتح ومعاينة ملف طبي',
    details: 'تم فتح الملف الطبي للمريض محمود عبد الرحمن (58f57634...) ومعاينة التحاليل',
    operator: 'إبراهيم ماهر (المدير)',
    ip: '197.35.x.x · دمياط',
  },
  {
    id: 'log-2',
    time: '2026-11-10 10:30 ص',
    action: 'financial',
    title: 'تسجيل تحصيل زيارة',
    details: 'تحصيل فاتورة 300 ج.م للمريض محمود عبد الرحمن (كانيولا ومحاليل وريدية)',
    operator: 'نظام الاستقبال',
    ip: '197.35.x.x',
  },
  {
    id: 'log-3',
    time: '2026-11-10 09:15 ص',
    action: 'create',
    title: 'تسجيل مريض واستقبال سريع',
    details: 'تسجيل كشف جديد للمريضة منى السيد إبراهيم وحفظ ملخص المساعد الذكي',
    operator: 'إبراهيم ماهر',
    ip: '197.35.x.x',
  },
  {
    id: 'log-4',
    time: '2026-11-10 08:00 ص',
    action: 'auth',
    title: 'تسجيل دخول آمن للوحة',
    details: 'التحقق الناجح من رمز المرور السري (PIN) وبدء جلسة جديدة',
    operator: 'إبراهيم ماهر',
    ip: '197.35.x.x',
  },
  {
    id: 'log-5',
    time: '2026-11-09 11:30 م',
    action: 'financial',
    title: 'تقفيل يومية الوردية',
    details: 'إغلاق اليومية المالية وحفظ إجمالي الإيراد 2,400 ج.م',
    operator: 'إبراهيم ماهر',
    ip: '197.35.x.x',
  },
  {
    id: 'log-6',
    time: '2026-11-09 06:20 م',
    action: 'update',
    title: 'تحديث بيانات الحساسية',
    details: 'إضافة تنبيه حساسية البنسلين في ملف المريضة منى السيد إبراهيم',
    operator: 'إبراهيم ماهر',
    ip: '197.35.x.x',
  },
]

export default function SettingsLogPage() {
  const [filterAction, setFilterAction] = useState<string>('all')

  const filteredLogs = mockLogs.filter((l) => {
    if (filterAction === 'all') return true
    return l.action === filterAction
  })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">سجل العمليات والأمان (Audit Trail)</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          تسجيل لحظي لكل عملية فتح لملف مريض، تعديل، تحصيل، أو دخول للنظام لضمان أعلى معايير الخصوصية
        </p>
      </div>

      <SettingsNav />

      {/* Security Privacy Notice */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-navy-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <ShieldCheckIcon className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-white">بيانات مرضاك في أمان تام ومعزولة</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              كل فتح لملف مريض بيتسجّل بتوقيته وبيانات الجهاز المشغل، وملفات المرضى لا يتم تصديرها لأي طرف ثالث.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'جميع العمليات' },
          { id: 'view', label: 'فتح الملفات' },
          { id: 'create', label: 'تسجيل المرضى' },
          { id: 'financial', label: 'التحصيل والمالية' },
          { id: 'auth', label: 'تسجيل الدخول' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterAction(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterAction === f.id
                ? 'bg-gold-500 text-navy-950 font-black shadow-xs'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Logs Timeline */}
      <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">
            عرض {filteredLogs.length} عملية مسجلة
          </span>
          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            التسجيل التلقائي نشط
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-850/40 transition flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    log.action === 'view'
                      ? 'bg-blue-950 text-blue-400 border-blue-500/30'
                      : log.action === 'financial'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                      : log.action === 'auth'
                      ? 'bg-gold-950 text-gold-400 border-gold-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {log.action === 'view' && <EyeIcon className="w-4 h-4" />}
                  {log.action === 'financial' && <BanknotesIcon className="w-4 h-4" />}
                  {log.action === 'auth' && <ShieldCheckIcon className="w-4 h-4" />}
                  {log.action === 'create' && <UserIcon className="w-4 h-4" />}
                  {log.action === 'update' && <DocumentTextIcon className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-white">{log.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {log.operator}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{log.details}</p>
                  <p className="text-[10px] text-slate-500 font-mono" dir="ltr">
                    IP: {log.ip}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap shrink-0" dir="ltr">
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
