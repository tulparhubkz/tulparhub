'use client'
import { Ico } from '@/components/ui/Ico'

export function FloatingChat() {
  return (
    <div className="chat-bubble" onClick={() => alert('Открываем WhatsApp...')}>
      <Ico name="chat" size={22} />
      <div className="chat-tip">
        Есть вопрос?<br /><b>WhatsApp · Telegram</b>
      </div>
    </div>
  )
}
