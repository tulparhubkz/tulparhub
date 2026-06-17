// Real, publicly known facts about brands present in our catalog.
// Only brands with verifiable public info get a description/country/website/logo.
// Smaller/regional suppliers (mostly Turkish aftermarket manufacturers) are shown
// with just their name and SKU count — no invented history.

export interface BrandInfo {
  country: string
  website: string
  description: string
}

export const BRAND_INFO: Record<string, BrandInfo> = {
  'BOSCH': {
    country: 'Германия',
    website: 'bosch.com',
    description: 'Один из крупнейших в мире производителей автокомпонентов. Основан в Штутгарте в 1886 году Робертом Бошем. Выпускает топливную аппаратуру, электрику, тормозные системы, фильтры.',
  },
  'MAHLE': {
    country: 'Германия',
    website: 'mahle.com',
    description: 'Производитель компонентов двигателя — поршни, кольца, фильтры, системы охлаждения и кондиционирования. Один из крупнейших OEM-поставщиков для грузовой техники в Европе.',
  },
  'ZF': {
    country: 'Германия',
    website: 'zf.com',
    description: 'Производитель трансмиссий, рулевых систем и компонентов шасси. Один из крупнейших мировых поставщиков для коммерческого транспорта.',
  },
  'WABCO': {
    country: 'США/Бельгия',
    website: 'wabco-auto.com',
    description: 'Производитель пневматических тормозных систем и систем управления для грузовиков и автобусов. С 2020 года входит в состав ZF.',
  },
  'KNORR-BREMSE': {
    country: 'Германия',
    website: 'knorr-bremse.com',
    description: 'Крупнейший в мире производитель тормозных систем для рельсового и коммерческого транспорта. Основан в Берлине в 1905 году.',
  },
  'MANN-FILTER': {
    country: 'Германия',
    website: 'mann-filter.com',
    description: 'Производитель фильтров для двигателя (масляные, воздушные, топливные, салонные). Подразделение группы MANN+HUMMEL.',
  },
  'SACHS': {
    country: 'Германия',
    website: 'zf.com/sachs',
    description: 'Бренд амортизаторов и сцеплений, принадлежит ZF. Один из старейших производителей подвески в Европе (с 1895 года).',
  },
  'LEMFORDER': {
    country: 'Германия',
    website: 'zf.com',
    description: 'Производитель компонентов подвески и рулевого управления, бренд группы ZF Aftermarket.',
  },
  'SKF': {
    country: 'Швеция',
    website: 'skf.com',
    description: 'Один из крупнейших производителей подшипников в мире. Основан в Гётеборге в 1907 году.',
  },
  'INA': {
    country: 'Германия',
    website: 'schaeffler.com',
    description: 'Производитель подшипников и компонентов привода ГРМ, входит в группу Schaeffler.',
  },
  'HELLA': {
    country: 'Германия',
    website: 'hella.com',
    description: 'Производитель световой техники и электроники для коммерческого транспорта. С 2022 года входит в состав Forvia.',
  },
  'TRW': {
    country: 'Германия/США',
    website: 'zf.com',
    description: 'Производитель тормозных систем и компонентов подвески, сегодня входит в ZF Aftermarket.',
  },
  'MONROE': {
    country: 'США',
    website: 'monroe.com',
    description: 'Производитель амортизаторов, бренд компании Tenneco. Один из старейших в отрасли — выпускается с 1916 года.',
  },
  'DAYCO': {
    country: 'США',
    website: 'dayco.com',
    description: 'Производитель приводных ремней, натяжителей и систем привода ГРМ для грузовой и легковой техники.',
  },
  'NRF': {
    country: 'Нидерланды',
    website: 'nrf.com',
    description: 'Производитель систем охлаждения и кондиционирования (радиаторы, компрессоры, теплообменники).',
  },
  'MEYLE': {
    country: 'Германия',
    website: 'meyle.com',
    description: 'Производитель запчастей-аналогов для европейской техники из Гамбурга, основан в 1971 году.',
  },
  'OSRAM': {
    country: 'Германия',
    website: 'osram.com',
    description: 'Производитель автомобильной и грузовой осветительной техники (лампы, светодиоды).',
  },
  'TIMKEN': {
    country: 'США',
    website: 'timken.com',
    description: 'Производитель подшипников и компонентов трансмиссии. Основан в 1899 году в Канаде, штаб-квартира в Огайо.',
  },
  'GOODYEAR': {
    country: 'США',
    website: 'goodyear.com',
    description: 'Один из крупнейших производителей шин в мире, основан в 1898 году в Огайо.',
  },
  'DELPHI': {
    country: 'США/Великобритания',
    website: 'delphi.com',
    description: 'Производитель топливных систем и электроники для двигателей.',
  },
  'CONTINENTAL': {
    country: 'Германия',
    website: 'continental.com',
    description: 'Один из крупнейших производителей шин и автокомпонентов в мире, основан в Ганновере в 1871 году.',
  },
  'WEBASTO': {
    country: 'Германия',
    website: 'webasto.com',
    description: 'Производитель систем отопления (автономные предпускные подогреватели) и климат-контроля.',
  },
  'EBERSPACHER': {
    country: 'Германия',
    website: 'eberspaecher.com',
    description: 'Производитель систем отопления и выхлопных систем, конкурент Webasto.',
  },
  'BP': {
    country: 'Великобритания',
    website: 'bp.com',
    description: 'Бренд моторных масел нефтегазовой компании BP (Castrol).',
  },
  'GARRETT': {
    country: 'США/Швейцария',
    website: 'garrettmotion.com',
    description: 'Производитель турбокомпрессоров, бывшее подразделение Honeywell.',
  },
  'FLEETGUARD': {
    country: 'США',
    website: 'cumminsfiltration.com',
    description: 'Бренд фильтров компании Cummins Filtration.',
  },

  // ── Truck/equipment OEM brands ──
  'VOLVO': {
    country: 'Швеция',
    website: 'volvotrucks.com',
    description: 'Один из крупнейших производителей грузовых автомобилей в мире. Основан в 1927 году в Гётеборге, акцент на безопасности и надёжности техники.',
  },
  'SCANIA': {
    country: 'Швеция',
    website: 'scania.com',
    description: 'Производитель грузовых автомобилей, автобусов и двигателей. Основан в 1891 году, штаб-квартира в Сёдертелье.',
  },
  'MAN': {
    country: 'Германия',
    website: 'man.eu',
    description: 'Производитель грузовых автомобилей и автобусов, часть группы Traton (Volkswagen). История компании ведёт начало с 1758 года.',
  },
  'DAF': {
    country: 'Нидерланды',
    website: 'daf.com',
    description: 'Производитель грузовых автомобилей, входит в состав PACCAR. Основан в 1928 году в Эйндховене.',
  },
  'MERCEDES-BENZ': {
    country: 'Германия',
    website: 'mercedes-benz-trucks.com',
    description: 'Производитель грузовых автомобилей Daimler Truck. Одна из старейших автомобильных марок в мире.',
  },
  'IVECO': {
    country: 'Италия',
    website: 'iveco.com',
    description: 'Производитель грузовых автомобилей и спецтехники, основан в 1975 году в результате слияния нескольких итальянских и европейских марок.',
  },
  'RENAULT': {
    country: 'Франция',
    website: 'renault-trucks.com',
    description: 'Renault Trucks — производитель грузовых автомобилей, часть группы Volvo Group с 2001 года.',
  },
  'CATERPILLAR': {
    country: 'США',
    website: 'caterpillar.com',
    description: 'Крупнейший производитель строительной и горнодобывающей техники, а также дизельных двигателей. Основан в 1925 году.',
  },
  'CUMMINS': {
    country: 'США',
    website: 'cummins.com',
    description: 'Один из крупнейших производителей дизельных двигателей и силовых установок для грузовой техники. Основан в 1919 году.',
  },
  'PERKINS': {
    country: 'Великобритания',
    website: 'perkins.com',
    description: 'Производитель дизельных двигателей для строительной техники и грузовиков, часть Caterpillar.',
  },
  'DEUTZ': {
    country: 'Германия',
    website: 'deutz.com',
    description: 'Производитель дизельных и газовых двигателей, один из старейших моторостроителей в мире (с 1864 года).',
  },
  'MERITOR': {
    country: 'США',
    website: 'meritor.com',
    description: 'Производитель осей, тормозных систем и трансмиссий для грузовых автомобилей, сегодня часть Cummins.',
  },
  'BPW': {
    country: 'Германия',
    website: 'bpw.de',
    description: 'Производитель осей и тормозных систем для прицепов и полуприцепов.',
  },
  'SAF-HOLLAND': {
    country: 'Германия',
    website: 'safholland.com',
    description: 'Производитель осей, подвесок и седельно-сцепных устройств для прицепной техники.',
  },
  'SCHMITZ CARGOBULL': {
    country: 'Германия',
    website: 'cargobull.com',
    description: 'Крупнейший в Европе производитель полуприцепов и прицепной техники.',
  },
  'KRONE': {
    country: 'Германия',
    website: 'krone-trailer.com',
    description: 'Производитель прицепной техники.',
  },
  'PACCAR': {
    country: 'США',
    website: 'paccar.com',
    description: 'Производитель грузовых автомобилей (DAF, Kenworth, Peterbilt) и компонентов.',
  },
  'HOWO': {
    country: 'Китай',
    website: 'sinotruk.com',
    description: 'Линейка грузовых автомобилей китайской компании Sinotruk.',
  },

  // ── Aftermarket / filtration / parts suppliers ──
  'DT': {
    country: 'Бельгия',
    website: 'dtspareparts.com',
    description: 'DT Spare Parts — европейский бренд запасных частей для грузовых автомобилей и автобусов. Широкий ассортимент OE-качества для техники MAN, Mercedes-Benz, DAF, Volvo, Scania.',
  },
  'KOLBENSCHMIDT': {
    country: 'Германия',
    website: 'ms-motorservice.com',
    description: 'Производитель поршней, вкладышей подшипников, поршневых колец для дизельных двигателей. Входит в группу Rheinmetall.',
  },
  'GLYCO': {
    country: 'Германия',
    website: 'ms-motorservice.com',
    description: 'Бренд вкладышей подшипников коленвала и шатунов, подразделение Federal-Mogul / Tenneco.',
  },
  'ELRING': {
    country: 'Германия',
    website: 'elring.com',
    description: 'Производитель прокладок и уплотнений для двигателей. Один из ведущих поставщиков OEM-уплотнительных систем в Европе.',
  },
  'VICTOR REINZ': {
    country: 'Германия',
    website: 'reinz.com',
    description: 'Бренд прокладок двигателя компании Dana Incorporated. Один из старейших производителей уплотнений (с 1913 года).',
  },
  'CORTECO': {
    country: 'Германия',
    website: 'corteco.com',
    description: 'Производитель сальников, манжет и уплотнений для грузовых автомобилей. Бренд группы Freudenberg.',
  },
  'GOETZE': {
    country: 'Германия',
    website: 'ms-motorservice.com',
    description: 'Бренд поршневых колец компании MS Motorservice International (группа Rheinmetall).',
  },
  'NURAL': {
    country: 'Германия',
    website: 'ms-motorservice.com',
    description: 'Бренд поршней для дизельных двигателей группы MS Motorservice / Rheinmetall.',
  },
  'LUK': {
    country: 'Германия',
    website: 'schaeffler.com',
    description: 'Производитель сцеплений, маховиков и компонентов трансмиссии, входит в группу Schaeffler.',
  },
  'TEXTAR': {
    country: 'Германия',
    website: 'textar.com',
    description: 'Производитель тормозных колодок и дисков для грузового транспорта. Бренд группы TMD Friction.',
  },
  'FERODO': {
    country: 'Великобритания',
    website: 'ferodo.com',
    description: 'Один из старейших производителей тормозных материалов (с 1897 года). Бренд группы TMD Friction.',
  },
  'JURID': {
    country: 'Германия',
    website: 'jurid.com',
    description: 'Производитель тормозных колодок для коммерческого транспорта. Бренд группы TMD Friction.',
  },
  'BERAL': {
    country: 'Германия',
    website: 'beral.de',
    description: 'Производитель тормозных накладок для грузовиков и прицепов. Специализируется на барабанных тормозах.',
  },
  'ICER': {
    country: 'Испания',
    website: 'icer.es',
    description: 'Испанский производитель тормозных колодок и дисков для коммерческого транспорта.',
  },
  'FRAS-LE': {
    country: 'Бразилия',
    website: 'fras-le.com',
    description: 'Крупнейший производитель тормозных накладок в Латинской Америке, поставляет на глобальный рынок.',
  },
  'HERTH+BUSS': {
    country: 'Германия',
    website: 'herthundbuss.de',
    description: 'Производитель электрических компонентов и кузовных деталей для грузовых автомобилей.',
  },
  'HENGST': {
    country: 'Германия',
    website: 'hengst.de',
    description: 'Производитель масляных, воздушных и топливных фильтров, а также систем управления жидкостями.',
  },
  'UFI': {
    country: 'Италия',
    website: 'ufifilters.com',
    description: 'Итальянский производитель фильтров для двигателей (UFI Filters), поставщик для OEM и вторичного рынка.',
  },
  'CHAMPION': {
    country: 'Великобритания',
    website: 'championautoparts.com',
    description: 'Производитель свечей зажигания, фильтров и технических жидкостей. Бренд группы Federal-Mogul / Tenneco.',
  },
  'BERU': {
    country: 'Германия',
    website: 'beru.com',
    description: 'Производитель свечей накаливания и датчиков для дизельных двигателей. Бренд BorgWarner.',
  },
  'BANDO': {
    country: 'Япония',
    website: 'bando.com',
    description: 'Японский производитель приводных ремней и систем передачи мощности. Один из крупнейших в Азии.',
  },
  'OPTIBELT': {
    country: 'Германия',
    website: 'optibelt.com',
    description: 'Производитель приводных ремней (клиновых, поликлиновых, зубчатых) для промышленного и коммерческого транспорта.',
  },
  'ALKO': {
    country: 'Германия',
    website: 'al-ko.com',
    description: 'Производитель осей, тормозных систем и компонентов шасси для прицепной техники и лёгких коммерческих автомобилей.',
  },
  'SAMPA': {
    country: 'Турция',
    website: 'sampa.com.tr',
    description: 'Турецкий производитель и дистрибьютор запасных частей для грузовых автомобилей. Крупнейший поставщик на рынке Турции и Восточной Европы.',
  },
  'BSG': {
    country: 'Турция',
    website: 'bsgautomotive.com',
    description: 'Турецкий производитель стартеров, генераторов и компонентов электрооборудования для грузовых автомобилей.',
  },
  'AS-PL': {
    country: 'Польша',
    website: 'as-pl.com',
    description: 'Польский производитель стартеров, генераторов и запасных частей к ним для грузовых автомобилей и строительной техники.',
  },
  'AUGER': {
    country: 'Германия',
    website: 'auger.de',
    description: 'Немецкий поставщик запасных частей для грузовых автомобилей, специализируется на кузовных и электрических компонентах.',
  },
  'STELLOX': {
    country: 'Германия',
    website: 'stellox.com',
    description: 'Европейский бренд запасных частей для грузовых автомобилей и прицепов широкого ассортимента.',
  },
  'TRUCKTEC': {
    country: 'Германия',
    website: 'trucktecautomotive.com',
    description: 'Немецкий производитель запасных частей для грузовых автомобилей MAN, Mercedes-Benz, DAF, Scania, Volvo.',
  },
  'SWAG': {
    country: 'Германия',
    website: 'swag.de',
    description: 'Немецкий поставщик запасных частей для коммерческого транспорта, специализируется на деталях трансмиссии и подвески.',
  },
  'FEBI': {
    country: 'Германия',
    website: 'febi-bilstein.com',
    description: 'Бренд запчастей-аналогов компании Bilstein Group. Широкий ассортимент деталей подвески, тормозов, двигателя для европейской техники.',
  },
  'VADEN': {
    country: 'Турция',
    website: 'vaden.com.tr',
    description: 'Турецкий производитель тормозных барабанов, дисков и колодок для грузовых автомобилей.',
  },
  'SORL': {
    country: 'Китай',
    website: 'sorl.com',
    description: 'Китайский производитель тормозных систем для грузовых автомобилей и автобусов, поставляет на мировой рынок.',
  },
  'CEI': {
    country: 'Италия',
    website: 'ceigroup.it',
    description: 'Итальянский производитель электрических и электронных компонентов для грузовых автомобилей и автобусов.',
  },
  'VIGNAL': {
    country: 'Франция',
    website: 'vignal-systems.com',
    description: 'Французский производитель осветительного оборудования для грузовых автомобилей и прицепов.',
  },
  'ASPOCK': {
    country: 'Австрия',
    website: 'aspock.com',
    description: 'Австрийский производитель световых систем и электрооборудования для прицепов и полуприцепов.',
  },
  'FRISTOM': {
    country: 'Польша',
    website: 'fristom.pl',
    description: 'Польский производитель фонарей и осветительного оборудования для прицепов.',
  },
  'DEPO': {
    country: 'Тайвань',
    website: 'depo.com.tw',
    description: 'Тайваньский производитель фар и фонарей для грузовых автомобилей и автобусов.',
  },
  'NISSENS': {
    country: 'Дания',
    website: 'nissens.com',
    description: 'Датский производитель компонентов системы охлаждения и кондиционирования — радиаторы, компрессоры, конденсоры.',
  },
  'BEHR': {
    country: 'Германия',
    website: 'mahle.com',
    description: 'Производитель систем охлаждения двигателя и климатических систем, сегодня входит в состав MAHLE.',
  },
  'FERSA': {
    country: 'Испания',
    website: 'fersa.com',
    description: 'Испанский производитель подшипников качения для автомобильной промышленности и индустриального применения.',
  },
  'KOYO': {
    country: 'Япония',
    website: 'jtekt.com',
    description: 'Японский производитель подшипников и рулевых компонентов, входит в группу JTEKT Corporation.',
  },
  'NSK': {
    country: 'Япония',
    website: 'nsk.com',
    description: 'Японский производитель подшипников, линейных направляющих и рулевых систем. Один из крупнейших в мире.',
  },
  'NTN': {
    country: 'Япония',
    website: 'ntn-snr.com',
    description: 'Японский производитель подшипников и компонентов трансмиссии, один из крупнейших в мире.',
  },
  'DONGIL': {
    country: 'Южная Корея',
    website: 'dongilrubber.com',
    description: 'Корейский производитель резинотехнических изделий — рукавов, уплотнений, манжет для коммерческой техники.',
  },
  'FTE': {
    country: 'Германия',
    website: 'fte.de',
    description: 'Производитель гидравлических компонентов тормозной системы и сцепления. Входит в группу Brembo.',
  },
  'FRENKIT': {
    country: 'Испания',
    website: 'frenkit.com',
    description: 'Испанский производитель ремонтных комплектов для тормозных суппортов грузовых автомобилей.',
  },
  'PIERBURG': {
    country: 'Германия',
    website: 'pierburg.com',
    description: 'Производитель карбюраторов, клапанов EGR, насосов и компонентов управления двигателем. Бренд группы Rheinmetall.',
  },
  'WAHLER': {
    country: 'Германия',
    website: 'wahler.com',
    description: 'Немецкий производитель термостатов и клапанов системы охлаждения и рециркуляции выхлопных газов.',
  },
  'COJALI': {
    country: 'Испания',
    website: 'cojali.com',
    description: 'Испанский производитель электронных диагностических систем и запасных частей для грузовых автомобилей.',
  },
  'EURORICAMBI': {
    country: 'Италия',
    website: 'euroricambi.it',
    description: 'Итальянский производитель компонентов коробок передач и мостов для грузовых автомобилей.',
  },
  'DINEX': {
    country: 'Дания',
    website: 'dinex.com',
    description: 'Датский производитель выхлопных систем и компонентов SCR/DPF для грузовых автомобилей.',
  },
  'RINGFEDER': {
    country: 'Германия',
    website: 'ringfeder.com',
    description: 'Немецкий производитель сцепных устройств и амортизирующих муфт для тягачей и прицепов.',
  },
  'METELLI': {
    country: 'Италия',
    website: 'metelli.it',
    description: 'Итальянский производитель компонентов тормозной системы и сцепления для коммерческой техники.',
  },
  'MONARK': {
    country: 'Швеция',
    website: 'monarkparts.com',
    description: 'Шведский дистрибьютор запасных частей для грузовых автомобилей Volvo и Scania.',
  },
  'KONGSBERG': {
    country: 'Норвегия',
    website: 'kongsberg-automotive.com',
    description: 'Норвежский производитель систем управления коробкой передач, сцеплением и пневматикой для грузовиков.',
  },
  'PARKER': {
    country: 'США',
    website: 'parker.com',
    description: 'Один из крупнейших производителей гидравлических систем, пневматики и фильтрации. Основан в 1917 году.',
  },
  'LEMA': {
    country: 'Италия',
    website: 'lema.it',
    description: 'Итальянский производитель компонентов подвески и рулевого управления для грузовых автомобилей.',
  },
  'RTS': {
    country: 'Германия',
    website: 'rts-ag.de',
    description: 'Немецкий производитель компонентов подвески и рулевого управления для коммерческого транспорта.',
  },
  'MAYSAN MANDO': {
    country: 'Турция',
    website: 'maysanmando.com.tr',
    description: 'Турецкий производитель амортизаторов для легковых и коммерческих автомобилей.',
  },
  'LAVR': {
    country: 'Россия',
    website: 'lavr.ru',
    description: 'Российский производитель технических жидкостей, присадок и автохимии для обслуживания транспортных средств.',
  },
  'SINTEC': {
    country: 'Россия',
    website: 'sintec.ru',
    description: 'Российский производитель моторных масел, технических жидкостей и автохимии.',
  },
  'ALPET': {
    country: 'Турция',
    website: 'alpet.com.tr',
    description: 'Турецкий производитель смазочных материалов и технических жидкостей для транспортных средств.',
  },
  'MOTUL': {
    country: 'Франция',
    website: 'motul.com',
    description: 'Производитель моторных масел и технических жидкостей, основан в 1853 году.',
  },
  'HOLSET': {
    country: 'Великобритания',
    website: 'cumminsturbotechnologies.com',
    description: 'Производитель турбокомпрессоров для дизельных двигателей, бренд Cummins Turbo Technologies.',
  },
  'BORGWARNER': {
    country: 'США',
    website: 'borgwarner.com',
    description: 'Производитель турбокомпрессоров и систем привода для двигателей.',
  },
  'DOOSAN': {
    country: 'Южная Корея',
    website: 'doosaninfracore.com',
    description: 'Корейский производитель строительной техники и дизельных двигателей.',
  },
  'DETROIT': {
    country: 'США',
    website: 'detroitdiesel.com',
    description: 'Производитель дизельных двигателей для тяжёлых грузовиков, подразделение Daimler Truck North America.',
  },
  'THERMO KING': {
    country: 'США',
    website: 'thermoking.com',
    description: 'Производитель холодильных установок для транспорта, бренд Trane Technologies.',
  },
  'SCHMITZ': {
    country: 'Германия',
    website: 'cargobull.com',
    description: 'Производитель полуприцепов и прицепной техники (Schmitz Cargobull), крупнейший в Европе.',
  },
  'PAYEN': {
    country: 'Франция',
    website: 'dana.com',
    description: 'Французский производитель прокладок и уплотнений двигателя, входит в группу Dana Incorporated.',
  },
  'KACO': {
    country: 'Германия',
    website: 'kaco.com',
    description: 'Немецкий производитель радиальных сальников и уплотнений для двигателей и трансмиссий.',
  },
  'NAK': {
    country: 'Япония',
    website: 'nakseal.com',
    description: 'Японский производитель уплотнений и сальников для промышленной и транспортной техники.',
  },
  'SUPER OIL SEALS': {
    country: 'Индия',
    website: 'superoilseals.com',
    description: 'Индийский производитель сальников и уплотнительных элементов для грузовых автомобилей.',
  },
  'GMB': {
    country: 'Япония',
    website: 'gmb.co.jp',
    description: 'Японский производитель подшипников ступиц, крестовин и компонентов трансмиссии.',
  },
  'KAVLICO': {
    country: 'США',
    website: 'kavlico.com',
    description: 'Американский производитель датчиков давления и температуры для транспортных средств.',
  },
  'VARTA': {
    country: 'Германия',
    website: 'varta-automotive.com',
    description: 'Производитель аккумуляторных батарей, один из старейших в Европе (с 1888 года).',
  },
  'DONALDSON': {
    country: 'США',
    website: 'donaldson.com',
    description: 'Производитель фильтров для двигателей и промышленного оборудования, основан в 1915 году.',
  },
  'CONTITECH': {
    country: 'Германия',
    website: 'contitech.com',
    description: 'Производитель резинотехнических изделий и приводных систем, подразделение Continental.',
  },
  'MOBIL': {
    country: 'США',
    website: 'mobil.com',
    description: 'Бренд моторных масел компании ExxonMobil.',
  },
  'TOTAL': {
    country: 'Франция',
    website: 'totalenergies.com',
    description: 'Бренд моторных масел и технических жидкостей компании TotalEnergies.',
  },
  'FEDERAL-MOGUL': {
    country: 'США',
    website: 'tenneco.com',
    description: 'Производитель компонентов двигателя и тормозных систем, сегодня часть группы Tenneco.',
  },
  'TRUCKTECHNIC': {
    country: 'Германия',
    website: 'trucktechnic.de',
    description: 'Немецкий производитель запасных частей для пневматических систем грузовых автомобилей.',
  },
  'AE': {
    country: 'Германия',
    website: 'ae-parts.de',
    description: 'Бренд компонентов двигателя (поршни, кольца, вкладыши) группы Federal-Mogul / Tenneco.',
  },
  'MIBA': {
    country: 'Австрия',
    website: 'miba.com',
    description: 'Австрийский производитель подшипников скольжения и фрикционных материалов для двигателей.',
  },
  'HD-PARTS': {
    country: 'Норвегия',
    website: 'hd-parts.no',
    description: 'Норвежский поставщик запасных частей для грузовых автомобилей Scania, Volvo, MAN, DAF.',
  },
  'EUROPART': {
    country: 'Германия',
    website: 'europart.net',
    description: 'Немецкая сеть дистрибьюторов запасных частей для грузовых автомобилей и автобусов.',
  },
  'OREX': {
    country: 'Израиль',
    website: 'orex-parts.com',
    description: 'Израильский производитель кузовных деталей и элементов для грузовых автомобилей.',
  },
  'FOTON': {
    country: 'Китай',
    website: 'foton.com.cn',
    description: 'Крупный китайский производитель грузовых автомобилей и спецтехники.',
  },
  'SEM LASTIK': {
    country: 'Турция',
    website: 'semlastik.com.tr',
    description: 'Турецкий производитель резинотехнических изделий — сайлентблоков, втулок, подушек двигателя для грузовых автомобилей.',
  },
  'EMOTOR': {
    country: 'Турция',
    website: 'emotor.com.tr',
    description: 'Турецкий производитель стартеров и генераторов для грузовых автомобилей и автобусов.',
  },
  'KAHVECI': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей и резинотехнических изделий для коммерческого транспорта.',
  },
  'MANSONS': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'SMARTTECH': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель компонентов для грузовых автомобилей и спецтехники.',
  },
  'ANDAC': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'FSS': {
    country: 'Турция',
    website: '',
    description: 'Турецкий поставщик запасных частей для грузовых автомобилей.',
  },
  'KACMAZLAR': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'OE GERMANY': {
    country: 'Германия',
    website: 'oegermany.de',
    description: 'Немецкий бренд запасных частей OE-качества для грузовых автомобилей европейских марок.',
  },
  'MEGA': {
    country: 'Польша',
    website: 'mega.eu',
    description: 'Польский производитель тормозных колодок и накладок для коммерческого транспорта.',
  },
  'CONSAN': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'DONMEZ': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'TRUCK EXPERT': {
    country: 'Турция',
    website: '',
    description: 'Турецкий поставщик запасных частей для грузовых автомобилей и спецтехники.',
  },
  'UNITRUCK GERMANY': {
    country: 'Германия',
    website: '',
    description: 'Немецкий поставщик запасных частей для грузовых автомобилей.',
  },
  'MARS': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'FERRUM': {
    country: 'Польша',
    website: '',
    description: 'Польский производитель запасных частей для грузовых автомобилей.',
  },
  'PETERS': {
    country: 'Германия',
    website: '',
    description: 'Немецкий поставщик запасных частей для грузовых автомобилей.',
  },
  'BF': {
    country: 'Польша',
    website: '',
    description: 'Производитель фильтров для дизельных двигателей коммерческого транспорта.',
  },
  'CHAMPION OIL': {
    country: 'США',
    website: 'championbrands.com',
    description: 'Американский производитель моторных масел и технических жидкостей.',
  },
  'PROVIA': {
    country: 'Франция',
    website: 'provia.fr',
    description: 'Французский поставщик запасных частей для грузовых автомобилей и автобусов.',
  },
  'FAG': {
    country: 'Германия',
    website: 'schaeffler.com',
    description: 'Один из старейших производителей подшипников (с 1883 года), сегодня бренд группы Schaeffler.',
  },
  'AYFAR': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'ERREVI': {
    country: 'Италия',
    website: '',
    description: 'Итальянский производитель запасных частей и компонентов для грузовых автомобилей.',
  },
  'SOYLU': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'AYD': {
    country: 'Турция',
    website: 'ayd.com.tr',
    description: 'Турецкий производитель компонентов подвески и рулевого управления для грузовых автомобилей.',
  },
  'SERVET': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'HAMMER': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель компонентов подвески для грузовых автомобилей.',
  },
  'SAMPIYON': {
    country: 'Турция',
    website: 'sampiyon.com.tr',
    description: 'Турецкий производитель приводных ремней для коммерческого и промышленного транспорта.',
  },
  'STR': {
    country: 'Германия',
    website: '',
    description: 'Немецкий поставщик запасных частей для грузовых автомобилей.',
  },
  'WASPO': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для грузовых автомобилей.',
  },
  'ARTITECH': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'ROTA': {
    country: 'Турция',
    website: 'rotaparts.com',
    description: 'Турецкий производитель компонентов рулевого управления и подвески для грузовых автомобилей.',
  },
  'NOIR': {
    country: 'Италия',
    website: '',
    description: 'Итальянский производитель запасных частей для грузовых автомобилей.',
  },
  'PAAZ': {
    country: 'Россия',
    website: 'paaz.ru',
    description: 'Российский производитель прицепов и запасных частей для прицепной техники (Павловский автобусный завод).',
  },
  'STARTEC': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель стартеров и генераторов для коммерческого транспорта.',
  },
  'WOSM': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'ONYARBI': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'KANCA': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель сцепных устройств и фаркопов для грузовых автомобилей.',
  },
  'KOYOTO': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'CONVITEX': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель конвейерных лент и резинотехнических изделий.',
  },
  'YUMAK': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'ARTEX': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'KONPAR': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'EUROSAN': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'TRIFA': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для грузовых автомобилей.',
  },
  'IMA-X': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'HOBI': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'BIBI CARE': {
    country: 'Турция',
    website: '',
    description: 'Производитель товаров для технического обслуживания транспортных средств.',
  },
  'KRML': {
    country: 'Россия',
    website: '',
    description: 'Российский производитель запасных частей для грузовых автомобилей.',
  },
  'SERTPLAS': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель пластиковых компонентов для грузовых автомобилей.',
  },
  'BSL': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'KRAUF': {
    country: 'Германия',
    website: 'krauf.ru',
    description: 'Немецкий бренд аккумуляторов для грузовых автомобилей и коммерческого транспорта.',
  },
  'KRAFTVOLL': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для грузовых автомобилей.',
  },
  'ROBUR GERMANY': {
    country: 'Германия',
    website: '',
    description: 'Немецкий бренд запасных частей для коммерческого транспорта.',
  },
  'POLLARD': {
    country: 'Великобритания',
    website: '',
    description: 'Британский поставщик запасных частей для грузовых автомобилей.',
  },
  'EUROTECH': {
    country: 'Италия',
    website: 'eurotech-spa.it',
    description: 'Итальянский производитель грузовых автомобилей и запасных частей к ним.',
  },
  'TANGDE': {
    country: 'Китай',
    website: '',
    description: 'Китайский производитель запасных частей для грузовых автомобилей.',
  },
  'TECNO TECHNIC': {
    country: 'Италия',
    website: '',
    description: 'Итальянский производитель технических решений для грузовых автомобилей.',
  },
  'WILDCAT': {
    country: 'Германия',
    website: '',
    description: 'Производитель запасных частей для коммерческого транспорта.',
  },
  'NORD': {
    country: 'Германия',
    website: 'nord.com',
    description: 'Немецкий производитель редукторов и электроприводов (Nord Drivesystems).',
  },
  'OPTIMUM': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'DESPA': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для коммерческого транспорта.',
  },
  'LOKHEN': {
    country: 'Италия',
    website: 'lokhen.com',
    description: 'Итальянский производитель кузовных компонентов и деталей кабины для грузовых автомобилей.',
  },
  'LASO': {
    country: 'Испания',
    website: 'laso.es',
    description: 'Испанский производитель компонентов подвески для коммерческого транспорта.',
  },
  'AIRTECH': {
    country: 'Германия',
    website: '',
    description: 'Производитель компонентов пневматической системы для грузовых автомобилей.',
  },
  'YETSAN': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'ATOSAN': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'GTS': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель компонентов для грузовых автомобилей.',
  },
  'MARSHALL': {
    country: 'Турция',
    website: 'marshall.com.tr',
    description: 'Турецкий производитель шин для грузовых автомобилей и коммерческого транспорта.',
  },
  'BRAKEWEL': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель тормозных компонентов для грузовых автомобилей.',
  },
  'SAMOA': {
    country: 'Испания',
    website: 'samoa.es',
    description: 'Испанский производитель оборудования для работы с маслами и жидкостями (насосы, емкости).',
  },
  'BGS': {
    country: 'Германия',
    website: 'bgs-technic.de',
    description: 'Немецкий производитель инструментов и оборудования для автосервисов.',
  },
  'BOCK': {
    country: 'Германия',
    website: 'bock.de',
    description: 'Немецкий производитель компрессоров для систем холодильного транспорта.',
  },
  'BRAKEPOINT': {
    country: 'Германия',
    website: '',
    description: 'Производитель тормозных компонентов для коммерческого транспорта.',
  },
  'PAPENBURG': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для грузовых автомобилей.',
  },
  'BLACKTECH': {
    country: 'Турция',
    website: '',
    description: 'Производитель технических компонентов для коммерческого транспорта.',
  },
  'LEZEN': {
    country: 'Германия',
    website: '',
    description: 'Немецкий поставщик запасных частей для грузовых автомобилей.',
  },
  'AIRGRADE': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель компонентов пневматических систем для грузовых автомобилей.',
  },
  'ATEX': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'WUBERTECH': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для грузовых автомобилей.',
  },
  'THORPIDO': {
    country: 'Германия',
    website: '',
    description: 'Производитель компонентов для коммерческого транспорта.',
  },
  'BAGEN': {
    country: 'Китай',
    website: '',
    description: 'Китайский производитель запасных частей для грузовых автомобилей.',
  },
  'IMB': {
    country: 'Италия',
    website: '',
    description: 'Итальянский производитель запасных частей для коммерческого транспорта.',
  },
  'TORQUE': {
    country: 'Великобритания',
    website: '',
    description: 'Производитель компонентов трансмиссии и тормозных систем для грузовых автомобилей.',
  },
  'ZEN': {
    country: 'Бразилия',
    website: 'zenmetal.com.br',
    description: 'Бразильский производитель подшипников и компонентов двигателя.',
  },
  'VERNET': {
    country: 'Франция',
    website: 'vernet.fr',
    description: 'Французский производитель термостатов и компонентов системы охлаждения двигателя.',
  },
  'UNIPOINT': {
    country: 'Тайвань',
    website: 'unipoint.com.tw',
    description: 'Тайваньский производитель стартеров, генераторов и электрооборудования.',
  },
  'MILWAUKEE': {
    country: 'США',
    website: 'milwaukeetool.com',
    description: 'Американский производитель профессионального электроинструмента и оборудования для мастерских.',
  },
  'HIDROMEK': {
    country: 'Турция',
    website: 'hidromek.com',
    description: 'Турецкий производитель строительной техники (экскаваторы, бульдозеры) и запасных частей к ней.',
  },
  'FLASH FILTER': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель фильтров для дизельных двигателей коммерческого транспорта.',
  },
  'AUTOTECHNIK FILTER': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель фильтров для грузовых автомобилей.',
  },
  'FIL FILTER': {
    country: 'Италия',
    website: 'filfilter.com',
    description: 'Итальянский производитель масляных, воздушных и топливных фильтров для коммерческого транспорта.',
  },
  'GEWINNER': {
    country: 'Германия',
    website: '',
    description: 'Немецкий бренд запасных частей для коммерческого транспорта.',
  },
  'CONTINUAL': {
    country: 'Германия',
    website: '',
    description: 'Производитель запасных частей для грузовых автомобилей.',
  },
  'FAN MARKET': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель вентиляторов охлаждения для грузовых автомобилей.',
  },
  'POVERPLAST': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель пластиковых компонентов для грузовых автомобилей.',
  },
  'AA-TOP': {
    country: 'Турция',
    website: '',
    description: 'Турецкий поставщик запасных частей для коммерческого транспорта.',
  },
  'SHA PART': {
    country: 'Иран',
    website: '',
    description: 'Иранский производитель запасных частей для грузовых автомобилей.',
  },
  'USMER KAUCUK': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель резинотехнических изделий для коммерческого транспорта.',
  },
  'PENER': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'FRENOTRUCK': {
    country: 'Испания',
    website: '',
    description: 'Испанский производитель тормозных компонентов для грузовых автомобилей.',
  },
  'KORMAS': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'VURAL': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'REN-PAR': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'EMEK': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'AKKAR': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'KOZMAK': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'UCLER': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'ASASKA': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'TLP': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'GURBUZ': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'ARCEK': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'GAYSAN': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'KALORIFER': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель отопительных компонентов для грузовых автомобилей.',
  },
  'JANTSA': {
    country: 'Турция',
    website: 'jantsa.com.tr',
    description: 'Турецкий производитель колёсных дисков для грузовых автомобилей и прицепов.',
  },
  'DENIZLER': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'KURTSAN': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'ALSA': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'DODO': {
    country: 'Россия',
    website: '',
    description: 'Производитель автохимии и технических жидкостей для транспортных средств.',
  },
  'TRAMAK': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'KEMALI': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'AYDINSAN': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель электрооборудования и компонентов для грузовых автомобилей.',
  },
  'YUCE': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'DIKMEN': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'ZEREN': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'TETIK': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для грузовых автомобилей.',
  },
  'TURKUAZ': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'SUPTEX': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель текстильных и технических материалов.',
  },
  'NOKTA': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'SONNE': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для грузовых автомобилей.',
  },
  'KARO': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'HYDCAB': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель гидравлических шлангов и компонентов для грузовых автомобилей.',
  },
  'FLAG': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель запасных частей для коммерческого транспорта.',
  },
  'DETCH': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для грузовых автомобилей.',
  },
  'MAXPART': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для коммерческого транспорта.',
  },
  'SIMTEC': {
    country: 'Турция',
    website: '',
    description: 'Турецкий производитель электронных компонентов для грузовых автомобилей.',
  },
  'COSTH': {
    country: 'Китай',
    website: '',
    description: 'Китайский производитель запасных частей для грузовых автомобилей.',
  },
  'ROCKBERG': {
    country: 'Германия',
    website: '',
    description: 'Немецкий производитель запасных частей для коммерческого транспорта.',
  },
  'ZETEX': {
    country: 'Великобритания',
    website: '',
    description: 'Производитель технических материалов и уплотнений для промышленного применения.',
  },
  'DONGWOO': {
    country: 'Южная Корея',
    website: '',
    description: 'Корейский производитель запасных частей для коммерческого транспорта.',
  },
}

export function getBrandInfo(brand: string): BrandInfo | null {
  return BRAND_INFO[brand.toUpperCase()] ?? null
}
