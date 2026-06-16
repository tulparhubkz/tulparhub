import Link from 'next/link'

export function Footer() {
  return (
    <footer className="foot">
      <div className="container foot-grid">
        <div className="foot-brand">
          <div className="logo">
            <span className="logo-text" style={{ color: '#fff', fontSize: 24 }}>
              TULPAR<span style={{ color: 'var(--gold)' }}>HUB</span>
            </span>
          </div>
          <p className="foot-tag">Грузовые запчасти и аренда спецтехники · с 2026 года.</p>
          <div className="foot-trust">
            <div><b>20 000+</b><span>SKU на складах</span></div>
          </div>
        </div>
        <div className="foot-col">
          <h4>Каталог</h4>
          <Link href="/catalog">Запчасти</Link>
          <Link href="/catalog?type=oem">Поиск по OEM-номеру</Link>
          <Link href="/podbor">Подбор по VIN</Link>
          <Link href="/catalog">Бренды</Link>
          <Link href="/rental">Аренда техники</Link>
          <Link href="/catalog">Новые поступления</Link>
        </div>
        <div className="foot-col">
          <h4>Сервис</h4>
          <a href="#">Доставка и оплата</a>
          <a href="#">Гарантия и возврат</a>
          <a href="#">Оптовикам</a>
          <a href="#">Для СТО</a>
          <a href="#">1С-интеграция</a>
          <a href="#">Документы</a>
        </div>
        <div className="foot-col">
          <h4>Компания</h4>
          <a href="#">О нас</a>
          <a href="#">Карьера</a>
          <a href="#">Партнёрам</a>
          <a href="#">Новости</a>
          <a href="#">База знаний</a>
        </div>
        <div className="foot-col">
          <h4>Контакты</h4>
          <a href="tel:+77000000000">+7 (700) 000-00-00</a>
          <a href="mailto:info@tulparhub.kz">info@tulparhub.kz</a>
          <a href="#">Telegram · WhatsApp</a>
          <a href="#">ул. Райымбека 348А, Алматы</a>
        </div>
      </div>
      <div className="container foot-legal">
        <div>TulparHub © 2024–2025 · Все права защищены</div>
        <div>ТОО «TulparHub» · БИН 200140000000</div>
      </div>
    </footer>
  )
}
