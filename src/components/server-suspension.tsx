"use client";

import React from "react";

export function ServerSuspensionOverlay() {
  return (
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1c1917_0%,_#09090b_100%)] text-white text-center dir-rtl">
      {/* Background Glow */}
      <div className="absolute w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-lg w-full bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Animated Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-3xl shadow-lg shadow-amber-500/10">
          <i className="fi fi-br-time-past"></i>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
          </span>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>الخدمة متوقفة مؤقتاً | Service Suspended</span>
        </div>

        {/* Arabic Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-100">
            انتهت الفترة المجانية للخادم ⏳
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            عذراً، لقد انتهت صلاحية فترة الاستضافة المجانية المخصصة لهذا الخادم. تم إيقاف خدمات الموقع مؤقتاً لحين تجديد الاشتراك أو ترقية خطة الاستضافة.
          </p>
        </div>

        <div className="h-px bg-zinc-800 my-4" />

        {/* English Section */}
        <div className="space-y-2 text-left">
          <h2 className="text-lg font-semibold text-zinc-200">
            Server Free Trial Expired
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            The free trial hosting period for this server has ended. Access to the website has been temporarily suspended until subscription renewal or server upgrade.
          </p>
        </div>
      </div>
    </div>
  );
}
