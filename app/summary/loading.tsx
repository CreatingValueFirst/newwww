export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo spinner */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 opacity-50 blur-xl" />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-white">Зареждане на обобщение...</p>
          <p className="text-sm text-slate-400">Изчисляваме вашия ROI</p>
        </div>
      </div>
    </div>
  )
}
