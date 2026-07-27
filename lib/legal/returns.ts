// Return & exchange policy — source: TulparHub_Положение_возврата.docx.
// Russian is authoritative; KZ/EN are translations.
import type { LegalContent } from './types'

// Warranty brand list (1 year, unlimited mileage) — shared across locales.
const BRANDS_1Y =
  'AL-KO, ANDAC, AS, AUGER, AYFAR, CEI, CONSAN, CORTECO, DAYCO, DIESEL TECHNIC, DONMEZ, FAG, FERRUM, FERSA, FSS, GLYCO, GOETZE, INA, KAHVECI, KONPAR, LUK, MAHLE, MANSONS, MERITOR, MONROE, NISSENS, NRF, NURAL, OE GERMANY, ROTA, RTS, SACHS, SE-M, SORL, VADEN, VARTA, VICTOR REINZ, WOSM, ZF'

export const returns: LegalContent = {
  ru: {
    title: 'Положение о возврате и обмене товаров',
    updated: 'Утверждено приказом Директора ТОО «TulparHub» от 8 июля 2026 г.',
    numbered: true,
    intro:
      'Положение об условиях возврата (обмена) товаров Покупателем Поставщику и о порядке обеспечения гарантийных обязательств.',
    sections: [
      {
        heading: 'Используемые термины',
        blocks: [
          {
            type: 'list',
            items: [
              'Товар — запасные части, расходные материалы и комплектующие для грузовых транспортных средств, предлагаемые к продаже на сайте tulparhub.kz.',
              'Подтверждение приобретения товара — документ, подтверждающий факт покупки товара (чек, накладная, квитанция, технический паспорт и другие документы).',
              'Акт рекламации — первичный документ для оформления возврата или гарантийного случая. Должен содержать полное описание ситуации и дефекта.',
              'Гарантийный срок — период, в течение которого товар должен соответствовать требованиям качества. В случае дефектов, возникших по вине продавца или производителя, товар подлежит бесплатному ремонту или замене.',
              'Недостаток товара — несоответствие товара установленным стандартам или условиям договора, что может включать как явные, так и скрытые дефекты.',
              'Существенный недостаток товара — дефект, который невозможно устранить без значительных затрат, времени или ресурсов.',
              'Срок годности — период времени, в течение которого товар сохраняет свои потребительские качества и может безопасно использоваться.',
              'Срок службы — время, в течение которого товар сохраняет свои функциональные характеристики при нормальных условиях эксплуатации.',
              'Срок хранения — период, в течение которого товар сохраняет свои свойства при соблюдении условий хранения.',
            ],
          },
        ],
      },
      {
        heading: 'Общие положения',
        blocks: [
          {
            type: 'p',
            text: '2.1. Настоящее Положение разработано в соответствии с Гражданским кодексом Республики Казахстан, Законом «О защите прав потребителей», в соответствии со ст. 12, 14, 25 Закона РК № 544-II от 12 апреля 2004 года «О регулировании торговой деятельности».',
          },
          {
            type: 'p',
            text: '2.2. Настоящее Положение является Приложением к Договору публичной оферты ТОО «TulparHub» (далее — «Компания»). Возврат (обмен) Товара возможен только в случаях, предусмотренных данным Положением. Иные случаи и виды возвратов допускаются только по согласованию Продавца и Покупателя.',
          },
          {
            type: 'p',
            text: '2.3. Обязательным условием всех допускаемых возвратов является целостность и чистота упаковки и товара, наличие штрих-кода с номером заказа на упаковке либо непосредственно на самой детали, а также документ, подтверждающий факт приобретения товара. При нарушенной, загрязнённой или отсутствующей упаковке Компания вправе отказать Покупателю в возврате (обмене) товара на основании статьи 454 Гражданского кодекса Республики Казахстан.',
          },
          {
            type: 'p',
            text: '2.4. Компания гарантирует соответствие качества и безопасности товаров, а также предоставляет необходимую информацию о продукции. Компания содействует покупателям в выборе товаров, обеспечивая квалифицированное обслуживание и предоставляя консультации по качеству, характеристикам и эксплуатации.',
          },
          {
            type: 'p',
            text: '2.5. Гарантийный срок начинается с момента передачи товара покупателю и продлевается на время, в течение которого товар не мог использоваться из-за недостатков. В случае замены товара гарантийный срок остаётся таким же, как и у заменённого товара, если иное не предусмотрено договором. Гарантия не распространяется на товары, срок годности или срок хранения которых истёк.',
          },
          {
            type: 'p',
            text: '2.6. В случае изменения правил продажи каких-либо групп товаров, а также в связи с любыми другими внутренними и внешними факторами, Компания оставляет за собой право изменять (дополнять) условия возврата (обмена) товара путём внесения изменений в настоящее Положение.',
          },
        ],
      },
      {
        heading: 'Условия возврата товара',
        blocks: [
          { type: 'p', text: 'Возврат товара возможен, если соблюдены следующие условия:' },
          {
            type: 'list',
            items: [
              'возврат товара возможен в течение 14 дней с момента покупки;',
              'наличие чека или накладной;',
              'сохранена упаковка и товарный вид товара;',
              'товар не использовался, не был установлен и не имеет следов эксплуатации.',
            ],
          },
        ],
      },
      {
        heading: 'Условия обмена товара',
        blocks: [
          { type: 'p', text: 'Обмен товара возможен, если соблюдены следующие условия:' },
          {
            type: 'list',
            items: [
              'обмен товара возможен в течение 14 дней с момента покупки товара;',
              'наличие чека или накладной;',
              'сохранена упаковка и товарный вид товара;',
              'товар не использовался, не был установлен и не имеет следов эксплуатации;',
              'товар может быть обменян на аналогичный товар, если случай брака либо дефекта подтверждён;',
              'товар может быть обменян на аналогичный товар, если гарантийный случай подтверждён;',
              'товар может быть обменян на любой другой товар по согласованию сторон по цене и количеству, но не больше стоимости первоначальной покупки;',
              'обмен товара невозможен, если гарантийный случай не подтверждён, отсутствует товарный вид, срок гарантии истёк, товар был ранее установлен и введён в эксплуатацию на транспортном средстве (нарушены условия возврата и гарантийной политики).',
            ],
          },
        ],
      },
      {
        heading: 'Условия предоставления гарантийных обязательств',
        blocks: [
          { type: 'p', text: 'Гарантийные обязательства действуют при соблюдении следующих условий:' },
          {
            type: 'list',
            items: [
              'наличие чека или накладной;',
              'заполненный акт рекламации от клиента;',
              'акт дефектовки от автосервиса или СТО;',
              'заключение о неработоспособности запасной части, выданное автосервисом;',
              'заказ-наряд на установку, предоставленный автосервисом;',
              'протокол компьютерной диагностики с кодом неисправности по возвращаемой запасной части (для товаров электронных групп);',
              'фото/видео фиксация обнаруженного дефекта до установки или в установленном виде на транспортном средстве.',
            ],
          },
          {
            type: 'note',
            text: 'Также требуется установка Товара квалифицированным специалистом на сертифицированной СТО, автосервисе или в дилерском центре. При этом все работы должны соответствовать регламенту производителя.',
          },
        ],
      },
      {
        heading: 'Обстоятельства, исключающие возврат (обмен) товара',
        blocks: [
          {
            type: 'list',
            items: [
              'истёк гарантийный срок;',
              'запасная часть повреждена при ДТП или неправильной эксплуатации;',
              'товар не был подобран по номеру шасси автомобиля;',
              'товар не имеет маркировки или не может быть идентифицирован;',
              'нарушение условий эксплуатации или установки товара;',
              'нарушение условий пункта 5 настоящего Положения.',
            ],
          },
          {
            type: 'note',
            text: 'Гарантия не распространяется на товары, повреждения которых произошли в результате ДТП, перегрузок, неправильного хранения, установки, эксплуатации или несоответствующего обслуживания.',
          },
        ],
      },
      {
        heading: 'Естественный износ',
        blocks: [
          {
            type: 'p',
            text: 'Гарантия не распространяется на следующие товары, подвергающиеся естественному износу: детали кузова, пластик, лампы, щётки стеклоочистителей, масла и жидкости, тормозные колодки, фильтры.',
          },
        ],
      },
      {
        heading: 'Сроки рассмотрения рекламации',
        blocks: [
          {
            type: 'p',
            text: 'Срок рассмотрения рекламации составляет 21 рабочий день с момента подачи акта рекламации. В случае необходимости дополнительной диагностики срок может быть увеличен.',
          },
          {
            type: 'p',
            text: 'Компания оставляет за собой право запросить дополнительные документы для подтверждения данных, предоставленных Покупателем.',
          },
          {
            type: 'p',
            text: 'Компания оставляет за собой право принимать решение по рекламации, основываясь на предоставленных документах, фото/видео материалах и без физического перемещения товара на склад.',
          },
        ],
      },
      {
        heading: 'Памятка покупателям. Гарантийные сроки',
        blocks: [
          {
            type: 'p',
            text: 'Приобретая запасные части и расходные материалы для грузовых транспортных средств в компании ТОО «TulparHub», вы подтверждаете, что ознакомлены с гарантийной политикой, условиями возврата товаров и принимаете на себя все риски и последствия, связанные с несоответствием условий и требований компании.',
          },
          {
            type: 'p',
            text: `Гарантийный срок на запасные части и автотовары следующих марок составляет 1 год без ограничения пробега с момента установки на транспортное средство: ${BRANDS_1Y}.`,
          },
          {
            type: 'p',
            text: 'Для продукции FEBI гарантия составляет 3 года без ограничения пробега с момента установки на транспортное средство.',
          },
        ],
      },
    ],
  },
  kz: {
    title: 'Тауарларды қайтару және айырбастау туралы ереже',
    updated: '«TulparHub» ЖШС Директорының 2026 жылғы 8 шілдедегі бұйрығымен бекітілген.',
    numbered: true,
    intro:
      'Тауарларды Сатып алушының Жеткізушіге қайтару (айырбастау) шарттары және кепілдік міндеттемелерін қамтамасыз ету тәртібі туралы ереже.',
    sections: [
      {
        heading: 'Қолданылатын терминдер',
        blocks: [
          {
            type: 'list',
            items: [
              'Тауар — tulparhub.kz сайтында сатуға ұсынылатын жүк көліктеріне арналған қосалқы бөлшектер, шығын материалдары мен жинақтауыштар.',
              'Тауарды сатып алуды растау — тауарды сатып алу фактісін растайтын құжат (чек, накладная, түбіртек, техникалық паспорт және басқа құжаттар).',
              'Рекламация актісі — қайтаруды немесе кепілдік жағдайын ресімдеуге арналған бастапқы құжат. Жағдай мен ақаудың толық сипаттамасын қамтуы тиіс.',
              'Кепілдік мерзімі — тауар сапа талаптарына сай болуы тиіс кезең. Сатушының немесе өндірушінің кінәсінен туындаған ақаулар болған жағдайда тауар тегін жөнделуге немесе ауыстырылуға жатады.',
              'Тауар кемшілігі — тауардың белгіленген стандарттарға немесе шарт талаптарына сәйкессіздігі, бұған айқын да, жасырын да ақаулар кіруі мүмкін.',
              'Тауардың елеулі кемшілігі — елеулі шығынсыз, уақытсыз немесе ресурссыз жоюға болмайтын ақау.',
              'Жарамдылық мерзімі — тауар өзінің тұтынушылық қасиеттерін сақтап, қауіпсіз пайдаланылатын уақыт кезеңі.',
              'Қызмет ету мерзімі — тауар қалыпты пайдалану жағдайында өзінің функционалдық сипаттамаларын сақтайтын уақыт.',
              'Сақтау мерзімі — сақтау шарттары сақталған кезде тауар өз қасиеттерін сақтайтын кезең.',
            ],
          },
        ],
      },
      {
        heading: 'Жалпы ережелер',
        blocks: [
          {
            type: 'p',
            text: '2.1. Осы Ереже Қазақстан Республикасының Азаматтық кодексіне, «Тұтынушылардың құқықтарын қорғау туралы» Заңға, «Сауда қызметін реттеу туралы» 2004 жылғы 12 сәуірдегі № 544-II ҚР Заңының 12, 14, 25-баптарына сәйкес әзірленген.',
          },
          {
            type: 'p',
            text: '2.2. Осы Ереже «TulparHub» ЖШС (бұдан әрі — «Компания») жария оферта Шартына Қосымша болып табылады. Тауарды қайтару (айырбастау) тек осы Ережеде көзделген жағдайларда ғана мүмкін. Өзге жағдайлар мен қайтару түрлеріне тек Сатушы мен Сатып алушының келісімі бойынша жол беріледі.',
          },
          {
            type: 'p',
            text: '2.3. Рұқсат етілген барлық қайтарулардың міндетті шарты — қаптама мен тауардың тұтастығы және тазалығы, қаптамада не бөлшектің өзінде тапсырыс нөмірі бар штрих-кодтың болуы, сондай-ақ тауарды сатып алу фактісін растайтын құжат. Қаптама бұзылған, ластанған немесе жоқ болған кезде Компания Қазақстан Республикасы Азаматтық кодексінің 454-бабы негізінде Сатып алушыға тауарды қайтарудан (айырбастаудан) бас тартуға құқылы.',
          },
          {
            type: 'p',
            text: '2.4. Компания тауарлардың сапасы мен қауіпсіздігінің сәйкестігіне кепілдік береді, сондай-ақ өнім туралы қажетті ақпаратты ұсынады. Компания сатып алушыларға тауарды таңдауда білікті қызмет көрсете отырып және сапа, сипаттамалар мен пайдалану бойынша кеңес бере отырып жәрдемдеседі.',
          },
          {
            type: 'p',
            text: '2.5. Кепілдік мерзімі тауар сатып алушыға берілген сәттен басталады және тауар кемшіліктерге байланысты пайдаланыла алмаған уақытқа ұзартылады. Тауар ауыстырылған жағдайда, егер шартта өзгеше көзделмесе, кепілдік мерзімі ауыстырылған тауардікіндей болып қалады. Кепілдік жарамдылық немесе сақтау мерзімі өтіп кеткен тауарларға қолданылмайды.',
          },
          {
            type: 'p',
            text: '2.6. Тауарлардың қандай да бір топтарын сату ережелері өзгерген жағдайда, сондай-ақ кез келген басқа ішкі және сыртқы факторларға байланысты Компания осы Ережеге өзгерістер енгізу арқылы тауарды қайтару (айырбастау) шарттарын өзгерту (толықтыру) құқығын өзінде сақтайды.',
          },
        ],
      },
      {
        heading: 'Тауарды қайтару шарттары',
        blocks: [
          { type: 'p', text: 'Тауарды қайтару мына шарттар сақталған жағдайда мүмкін:' },
          {
            type: 'list',
            items: [
              'тауарды қайтару сатып алған сәттен бастап 14 күн ішінде мүмкін;',
              'чектің немесе накладнаяның болуы;',
              'тауардың қаптамасы мен тауарлық түрі сақталған;',
              'тауар пайдаланылмаған, орнатылмаған және пайдалану іздері жоқ.',
            ],
          },
        ],
      },
      {
        heading: 'Тауарды айырбастау шарттары',
        blocks: [
          { type: 'p', text: 'Тауарды айырбастау мына шарттар сақталған жағдайда мүмкін:' },
          {
            type: 'list',
            items: [
              'тауарды айырбастау сатып алған сәттен бастап 14 күн ішінде мүмкін;',
              'чектің немесе накладнаяның болуы;',
              'тауардың қаптамасы мен тауарлық түрі сақталған;',
              'тауар пайдаланылмаған, орнатылмаған және пайдалану іздері жоқ;',
              'ақау немесе жарамсыздық жағдайы расталса, тауар ұқсас тауарға айырбасталуы мүмкін;',
              'кепілдік жағдайы расталса, тауар ұқсас тауарға айырбасталуы мүмкін;',
              'тауар тараптардың келісімі бойынша баға мен саны бойынша, бірақ бастапқы сатып алу құнынан аспайтын кез келген басқа тауарға айырбасталуы мүмкін;',
              'кепілдік жағдайы расталмаса, тауарлық түрі жоқ болса, кепілдік мерзімі өтсе, тауар бұрын көлік құралына орнатылып, пайдалануға енгізілсе (қайтару және кепілдік саясаты шарттары бұзылса), тауарды айырбастау мүмкін емес.',
            ],
          },
        ],
      },
      {
        heading: 'Кепілдік міндеттемелерін беру шарттары',
        blocks: [
          { type: 'p', text: 'Кепілдік міндеттемелері мына шарттар сақталған кезде әрекет етеді:' },
          {
            type: 'list',
            items: [
              'чектің немесе накладнаяның болуы;',
              'клиенттен толтырылған рекламация актісі;',
              'автосервистен немесе СТО-дан дефектовка актісі;',
              'автосервис берген қосалқы бөлшектің жарамсыздығы туралы қорытынды;',
              'автосервис ұсынған орнатуға арналған тапсырыс-наряд;',
              'қайтарылатын қосалқы бөлшек бойынша ақаулық кодымен компьютерлік диагностика хаттамасы (электрондық топ тауарлары үшін);',
              'орнатуға дейін немесе көлік құралына орнатылған күйінде анықталған ақаудың фото/бейне тіркеуі.',
            ],
          },
          {
            type: 'note',
            text: 'Сондай-ақ Тауарды сертификатталған СТО-да, автосервисте немесе дилерлік орталықта білікті маман орнатуы талап етіледі. Бұл ретте барлық жұмыстар өндіруші регламентіне сәйкес болуы тиіс.',
          },
        ],
      },
      {
        heading: 'Тауарды қайтаруды (айырбастауды) болдырмайтын мән-жайлар',
        blocks: [
          {
            type: 'list',
            items: [
              'кепілдік мерзімі өтті;',
              'қосалқы бөлшек ЖКО кезінде немесе дұрыс пайдаланбау салдарынан бүлінген;',
              'тауар автомобильдің шасси нөмірі бойынша таңдалмаған;',
              'тауарда таңбалау жоқ немесе оны сәйкестендіру мүмкін емес;',
              'тауарды пайдалану немесе орнату шарттарын бұзу;',
              'осы Ереженің 5-тармағы шарттарын бұзу.',
            ],
          },
          {
            type: 'note',
            text: 'Кепілдік ЖКО, шамадан тыс жүктеме, дұрыс сақтамау, орнату, пайдалану немесе тиісінше қызмет көрсетпеу салдарынан бүлінген тауарларға қолданылмайды.',
          },
        ],
      },
      {
        heading: 'Табиғи тозу',
        blocks: [
          {
            type: 'p',
            text: 'Кепілдік табиғи тозуға ұшырайтын мына тауарларға қолданылмайды: шанақ бөлшектері, пластик, шамдар, әйнек тазалағыш щёткалары, майлар мен сұйықтықтар, тежегіш колодкалары, сүзгілер.',
          },
        ],
      },
      {
        heading: 'Рекламацияны қарау мерзімдері',
        blocks: [
          {
            type: 'p',
            text: 'Рекламацияны қарау мерзімі рекламация актісі берілген сәттен бастап 21 жұмыс күнін құрайды. Қосымша диагностика қажет болған жағдайда мерзім ұзартылуы мүмкін.',
          },
          {
            type: 'p',
            text: 'Компания Сатып алушы ұсынған деректерді растау үшін қосымша құжаттар сұрату құқығын өзінде сақтайды.',
          },
          {
            type: 'p',
            text: 'Компания рекламация бойынша шешімді ұсынылған құжаттарға, фото/бейне материалдарға сүйене отырып және тауарды қоймаға физикалық жеткізбей қабылдау құқығын өзінде сақтайды.',
          },
        ],
      },
      {
        heading: 'Сатып алушыларға жаднама. Кепілдік мерзімдері',
        blocks: [
          {
            type: 'p',
            text: '«TulparHub» ЖШС компаниясынан жүк көліктеріне арналған қосалқы бөлшектер мен шығын материалдарын сатып ала отырып, сіз кепілдік саясатымен, тауарларды қайтару шарттарымен таныстығыңызды растайсыз және компанияның шарттары мен талаптарына сәйкессіздікпен байланысты барлық тәуекелдер мен салдарды өзіңізге аласыз.',
          },
          {
            type: 'p',
            text: `Мына маркалы қосалқы бөлшектер мен автотауарларға кепілдік мерзімі көлік құралына орнатылған сәттен бастап жүрісі шектелмей 1 жылды құрайды: ${BRANDS_1Y}.`,
          },
          {
            type: 'p',
            text: 'FEBI өнімі үшін кепілдік көлік құралына орнатылған сәттен бастап жүрісі шектелмей 3 жылды құрайды.',
          },
        ],
      },
    ],
  },
  en: {
    title: 'Return and Exchange Policy',
    updated: 'Approved by order of the Director of TulparHub LLP dated 8 July 2026.',
    numbered: true,
    intro:
      'Policy on the terms for the return (exchange) of goods by the Buyer to the Supplier and on the procedure for providing warranty obligations.',
    sections: [
      {
        heading: 'Terms used',
        blocks: [
          {
            type: 'list',
            items: [
              'Goods — spare parts, consumables, and components for trucks offered for sale at tulparhub.kz.',
              'Proof of purchase — a document confirming the fact of purchase (receipt, waybill, voucher, technical passport, and other documents).',
              'Claim report (акт рекламации) — the primary document for processing a return or warranty case. It must contain a full description of the situation and the defect.',
              'Warranty period — the period during which the goods must meet quality requirements. For defects caused by the seller or manufacturer, the goods are subject to free repair or replacement.',
              'Defect — non-conformity of the goods with established standards or contract terms, which may include both obvious and hidden defects.',
              'Material defect — a defect that cannot be remedied without significant cost, time, or resources.',
              'Shelf life — the period during which the goods retain their consumer qualities and can be used safely.',
              'Service life — the time during which the goods retain their functional characteristics under normal operating conditions.',
              'Storage period — the period during which the goods retain their properties when storage conditions are met.',
            ],
          },
        ],
      },
      {
        heading: 'General provisions',
        blocks: [
          {
            type: 'p',
            text: '2.1. This Policy is developed in accordance with the Civil Code of the Republic of Kazakhstan, the Law “On Protection of Consumer Rights”, and Articles 12, 14, 25 of the Law of the RK No. 544-II dated 12 April 2004 “On Regulation of Trading Activity”.',
          },
          {
            type: 'p',
            text: '2.2. This Policy is an Annex to the Public Offer Agreement of TulparHub LLP (the “Company”). Return (exchange) of Goods is possible only in the cases provided for in this Policy. Other cases and types of returns are allowed only by agreement between the Seller and the Buyer.',
          },
          {
            type: 'p',
            text: '2.3. A mandatory condition of all permitted returns is the integrity and cleanliness of the packaging and the goods, the presence of a barcode with the order number on the packaging or on the part itself, and a document confirming the fact of purchase. If the packaging is damaged, soiled, or missing, the Company may refuse the return (exchange) under Article 454 of the Civil Code of the Republic of Kazakhstan.',
          },
          {
            type: 'p',
            text: '2.4. The Company guarantees the conformity of the quality and safety of the goods and provides the necessary product information. The Company assists buyers in choosing goods, offering qualified service and consultations on quality, characteristics, and operation.',
          },
          {
            type: 'p',
            text: '2.5. The warranty period starts from the moment the goods are handed to the buyer and is extended for the time during which the goods could not be used due to defects. When goods are replaced, the warranty period remains the same as that of the replaced goods unless otherwise provided by the contract. The warranty does not apply to goods whose shelf life or storage period has expired.',
          },
          {
            type: 'p',
            text: '2.6. If the sales rules for any group of goods change, or due to any other internal or external factors, the Company reserves the right to change (supplement) the return (exchange) terms by amending this Policy.',
          },
        ],
      },
      {
        heading: 'Conditions for returning goods',
        blocks: [
          { type: 'p', text: 'A return is possible if the following conditions are met:' },
          {
            type: 'list',
            items: [
              'the return is possible within 14 days of purchase;',
              'a receipt or waybill is available;',
              'the packaging and marketable condition are preserved;',
              'the goods have not been used, installed, and show no signs of operation.',
            ],
          },
        ],
      },
      {
        heading: 'Conditions for exchanging goods',
        blocks: [
          { type: 'p', text: 'An exchange is possible if the following conditions are met:' },
          {
            type: 'list',
            items: [
              'the exchange is possible within 14 days of purchase;',
              'a receipt or waybill is available;',
              'the packaging and marketable condition are preserved;',
              'the goods have not been used, installed, and show no signs of operation;',
              'the goods may be exchanged for similar goods if the defect is confirmed;',
              'the goods may be exchanged for similar goods if the warranty case is confirmed;',
              'the goods may be exchanged for any other goods by agreement of the parties in price and quantity, but not exceeding the value of the original purchase;',
              'exchange is not possible if the warranty case is not confirmed, the marketable condition is lost, the warranty period has expired, or the goods were previously installed and put into operation on a vehicle (the return and warranty policy terms have been violated).',
            ],
          },
        ],
      },
      {
        heading: 'Conditions for providing warranty obligations',
        blocks: [
          { type: 'p', text: 'Warranty obligations apply when the following conditions are met:' },
          {
            type: 'list',
            items: [
              'a receipt or waybill is available;',
              'a completed claim report from the customer;',
              'a defect report from a garage or service station;',
              'a conclusion on the part’s inoperability issued by a garage;',
              'an installation work order provided by a garage;',
              'a computer diagnostics report with a fault code for the returned part (for electronic-group goods);',
              'photo/video evidence of the detected defect before installation or installed on the vehicle.',
            ],
          },
          {
            type: 'note',
            text: 'Installation of the Goods by a qualified specialist at a certified service station, garage, or dealer center is also required. All work must comply with the manufacturer’s regulations.',
          },
        ],
      },
      {
        heading: 'Circumstances excluding return (exchange)',
        blocks: [
          {
            type: 'list',
            items: [
              'the warranty period has expired;',
              'the part was damaged in an accident or through improper operation;',
              'the goods were not selected by the vehicle’s chassis number;',
              'the goods have no marking or cannot be identified;',
              'the operation or installation conditions of the goods were violated;',
              'the conditions of clause 5 of this Policy were violated.',
            ],
          },
          {
            type: 'note',
            text: 'The warranty does not apply to goods damaged as a result of an accident, overloading, improper storage, installation, operation, or inadequate maintenance.',
          },
        ],
      },
      {
        heading: 'Natural wear',
        blocks: [
          {
            type: 'p',
            text: 'The warranty does not apply to the following goods subject to natural wear: body parts, plastic, lamps, wiper blades, oils and fluids, brake pads, filters.',
          },
        ],
      },
      {
        heading: 'Claim review periods',
        blocks: [
          {
            type: 'p',
            text: 'The claim review period is 21 business days from the submission of the claim report. If additional diagnostics are needed, the period may be extended.',
          },
          {
            type: 'p',
            text: 'The Company reserves the right to request additional documents to verify the data provided by the Buyer.',
          },
          {
            type: 'p',
            text: 'The Company reserves the right to decide on a claim based on the submitted documents and photo/video materials, without physically moving the goods to the warehouse.',
          },
        ],
      },
      {
        heading: 'Notice to buyers. Warranty periods',
        blocks: [
          {
            type: 'p',
            text: 'By purchasing spare parts and consumables for trucks from TulparHub LLP, you confirm that you are familiar with the warranty policy and return conditions and accept all risks and consequences related to non-conformity with the company’s terms and requirements.',
          },
          {
            type: 'p',
            text: `The warranty period for spare parts and auto goods of the following brands is 1 year with unlimited mileage from the moment of installation on the vehicle: ${BRANDS_1Y}.`,
          },
          {
            type: 'p',
            text: 'For FEBI products, the warranty is 3 years with unlimited mileage from the moment of installation on the vehicle.',
          },
        ],
      },
    ],
  },
}
