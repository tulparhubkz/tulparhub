// Company requisites. The company identity (name, BIN, site) is taken from the
// legal docs; bank details / legal address / director are NOT in any provided
// document and are marked TODO for the PM to fill in before payment onboarding.
import type { LegalContent } from './types'

// Shared placeholder for fields the PM still needs to supply.
const TODO = '[уточняется]'
const TODO_KZ = '[нақтыланады]'
const TODO_EN = '[to be provided]'

export const requisites: LegalContent = {
  ru: {
    title: 'Реквизиты',
    updated: 'г. Астана, 2026 г.',
    intro: 'Полные реквизиты продавца — ТОО «TulparHub».',
    sections: [
      {
        heading: 'Юридические данные',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Полное наименование', value: 'Товарищество с ограниченной ответственностью «TulparHub»' },
              { label: 'Сокращённое наименование', value: 'ТОО «TulparHub»' },
              { label: 'БИН', value: '260740001461' },
              { label: 'Юридический адрес', value: TODO },
              { label: 'Фактический адрес', value: TODO },
              { label: 'Директор', value: TODO },
            ],
          },
        ],
      },
      {
        heading: 'Банковские реквизиты',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Банк', value: TODO },
              { label: 'IBAN (расчётный счёт)', value: TODO },
              { label: 'БИК', value: TODO },
              { label: 'Кбе', value: TODO },
            ],
          },
          {
            type: 'note',
            text: 'Банковские реквизиты уточняются и будут опубликованы до подключения онлайн-оплаты.',
          },
        ],
      },
      {
        heading: 'Контакты',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Сайт', value: 'tulparhub.kz' },
              { label: 'Телефон', value: '+7 (700) 000-00-00' },
              { label: 'E-mail', value: 'info@tulparhub.kz' },
            ],
          },
        ],
      },
    ],
  },
  kz: {
    title: 'Деректемелер',
    updated: 'Астана қ., 2026 ж.',
    intro: 'Сатушының толық деректемелері — «TulparHub» ЖШС.',
    sections: [
      {
        heading: 'Заңды деректер',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Толық атауы', value: '«TulparHub» жауапкершілігі шектеулі серіктестігі' },
              { label: 'Қысқартылған атауы', value: '«TulparHub» ЖШС' },
              { label: 'БСН', value: '260740001461' },
              { label: 'Заңды мекенжайы', value: TODO_KZ },
              { label: 'Нақты мекенжайы', value: TODO_KZ },
              { label: 'Директор', value: TODO_KZ },
            ],
          },
        ],
      },
      {
        heading: 'Банктік деректемелер',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Банк', value: TODO_KZ },
              { label: 'IBAN (есеп айырысу шоты)', value: TODO_KZ },
              { label: 'БСК', value: TODO_KZ },
              { label: 'Кбе', value: TODO_KZ },
            ],
          },
          {
            type: 'note',
            text: 'Банктік деректемелер нақтыланып, онлайн төлемді қосу алдында жарияланады.',
          },
        ],
      },
      {
        heading: 'Байланыс',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Сайт', value: 'tulparhub.kz' },
              { label: 'Телефон', value: '+7 (700) 000-00-00' },
              { label: 'E-mail', value: 'info@tulparhub.kz' },
            ],
          },
        ],
      },
    ],
  },
  en: {
    title: 'Company Details',
    updated: 'Astana, 2026',
    intro: 'Full details of the seller — TulparHub LLP.',
    sections: [
      {
        heading: 'Legal information',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Full name', value: 'TulparHub Limited Liability Partnership' },
              { label: 'Short name', value: 'TulparHub LLP' },
              { label: 'BIN', value: '260740001461' },
              { label: 'Legal address', value: TODO_EN },
              { label: 'Actual address', value: TODO_EN },
              { label: 'Director', value: TODO_EN },
            ],
          },
        ],
      },
      {
        heading: 'Bank details',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Bank', value: TODO_EN },
              { label: 'IBAN (account)', value: TODO_EN },
              { label: 'BIC', value: TODO_EN },
              { label: 'Kbe', value: TODO_EN },
            ],
          },
          {
            type: 'note',
            text: 'Bank details are being finalized and will be published before online payment is enabled.',
          },
        ],
      },
      {
        heading: 'Contacts',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Website', value: 'tulparhub.kz' },
              { label: 'Phone', value: '+7 (700) 000-00-00' },
              { label: 'E-mail', value: 'info@tulparhub.kz' },
            ],
          },
        ],
      },
    ],
  },
}
