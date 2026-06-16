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
  'FAG': {
    country: 'Германия',
    website: 'schaeffler.com',
    description: 'Один из старейших производителей подшипников (с 1883 года), сегодня бренд группы Schaeffler.',
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
  'FEBI': {
    country: 'Германия',
    website: 'febi-bilstein.com',
    description: 'Бренд запчастей-аналогов компании Bilstein Group. Широкий ассортимент деталей подвески, тормозов, двигателя для европейской техники.',
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
  'VARTA': {
    country: 'Германия',
    website: 'varta-automotive.com',
    description: 'Производитель аккумуляторных батарей, один из старейших в Европе (с 1888 года).',
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
  'DONALDSON': {
    country: 'США',
    website: 'donaldson.com',
    description: 'Производитель фильтров для двигателей и промышленного оборудования, основан в 1915 году.',
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
  'FEDERAL-MOGUL': {
    country: 'США',
    website: 'tenneco.com',
    description: 'Производитель компонентов двигателя и тормозных систем, сегодня часть группы Tenneco.',
  },
  'BORGWARNER': {
    country: 'США',
    website: 'borgwarner.com',
    description: 'Производитель турбокомпрессоров и систем привода для двигателей.',
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
  'MOTUL': {
    country: 'Франция',
    website: 'motul.com',
    description: 'Производитель моторных масел и технических жидкостей, основан в 1853 году.',
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
  'BP': {
    country: 'Великобритания',
    website: 'bp.com',
    description: 'Бренд моторных масел нефтегазовой компании BP (Castrol).',
  },
  'CONTITECH': {
    country: 'Германия',
    website: 'contitech.com',
    description: 'Производитель резинотехнических изделий и приводных систем, подразделение Continental.',
  },
  'GARRETT': {
    country: 'США/Швейцария',
    website: 'garrettmotion.com',
    description: 'Производитель турбокомпрессоров, бывшее подразделение Honeywell.',
  },
  'HOLSET': {
    country: 'Великобритания',
    website: 'cumminsturbotechnologies.com',
    description: 'Производитель турбокомпрессоров для дизельных двигателей, бренд Cummins Turbo Technologies.',
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
  'THERMO KING': {
    country: 'США',
    website: 'thermoking.com',
    description: 'Производитель холодильных установок для транспорта, бренд Trane Technologies.',
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
  'FOTON': {
    country: 'Китай',
    website: 'foton.com.cn',
    description: 'Крупный китайский производитель грузовых автомобилей и спецтехники.',
  },
  'HOWO': {
    country: 'Китай',
    website: 'sinotruk.com',
    description: 'Линейка грузовых автомобилей китайской компании Sinotruk.',
  },
}

export function getBrandInfo(brand: string): BrandInfo | null {
  return BRAND_INFO[brand.toUpperCase()] ?? null
}
