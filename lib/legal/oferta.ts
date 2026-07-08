// Public offer agreement — source: TulparHub_Оферта_.docx.
// Russian is authoritative; KZ/EN are translations. Clause numbers are kept in
// the text so legal cross-references (e.g. "п. 3 ст. 396 ГК РК") stay intact.
import type { LegalContent } from './types'

export const oferta: LegalContent = {
  ru: {
    title: 'Договор публичной оферты',
    updated: 'г. Астана, 2026 г.',
    numbered: true,
    sections: [
      {
        blocks: [
          {
            type: 'p',
            text: 'Продавец — Товарищество с ограниченной ответственностью «TulparHub» (ТОО «TulparHub»), БИН 260740001461.',
          },
          {
            type: 'p',
            text: 'Покупатель — физическое или юридическое лицо, оформившее Заявку в порядке, предусмотренном настоящим Договором.',
          },
          {
            type: 'p',
            text: 'При совместном упоминании именуются «Стороны», а каждый по отдельности — «Сторона».',
          },
        ],
      },
      {
        heading: 'Предмет договора',
        blocks: [
          {
            type: 'p',
            text: '1.1. В соответствии с настоящим Договором Продавец обязуется передать Покупателю запасные части и расходные материалы для грузовых транспортных средств (далее — Товар) в ассортименте и количестве согласно Заявке Покупателя, а Покупатель обязуется принять и оплатить заказанный Товар по цене и на условиях, согласованных Сторонами.',
          },
          {
            type: 'p',
            text: '1.2. Текст настоящего Договора опубликован на сайте tulparhub.kz и является публичной офертой. Информация о Товаре, его стоимость и условия приобретения содержатся на Сайте, на который Покупатель может зайти, используя логин и пароль, указанные при регистрации.',
          },
          {
            type: 'p',
            text: '1.3. Оформление Заявки Покупателем означает, что он ознакомился с информацией об условиях приобретения Товара и полностью согласен со всеми положениями настоящего Договора.',
          },
          {
            type: 'p',
            text: '1.4. Покупатель несёт ответственность за достоверность сведений, предоставленных при регистрации и оформлении Заявки.',
          },
          {
            type: 'p',
            text: '1.5. Индивидуальная идентификация (логин и пароль) Покупателя позволяет избежать несанкционированных действий третьих лиц от имени Покупателя. Покупатель самостоятельно несёт ответственность за все возможные негативные последствия в случае передачи логина и пароля третьим лицам.',
          },
          {
            type: 'p',
            text: '1.6. Продавец является организатором маркетплейса и осуществляет поставку Товара от поставщиков Покупателю. Продавец не является производителем Товара.',
          },
        ],
      },
      {
        heading: 'Порядок заключения договора. Общие положения',
        blocks: [
          {
            type: 'p',
            text: '2.1. Текст настоящего Договора опубликован на сайте tulparhub.kz и является публичной офертой в соответствии со статьями 395, 396 Гражданского кодекса Республики Казахстан.',
          },
          { type: 'p', text: '2.2. При регистрации Покупатель выбирает тип учётной записи:' },
          {
            type: 'list',
            items: [
              'Физическое лицо: имя, номер телефона, адрес электронной почты, пароль. После регистрации Покупателю отображается розничная цена Товара;',
              'Юридическое лицо: наименование компании, БИН, номер телефона, адрес электронной почты, пароль. После авторизации Покупателю отображается оптовая цена вместо розничной.',
            ],
          },
          {
            type: 'p',
            text: '2.3. «Заявка» — оформленное Покупателем через форму на сайте tulparhub.kz заявление о намерении приобрести Товар.',
          },
          {
            type: 'p',
            text: '2.4. После получения Заявки менеджер Продавца связывается с Покупателем по телефону или в WhatsApp для согласования наличия Товара, его стоимости, адреса и способа доставки, а также порядка и способа оплаты.',
          },
          {
            type: 'p',
            text: '2.5. Договор считается заключённым с момента подтверждения менеджером Продавца условий Заявки. Оплата Товара Покупателем на основании согласованных условий является акцептом оферты, что равносильно заключению Договора (п. 3 ст. 396 ГК РК).',
          },
          {
            type: 'p',
            text: '2.6. Срок акцепта — 3 (три) календарных дня с момента направления Покупателю подтверждения Заявки. В случае если Покупатель не произвёл оплату в указанный срок, Покупатель считается отказавшимся от Заявки.',
          },
          {
            type: 'p',
            text: '2.7. Покупатель при оформлении Заявки обязан указать корректное наименование Товара, артикул либо данные транспортного средства (марка, модель, год выпуска, VIN-код), необходимые для точного подбора Товара. В случае самостоятельного подбора Товара без консультации с менеджером Продавца Покупатель несёт ответственность за правильность выбора.',
          },
          {
            type: 'p',
            text: '2.8. Продавец вправе отказать в принятии Заявки, если запрашиваемый Товар отсутствует либо его поставка невозможна. В этом случае менеджер уведомляет Покупателя.',
          },
        ],
      },
      {
        heading: 'Стоимость товара. Порядок расчётов',
        blocks: [
          {
            type: 'p',
            text: '3.1. Стоимость Товара определяется в тенге (KZT). Цены, указанные на Сайте, являются ориентировочными. Окончательная стоимость подтверждается менеджером Продавца при согласовании Заявки.',
          },
          {
            type: 'p',
            text: '3.2. Для Покупателей — физических лиц и незарегистрированных пользователей на Сайте отображается розничная цена. Для Покупателей — юридических лиц, авторизованных на Сайте, вместо розничной отображается оптовая цена.',
          },
          {
            type: 'p',
            text: '3.3. Оплата Товара может производиться через форму оплаты на Сайте (при наличии), либо на основании реквизитов, согласованных с менеджером Продавца. Доступные способы оплаты указываются на Сайте и могут быть изменены Продавцом в одностороннем порядке.',
          },
          {
            type: 'p',
            text: '3.4. Обязательство Покупателя по оплате считается исполненным с момента поступления денежных средств на расчётный счёт Продавца.',
          },
          {
            type: 'p',
            text: '3.5. Продавец вправе изменить цену Товара до момента подтверждения Заявки, уведомив об этом Покупателя. После подтверждения согласованная цена является фиксированной.',
          },
        ],
      },
      {
        heading: 'Порядок поставки и приёмки товара',
        blocks: [
          {
            type: 'p',
            text: '4.1. Адрес, способ и сроки доставки Товара согласовываются при подтверждении Заявки — через форму на Сайте (при наличии) либо посредством связи с менеджером Продавца по телефону или в WhatsApp. Актуальные способы оформления доставки указаны на Сайте.',
          },
          {
            type: 'p',
            text: '4.2. Срок поставки начинает исчисляться с момента подтверждения Заявки и оплаты Товара Покупателем. Сроки доставки являются ориентировочными и могут изменяться в зависимости от наличия Товара у поставщиков и условий перевозки. Продавец уведомляет Покупателя об изменении сроков.',
          },
          {
            type: 'p',
            text: '4.3. Риск повреждения Товара переходит к Покупателю с момента фактической передачи Товара Покупателю или перевозчику.',
          },
          {
            type: 'p',
            text: '4.4. При получении Товара Покупатель обязан проверить его количество, комплектность и видимые дефекты. Претензии по видимым недостаткам принимаются исключительно в момент приёмки.',
          },
          {
            type: 'p',
            text: '4.5. В случае обнаружения при приёмке некачественного Товара Покупатель вправе отказаться от его приёмки. Покупатель, принявший Товар с видимыми недостатками без возражений, лишается права предъявления претензий по качеству принятого Товара.',
          },
        ],
      },
      {
        heading: 'Возврат товара',
        blocks: [
          {
            type: 'p',
            text: '5.1. Возврат Товара надлежащего качества допускается не позднее 14 (четырнадцати) календарных дней с момента передачи Товара Покупателю при условии сохранения оригинальной упаковки, маркировки и товарного вида. Возврат осуществляется по согласованию с менеджером Продавца.',
          },
          { type: 'p', text: '5.2. Возврат Товара надлежащего качества осуществляется за счёт Покупателя.' },
          {
            type: 'p',
            text: '5.3. Покупатель вправе предъявить претензии, связанные со скрытыми недостатками Товара, в течение гарантийного срока, установленного производителем. Претензия направляется менеджеру Продавца с приложением заключения независимой экспертизы, подтверждающей производственный дефект.',
          },
          {
            type: 'p',
            text: '5.4. Продавец не несёт ответственности за несоответствие Товара конкретному транспортному средству, если Покупатель допустил ошибку при указании артикула, марки, модели или иных характеристик при оформлении Заявки.',
          },
        ],
      },
      {
        heading: 'Ответственность сторон',
        blocks: [
          {
            type: 'p',
            text: '6.1. В случае неисполнения или ненадлежащего исполнения обязательств Стороны несут ответственность в соответствии с действующим законодательством Республики Казахстан.',
          },
          {
            type: 'p',
            text: '6.2. Продавец не несёт ответственности за задержку исполнения Заявки, если она вызвана действиями поставщиков, транспортных компаний или иных третьих лиц.',
          },
          {
            type: 'p',
            text: '6.3. Продавец не несёт ответственности за несоответствие Товара конкретному транспортному средству в случае ошибки Покупателя при выборе артикула или указании данных автомобиля.',
          },
          {
            type: 'p',
            text: '6.4. Совокупная ответственность Продавца по настоящему Договору ограничивается стоимостью Товара, в отношении которого возникла претензия.',
          },
        ],
      },
      {
        heading: 'Обстоятельства непреодолимой силы',
        blocks: [
          {
            type: 'p',
            text: '7.1. Стороны не несут ответственности за частичное или полное неисполнение обязательств, если такое неисполнение явилось следствием обстоятельств, которые Стороны не могли предвидеть и предотвратить разумными средствами. К таким обстоятельствам относятся: пожар, стихийные бедствия, войны, военные операции любого характера, блокады, забастовки, эпидемии, а также решения органов государственной власти Республики Казахстан. В случае наступления указанных обстоятельств срок исполнения обязательств отодвигается соразмерно времени их действия.',
          },
          {
            type: 'p',
            text: '7.2. Сторона, оказавшаяся в условиях непреодолимой силы, обязана уведомить другую Сторону в течение 5 (пяти) рабочих дней с момента их наступления.',
          },
        ],
      },
      {
        heading: 'Порядок разрешения споров',
        blocks: [
          {
            type: 'p',
            text: '8.1. Все споры и разногласия, возникающие в ходе исполнения настоящего Договора, Стороны будут стремиться разрешить посредством переговоров. Срок ответа на письменную претензию — 10 (десять) рабочих дней.',
          },
          {
            type: 'p',
            text: '8.2. В случае невозможности урегулирования спора в досудебном порядке он передаётся на рассмотрение суда по месту нахождения Продавца в соответствии с действующим законодательством Республики Казахстан.',
          },
        ],
      },
      {
        heading: 'Заключительные положения',
        blocks: [
          {
            type: 'p',
            text: '9.1. Настоящий Договор вступает в силу с момента оформления Заявки Покупателем на сайте tulparhub.kz. Отсутствие подписанного между Сторонами экземпляра Договора на бумажном носителе не является основанием считать настоящий Договор незаключённым.',
          },
          {
            type: 'p',
            text: '9.2. Продавец вправе в одностороннем порядке изменять условия настоящего Договора путём публикации новой редакции на Сайте. Изменения вступают в силу с момента публикации.',
          },
          {
            type: 'p',
            text: '9.3. Регистрируясь на Сайте, Покупатель даёт согласие на обработку своих персональных данных в объёме, необходимом для исполнения настоящего Договора, в соответствии с Законом РК «О персональных данных и их защите» от 21 мая 2013 года № 94-V. Персональные данные не передаются третьим лицам, за исключением случаев, необходимых для исполнения Договора.',
          },
          {
            type: 'p',
            text: '9.4. Продавец имеет право направлять Покупателю сообщения информационного характера по контактным данным, указанным при регистрации.',
          },
          {
            type: 'p',
            text: '9.5. В части, не урегулированной настоящим Договором, Стороны руководствуются действующим законодательством Республики Казахстан.',
          },
        ],
      },
      {
        heading: 'Реквизиты продавца',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Продавец', value: 'ТОО «TulparHub»' },
              { label: 'БИН', value: '260740001461' },
              { label: 'Сайт', value: 'tulparhub.kz' },
            ],
          },
        ],
      },
    ],
  },
  kz: {
    title: 'Жария оферта шарты',
    updated: 'Астана қ., 2026 ж.',
    numbered: true,
    sections: [
      {
        blocks: [
          {
            type: 'p',
            text: 'Сатушы — «TulparHub» жауапкершілігі шектеулі серіктестігі («TulparHub» ЖШС), БСН 260740001461.',
          },
          {
            type: 'p',
            text: 'Сатып алушы — осы Шартта көзделген тәртіппен Өтінім ресімдеген жеке немесе заңды тұлға.',
          },
          {
            type: 'p',
            text: 'Бірлесіп аталғанда «Тараптар», ал жеке-жеке «Тарап» деп аталады.',
          },
        ],
      },
      {
        heading: 'Шарттың мәні',
        blocks: [
          {
            type: 'p',
            text: '1.1. Осы Шартқа сәйкес Сатушы Сатып алушыға жүк көліктеріне арналған қосалқы бөлшектер мен шығын материалдарын (бұдан әрі — Тауар) Сатып алушының Өтініміне сай түр-түрі мен санында беруге міндеттенеді, ал Сатып алушы тапсырыс берілген Тауарды Тараптар келіскен баға мен шарттарда қабылдап, төлеуге міндеттенеді.',
          },
          {
            type: 'p',
            text: '1.2. Осы Шарттың мәтіні tulparhub.kz сайтында жарияланған және жария оферта болып табылады. Тауар туралы ақпарат, оның құны мен сатып алу шарттары Сайтта орналасқан, оған Сатып алушы тіркелу кезінде көрсеткен логин мен құпиясөзді пайдаланып кіре алады.',
          },
          {
            type: 'p',
            text: '1.3. Сатып алушының Өтінімді ресімдеуі оның Тауарды сатып алу шарттары туралы ақпаратпен танысқанын және осы Шарттың барлық ережелерімен толық келісетінін білдіреді.',
          },
          {
            type: 'p',
            text: '1.4. Сатып алушы тіркелу және Өтінімді ресімдеу кезінде ұсынылған мәліметтердің дұрыстығы үшін жауапты болады.',
          },
          {
            type: 'p',
            text: '1.5. Сатып алушыны жеке сәйкестендіру (логин мен құпиясөз) үшінші тұлғалардың Сатып алушы атынан рұқсатсыз әрекеттерінен сақтайды. Логин мен құпиясөзді үшінші тұлғаларға берген жағдайда туындауы мүмкін барлық жағымсыз салдар үшін Сатып алушы дербес жауап береді.',
          },
          {
            type: 'p',
            text: '1.6. Сатушы маркетплейс ұйымдастырушысы болып табылады және Тауарды жеткізушілерден Сатып алушыға жеткізуді жүзеге асырады. Сатушы Тауар өндірушісі емес.',
          },
        ],
      },
      {
        heading: 'Шарт жасасу тәртібі. Жалпы ережелер',
        blocks: [
          {
            type: 'p',
            text: '2.1. Осы Шарттың мәтіні tulparhub.kz сайтында жарияланған және Қазақстан Республикасы Азаматтық кодексінің 395, 396-баптарына сәйкес жария оферта болып табылады.',
          },
          { type: 'p', text: '2.2. Тіркелу кезінде Сатып алушы есептік жазба түрін таңдайды:' },
          {
            type: 'list',
            items: [
              'Жеке тұлға: аты, телефон нөмірі, электрондық пошта мекенжайы, құпиясөз. Тіркелгеннен кейін Сатып алушыға Тауардың бөлшек бағасы көрсетіледі;',
              'Заңды тұлға: компания атауы, БСН, телефон нөмірі, электрондық пошта мекенжайы, құпиясөз. Авторизациядан кейін Сатып алушыға бөлшек бағаның орнына көтерме баға көрсетіледі.',
            ],
          },
          {
            type: 'p',
            text: '2.3. «Өтінім» — Сатып алушының tulparhub.kz сайтындағы форма арқылы ресімдеген Тауарды сатып алу ниеті туралы өтініші.',
          },
          {
            type: 'p',
            text: '2.4. Өтінімді алғаннан кейін Сатушының менеджері Тауардың бар-жоғын, оның құнын, жеткізу мекенжайы мен тәсілін, сондай-ақ төлем тәртібі мен тәсілін келісу үшін Сатып алушымен телефон немесе WhatsApp арқылы байланысады.',
          },
          {
            type: 'p',
            text: '2.5. Шарт Сатушының менеджері Өтінім шарттарын растаған сәттен бастап жасалды деп есептеледі. Сатып алушының келісілген шарттар негізінде Тауарды төлеуі оферта акцепті болып табылады, бұл Шарт жасасуға тең (ҚР АК 396-бабының 3-тармағы).',
          },
          {
            type: 'p',
            text: '2.6. Акцепт мерзімі — Сатып алушыға Өтінім растамасы жіберілген сәттен бастап 3 (үш) күнтізбелік күн. Егер Сатып алушы көрсетілген мерзімде төлем жасамаса, Сатып алушы Өтінімнен бас тартты деп есептеледі.',
          },
          {
            type: 'p',
            text: '2.7. Сатып алушы Өтінімді ресімдеу кезінде Тауарды дәл таңдау үшін қажетті Тауардың дұрыс атауын, артикулын не көлік құралының деректерін (маркасы, моделі, шығарылған жылы, VIN-коды) көрсетуге міндетті. Сатушының менеджерімен кеңеспей Тауарды өз бетінше таңдаған жағдайда таңдаудың дұрыстығы үшін Сатып алушы жауапты болады.',
          },
          {
            type: 'p',
            text: '2.8. Егер сұралған Тауар болмаса немесе оны жеткізу мүмкін болмаса, Сатушы Өтінімді қабылдаудан бас тартуға құқылы. Бұл жағдайда менеджер Сатып алушыны хабардар етеді.',
          },
        ],
      },
      {
        heading: 'Тауар құны. Есеп айырысу тәртібі',
        blocks: [
          {
            type: 'p',
            text: '3.1. Тауар құны теңгемен (KZT) айқындалады. Сайтта көрсетілген бағалар бағдарлық болып табылады. Түпкілікті құн Өтінімді келісу кезінде Сатушының менеджерімен расталады.',
          },
          {
            type: 'p',
            text: '3.2. Сатып алушылар — жеке тұлғалар мен тіркелмеген пайдаланушылар үшін Сайтта бөлшек баға көрсетіледі. Сайтта авторизацияланған заңды тұлғалар — Сатып алушылар үшін бөлшек бағаның орнына көтерме баға көрсетіледі.',
          },
          {
            type: 'p',
            text: '3.3. Тауарды төлеу Сайттағы төлем формасы арқылы (бар болса) немесе Сатушының менеджерімен келісілген деректемелер негізінде жүргізілуі мүмкін. Қолжетімді төлем тәсілдері Сайтта көрсетіледі және оларды Сатушы біржақты тәртіппен өзгерте алады.',
          },
          {
            type: 'p',
            text: '3.4. Сатып алушының төлеу жөніндегі міндеттемесі ақша қаражаты Сатушының есеп айырысу шотына түскен сәттен бастап орындалды деп есептеледі.',
          },
          {
            type: 'p',
            text: '3.5. Сатушы Өтінім расталғанға дейін Тауар бағасын Сатып алушыны хабардар ете отырып өзгертуге құқылы. Растағаннан кейін келісілген баға тіркелген болып табылады.',
          },
        ],
      },
      {
        heading: 'Тауарды жеткізу және қабылдау тәртібі',
        blocks: [
          {
            type: 'p',
            text: '4.1. Тауарды жеткізу мекенжайы, тәсілі мен мерзімдері Өтінімді растау кезінде — Сайттағы форма арқылы (бар болса) не Сатушының менеджерімен телефон немесе WhatsApp арқылы байланыс жасау арқылы келісіледі. Жеткізуді ресімдеудің өзекті тәсілдері Сайтта көрсетілген.',
          },
          {
            type: 'p',
            text: '4.2. Жеткізу мерзімі Өтінім расталып, Сатып алушы Тауарды төлеген сәттен бастап есептеле бастайды. Жеткізу мерзімдері бағдарлық болып табылады және жеткізушілердегі Тауардың бар-жоғына әрі тасымалдау шарттарына байланысты өзгеруі мүмкін. Сатушы мерзімдердің өзгеруі туралы Сатып алушыны хабардар етеді.',
          },
          {
            type: 'p',
            text: '4.3. Тауардың бүліну қаупі Тауар Сатып алушыға немесе тасымалдаушыға нақты берілген сәттен бастап Сатып алушыға ауысады.',
          },
          {
            type: 'p',
            text: '4.4. Тауарды алу кезінде Сатып алушы оның санын, жиынтықтылығын және көзге көрінетін ақауларын тексеруге міндетті. Көзге көрінетін кемшіліктер бойынша шағымдар тек қабылдау сәтінде қабылданады.',
          },
          {
            type: 'p',
            text: '4.5. Қабылдау кезінде сапасыз Тауар анықталған жағдайда Сатып алушы оны қабылдаудан бас тартуға құқылы. Көзге көрінетін кемшіліктері бар Тауарды қарсылықсыз қабылдаған Сатып алушы қабылданған Тауардың сапасы бойынша шағым білдіру құқығынан айырылады.',
          },
        ],
      },
      {
        heading: 'Тауарды қайтару',
        blocks: [
          {
            type: 'p',
            text: '5.1. Тиісті сападағы Тауарды қайтаруға түпнұсқа қаптама, таңбалау және тауарлық түр сақталған жағдайда Тауар Сатып алушыға берілген сәттен бастап 14 (он төрт) күнтізбелік күннен кешіктірмей жол беріледі. Қайтару Сатушының менеджерімен келісім бойынша жүзеге асырылады.',
          },
          { type: 'p', text: '5.2. Тиісті сападағы Тауарды қайтару Сатып алушының есебінен жүзеге асырылады.' },
          {
            type: 'p',
            text: '5.3. Сатып алушы Тауардың жасырын кемшіліктерімен байланысты шағымдарды өндіруші белгілеген кепілдік мерзімі ішінде білдіруге құқылы. Шағым өндірістік ақауды растайтын тәуелсіз сараптама қорытындысын қоса тіркей отырып Сатушының менеджеріне жіберіледі.',
          },
          {
            type: 'p',
            text: '5.4. Егер Сатып алушы Өтінімді ресімдеу кезінде артикулды, марканы, модельді немесе өзге сипаттамаларды көрсетуде қателік жіберсе, Сатушы Тауардың нақты көлік құралына сәйкессіздігі үшін жауап бермейді.',
          },
        ],
      },
      {
        heading: 'Тараптардың жауапкершілігі',
        blocks: [
          {
            type: 'p',
            text: '6.1. Міндеттемелерді орындамаған немесе тиісінше орындамаған жағдайда Тараптар Қазақстан Республикасының қолданыстағы заңнамасына сәйкес жауапты болады.',
          },
          {
            type: 'p',
            text: '6.2. Егер Өтінімді орындаудың кешіктірілуі жеткізушілердің, көлік компанияларының немесе өзге үшінші тұлғалардың әрекеттерінен туындаса, Сатушы ол үшін жауап бермейді.',
          },
          {
            type: 'p',
            text: '6.3. Артикулды таңдауда немесе автокөлік деректерін көрсетуде Сатып алушының қателігі болған жағдайда Сатушы Тауардың нақты көлік құралына сәйкессіздігі үшін жауап бермейді.',
          },
          {
            type: 'p',
            text: '6.4. Осы Шарт бойынша Сатушының жиынтық жауапкершілігі шағым туындаған Тауардың құнымен шектеледі.',
          },
        ],
      },
      {
        heading: 'Еңсерілмейтін күш жағдайлары',
        blocks: [
          {
            type: 'p',
            text: '7.1. Тараптар міндеттемелерді ішінара немесе толық орындамағаны үшін, егер мұндай орындамау Тараптар алдын ала болжай және ақылға қонымды құралдармен болдырмай алмайтын жағдайлардың салдары болса, жауап бермейді. Мұндай жағдайларға: өрт, дүлей апаттар, соғыстар, кез келген сипаттағы әскери операциялар, блокадалар, ереуілдер, эпидемиялар, сондай-ақ Қазақстан Республикасының мемлекеттік билік органдарының шешімдері жатады. Аталған жағдайлар туындаған кезде міндеттемелерді орындау мерзімі олардың әрекет ету уақытына мөлшерлес ұзартылады.',
          },
          {
            type: 'p',
            text: '7.2. Еңсерілмейтін күш жағдайына тап болған Тарап екінші Тарапты олар туындаған сәттен бастап 5 (бес) жұмыс күні ішінде хабардар етуге міндетті.',
          },
        ],
      },
      {
        heading: 'Дауларды шешу тәртібі',
        blocks: [
          {
            type: 'p',
            text: '8.1. Осы Шартты орындау барысында туындайтын барлық дауларды және келіспеушіліктерді Тараптар келіссөздер арқылы шешуге ұмтылады. Жазбаша шағымға жауап беру мерзімі — 10 (он) жұмыс күні.',
          },
          {
            type: 'p',
            text: '8.2. Дауды сотқа дейінгі тәртіппен реттеу мүмкін болмаған жағдайда ол Қазақстан Республикасының қолданыстағы заңнамасына сәйкес Сатушының орналасқан жері бойынша сотқа беріледі.',
          },
        ],
      },
      {
        heading: 'Қорытынды ережелер',
        blocks: [
          {
            type: 'p',
            text: '9.1. Осы Шарт Сатып алушы tulparhub.kz сайтында Өтінім ресімдеген сәттен бастап күшіне енеді. Тараптар арасында қағаз тасығыштағы қол қойылған Шарт данасының болмауы осы Шартты жасалмаған деп есептеуге негіз болмайды.',
          },
          {
            type: 'p',
            text: '9.2. Сатушы осы Шарттың талаптарын Сайтта жаңа редакцияны жариялау арқылы біржақты тәртіппен өзгертуге құқылы. Өзгерістер жарияланған сәттен бастап күшіне енеді.',
          },
          {
            type: 'p',
            text: '9.3. Сайтта тіркелу арқылы Сатып алушы ҚР «Дербес деректер және оларды қорғау туралы» 2013 жылғы 21 мамырдағы № 94-V Заңына сәйкес осы Шартты орындау үшін қажетті көлемде өз дербес деректерін өңдеуге келісім береді. Дербес деректер Шартты орындау үшін қажет жағдайларды қоспағанда үшінші тұлғаларға берілмейді.',
          },
          {
            type: 'p',
            text: '9.4. Сатушы тіркелу кезінде көрсетілген байланыс деректері бойынша Сатып алушыға ақпараттық сипаттағы хабарламалар жіберуге құқылы.',
          },
          {
            type: 'p',
            text: '9.5. Осы Шартпен реттелмеген бөлігінде Тараптар Қазақстан Республикасының қолданыстағы заңнамасын басшылыққа алады.',
          },
        ],
      },
      {
        heading: 'Сатушының деректемелері',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Сатушы', value: '«TulparHub» ЖШС' },
              { label: 'БСН', value: '260740001461' },
              { label: 'Сайт', value: 'tulparhub.kz' },
            ],
          },
        ],
      },
    ],
  },
  en: {
    title: 'Public Offer Agreement',
    updated: 'Astana, 2026',
    numbered: true,
    sections: [
      {
        blocks: [
          {
            type: 'p',
            text: 'The Seller — TulparHub Limited Liability Partnership (TulparHub LLP), BIN 260740001461.',
          },
          {
            type: 'p',
            text: 'The Buyer — an individual or legal entity that has placed an Order in the manner set out in this Agreement.',
          },
          {
            type: 'p',
            text: 'Jointly referred to as the “Parties” and individually as a “Party”.',
          },
        ],
      },
      {
        heading: 'Subject of the agreement',
        blocks: [
          {
            type: 'p',
            text: '1.1. Under this Agreement the Seller undertakes to hand over to the Buyer spare parts and consumables for trucks (the “Goods”) in the range and quantity per the Buyer’s Order, and the Buyer undertakes to accept and pay for the ordered Goods at the price and on the terms agreed by the Parties.',
          },
          {
            type: 'p',
            text: '1.2. The text of this Agreement is published at tulparhub.kz and constitutes a public offer. Information about the Goods, their price, and the terms of purchase is available on the Site, which the Buyer can access using the login and password provided at registration.',
          },
          {
            type: 'p',
            text: '1.3. Placing an Order means the Buyer has reviewed the information on the terms of purchase and fully agrees to all provisions of this Agreement.',
          },
          {
            type: 'p',
            text: '1.4. The Buyer is responsible for the accuracy of the information provided at registration and when placing an Order.',
          },
          {
            type: 'p',
            text: '1.5. Individual identification (login and password) protects the Buyer from unauthorized actions by third parties on the Buyer’s behalf. The Buyer is solely liable for any adverse consequences arising from disclosing the login and password to third parties.',
          },
          {
            type: 'p',
            text: '1.6. The Seller is the marketplace operator and delivers the Goods from suppliers to the Buyer. The Seller is not the manufacturer of the Goods.',
          },
        ],
      },
      {
        heading: 'Procedure for concluding the agreement. General provisions',
        blocks: [
          {
            type: 'p',
            text: '2.1. The text of this Agreement is published at tulparhub.kz and constitutes a public offer in accordance with Articles 395, 396 of the Civil Code of the Republic of Kazakhstan.',
          },
          { type: 'p', text: '2.2. At registration the Buyer selects an account type:' },
          {
            type: 'list',
            items: [
              'Individual: name, phone number, email address, password. After registration, the Buyer sees the retail price of the Goods;',
              'Legal entity: company name, BIN, phone number, email address, password. After authorization, the Buyer sees the wholesale price instead of the retail price.',
            ],
          },
          {
            type: 'p',
            text: '2.3. An “Order” is the Buyer’s statement of intent to purchase the Goods placed through the form at tulparhub.kz.',
          },
          {
            type: 'p',
            text: '2.4. After receiving the Order, the Seller’s manager contacts the Buyer by phone or WhatsApp to agree on the availability of the Goods, their price, the delivery address and method, and the payment procedure and method.',
          },
          {
            type: 'p',
            text: '2.5. The Agreement is deemed concluded once the Seller’s manager confirms the terms of the Order. Payment for the Goods by the Buyer on the agreed terms constitutes acceptance of the offer, equivalent to concluding the Agreement (Art. 396(3) of the Civil Code of the RK).',
          },
          {
            type: 'p',
            text: '2.6. The acceptance period is 3 (three) calendar days from the moment the Order confirmation is sent to the Buyer. If the Buyer does not pay within that period, the Buyer is deemed to have withdrawn the Order.',
          },
          {
            type: 'p',
            text: '2.7. When placing an Order, the Buyer must state the correct name of the Goods, part number, or vehicle data (make, model, year of manufacture, VIN) needed to select the Goods precisely. If the Buyer selects the Goods independently without consulting the Seller’s manager, the Buyer is responsible for the correctness of the choice.',
          },
          {
            type: 'p',
            text: '2.8. The Seller may refuse to accept an Order if the requested Goods are unavailable or cannot be supplied. In that case the manager notifies the Buyer.',
          },
        ],
      },
      {
        heading: 'Price of the goods. Settlement procedure',
        blocks: [
          {
            type: 'p',
            text: '3.1. The price of the Goods is set in tenge (KZT). Prices shown on the Site are indicative. The final price is confirmed by the Seller’s manager when the Order is agreed.',
          },
          {
            type: 'p',
            text: '3.2. Buyers who are individuals and unregistered users see the retail price on the Site. Buyers who are legal entities authorized on the Site see the wholesale price instead of the retail price.',
          },
          {
            type: 'p',
            text: '3.3. Payment for the Goods may be made through the payment form on the Site (if available) or based on details agreed with the Seller’s manager. Available payment methods are shown on the Site and may be changed by the Seller unilaterally.',
          },
          {
            type: 'p',
            text: '3.4. The Buyer’s payment obligation is deemed fulfilled once the funds are credited to the Seller’s settlement account.',
          },
          {
            type: 'p',
            text: '3.5. The Seller may change the price of the Goods before the Order is confirmed, notifying the Buyer. After confirmation, the agreed price is fixed.',
          },
        ],
      },
      {
        heading: 'Delivery and acceptance of the goods',
        blocks: [
          {
            type: 'p',
            text: '4.1. The address, method, and timing of delivery are agreed when the Order is confirmed — through the form on the Site (if available) or by contacting the Seller’s manager by phone or WhatsApp. Current delivery options are indicated on the Site.',
          },
          {
            type: 'p',
            text: '4.2. The delivery period starts from the moment the Order is confirmed and the Buyer pays for the Goods. Delivery times are indicative and may vary depending on availability at suppliers and shipping conditions. The Seller notifies the Buyer of any change in timing.',
          },
          {
            type: 'p',
            text: '4.3. The risk of damage to the Goods passes to the Buyer from the moment the Goods are actually handed over to the Buyer or the carrier.',
          },
          {
            type: 'p',
            text: '4.4. On receiving the Goods, the Buyer must check their quantity, completeness, and visible defects. Claims for visible defects are accepted only at the moment of acceptance.',
          },
          {
            type: 'p',
            text: '4.5. If defective Goods are found at acceptance, the Buyer may refuse to accept them. A Buyer who accepts Goods with visible defects without objection loses the right to bring claims about the quality of the accepted Goods.',
          },
        ],
      },
      {
        heading: 'Return of goods',
        blocks: [
          {
            type: 'p',
            text: '5.1. Return of Goods of proper quality is allowed no later than 14 (fourteen) calendar days from the moment the Goods are handed to the Buyer, provided the original packaging, marking, and marketable condition are preserved. Returns are made by agreement with the Seller’s manager.',
          },
          { type: 'p', text: '5.2. Return of Goods of proper quality is carried out at the Buyer’s expense.' },
          {
            type: 'p',
            text: '5.3. The Buyer may bring claims relating to hidden defects of the Goods within the warranty period set by the manufacturer. The claim is sent to the Seller’s manager together with the opinion of an independent examination confirming a manufacturing defect.',
          },
          {
            type: 'p',
            text: '5.4. The Seller is not liable for the Goods not matching a specific vehicle if the Buyer made an error in specifying the part number, make, model, or other characteristics when placing the Order.',
          },
        ],
      },
      {
        heading: 'Liability of the parties',
        blocks: [
          {
            type: 'p',
            text: '6.1. In the event of non-performance or improper performance of obligations, the Parties are liable in accordance with the applicable legislation of the Republic of Kazakhstan.',
          },
          {
            type: 'p',
            text: '6.2. The Seller is not liable for delay in fulfilling an Order if it is caused by the actions of suppliers, transport companies, or other third parties.',
          },
          {
            type: 'p',
            text: '6.3. The Seller is not liable for the Goods not matching a specific vehicle where the Buyer made an error in choosing the part number or specifying the vehicle data.',
          },
          {
            type: 'p',
            text: '6.4. The Seller’s aggregate liability under this Agreement is limited to the price of the Goods in respect of which the claim arose.',
          },
        ],
      },
      {
        heading: 'Force majeure',
        blocks: [
          {
            type: 'p',
            text: '7.1. The Parties are not liable for partial or complete non-performance of obligations if such non-performance resulted from circumstances the Parties could not foresee and prevent by reasonable means. Such circumstances include: fire, natural disasters, wars, military operations of any kind, blockades, strikes, epidemics, and decisions of state authorities of the Republic of Kazakhstan. When such circumstances occur, the deadline for performing obligations is extended in proportion to their duration.',
          },
          {
            type: 'p',
            text: '7.2. A Party affected by force majeure must notify the other Party within 5 (five) business days of its occurrence.',
          },
        ],
      },
      {
        heading: 'Dispute resolution',
        blocks: [
          {
            type: 'p',
            text: '8.1. The Parties will seek to resolve all disputes and disagreements arising during performance of this Agreement through negotiation. The period for responding to a written claim is 10 (ten) business days.',
          },
          {
            type: 'p',
            text: '8.2. If a dispute cannot be settled out of court, it is referred to the court at the Seller’s location in accordance with the applicable legislation of the Republic of Kazakhstan.',
          },
        ],
      },
      {
        heading: 'Final provisions',
        blocks: [
          {
            type: 'p',
            text: '9.1. This Agreement takes effect from the moment the Buyer places an Order at tulparhub.kz. The absence of a paper copy of the Agreement signed by the Parties is not grounds to treat this Agreement as not concluded.',
          },
          {
            type: 'p',
            text: '9.2. The Seller may unilaterally amend the terms of this Agreement by publishing a new version on the Site. Amendments take effect from the moment of publication.',
          },
          {
            type: 'p',
            text: '9.3. By registering on the Site, the Buyer consents to the processing of their personal data to the extent necessary to perform this Agreement, in accordance with the Law of the RK “On Personal Data and Its Protection” dated 21 May 2013 No. 94-V. Personal data is not transferred to third parties except where necessary to perform the Agreement.',
          },
          {
            type: 'p',
            text: '9.4. The Seller may send the Buyer messages of an informational nature to the contact details provided at registration.',
          },
          {
            type: 'p',
            text: '9.5. In matters not regulated by this Agreement, the Parties are governed by the applicable legislation of the Republic of Kazakhstan.',
          },
        ],
      },
      {
        heading: 'Seller’s details',
        blocks: [
          {
            type: 'fields',
            items: [
              { label: 'Seller', value: 'TulparHub LLP' },
              { label: 'BIN', value: '260740001461' },
              { label: 'Website', value: 'tulparhub.kz' },
            ],
          },
        ],
      },
    ],
  },
}
