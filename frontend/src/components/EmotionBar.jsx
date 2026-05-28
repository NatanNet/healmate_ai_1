/**
 * EmotionBar Component
 * Menampilkan emotion yang terdeteksi dengan confidence bar
 * Siap untuk integrasi model AI dari tim
 */

export default function EmotionBar({ emotion, confidence }) {
  // Color mapping untuk setiap emotion
  const emotionConfig = {
    anger: {
      label: '😠 Anger',
      color: 'bg-red-500',
      lightColor: 'bg-red-100',
      textColor: 'text-red-700'
    },
    anxiety: {
      label: '😰 Anxiety',
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    acceptance: {
      label: '✨ Acceptance',
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-700'
    }
  };

  const config = emotionConfig[emotion] || emotionConfig.anxiety;
  const confidencePercent = Math.round((confidence || 0) * 100);

  return (
    <div className="space-y-2">
      {/* Emotion Label */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${config.textColor}`}>
          {config.label}
        </span>
        <span className={`text-xs font-bold ${config.textColor}`}>
          {confidencePercent}%
        </span>
      </div>

      {/* Confidence Bar */}
      <div className={`w-full h-2 rounded-full ${config.lightColor} overflow-hidden`}>
        <div
          className={`h-full ${config.color} transition-all duration-500`}
          style={{ width: `${confidencePercent}%` }}
        />
      </div>

      {/* Emotion Description */}
      <p className="text-xs text-gray-500 mt-1">
        {emotion === 'anger' && 'Terdeteksi emosi marah atau frustrasi'}
        {emotion === 'anxiety' && 'Terdeteksi emosi cemas atau khawatir'}
        {emotion === 'acceptance' && 'Terdeteksi emosi positif dan penerimaan'}
      </p>
    </div>
  );
}
