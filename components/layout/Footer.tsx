'use client'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { useT } from '@/lib/i18n'

export function Footer() {
  const t = useT()
  return (
    <footer className="foot">
      <div className="container foot-grid">
        <div className="foot-brand">
          <Link href="/">
            <Image src="/logo.png" alt="TulparHub" width={160} height={58} style={{ objectFit: 'contain' }} />
          </Link>
          <p className="foot-tag">{t('footer.tag')}</p>
          <div className="foot-trust">
            <div><b>20 000+</b><span>{t('footer.trust.sku')}</span></div>
          </div>
        </div>
        <div className="foot-col">
          <h4>{t('footer.col.catalog')}</h4>
          <Link href="/catalog">{t('footer.link.parts')}</Link>
          <Link href="/catalog?type=oem">{t('footer.link.oem')}</Link>
          <Link href="/podbor">{t('footer.link.vin')}</Link>
          <Link href="/catalog">{t('footer.link.brands')}</Link>
          <Link href="/rental">{t('footer.link.rental')}</Link>
          <Link href="/catalog">{t('footer.link.new')}</Link>
        </div>
        <div className="foot-col">
          <h4>{t('footer.col.service')}</h4>
          <a href="#">{t('footer.link.delivery')}</a>
          <Link href="/warranty">{t('footer.link.warranty')}</Link>
          <a href="#">{t('footer.link.wholesale')}</a>
          <a href="#">{t('footer.link.sto')}</a>
          <a href="#">{t('footer.link.1c')}</a>
          <a href="#">{t('footer.link.docs')}</a>
        </div>
        <div className="foot-col">
          <h4>{t('footer.col.company')}</h4>
          <Link href="/about">{t('footer.link.about')}</Link>
          <a href="#">{t('footer.link.career')}</a>
          <a href="#">{t('footer.link.partners')}</a>
          <a href="#">{t('footer.link.news')}</a>
          <a href="#">{t('footer.link.kb')}</a>
        </div>
        <div className="foot-col">
          <h4>{t('footer.col.contacts')}</h4>
          <a href="tel:+77000000000">+7 (700) 000-00-00</a>
          <a href="mailto:info@tulparhub.kz">info@tulparhub.kz</a>
          <a href="#">Telegram · WhatsApp</a>
          <a href="#">{t('footer.contact.address')}</a>
        </div>
      </div>
      <div className="container foot-legal">
        <div>{t('footer.legal.rights')}</div>
        <div>{t('footer.legal.entity')}</div>
      </div>
    </footer>
  )
}
