import { NextResponse } from 'next/server'
import imageMap from '@/lib/partImageMap.json'

type ImageMap = Record<string, string[]>
const map = imageMap as ImageMap

// Deterministic pick so same OEM always gets same image
function pickImage(key: string, imgs: string[]): string {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return imgs[h % imgs.length]
}

function classify(name: string, oem: string): string {
  const n = name.toLowerCase()

  if (n.includes('фильтр масл') || n.includes('oil filter') || oem.match(/^WL|^PH|^W\d/i)) return 'filter_oil'
  if (n.includes('фильтр возд') || n.includes('air filter'))                                  return 'filter_air'
  if (n.includes('фильтр топл') || n.includes('fuel filter') || n.includes('фильтр сепар'))  return 'filter_fuel'
  if (n.includes('фильтр сал') || n.includes('cabin filter') || n.includes('фильтр каб'))    return 'filter_cabin'

  if (n.includes('прокладка г') || n.includes('гбц') || n.includes('головк блок'))           return 'gasket_head'
  if (n.includes('набор прокл') || n.includes('ремонтный компл') || n.includes('комплект прокл')) return 'gasket_set'
  if ((n.includes('прокладка') || n.includes('уплотн')) && !n.includes('прокладка г'))        return 'gasket_set'

  if (n.includes('маслосъ') || n.includes('маслосьем') || n.includes('колпачок клап'))        return 'valve_stem'
  if (n.includes('сальник'))                                                                   return 'seal_oil'

  if (n.includes('поршень'))                                                                   return 'piston'
  if (n.includes('гильза'))                                                                    return 'liner'
  if (n.includes('вкладыш'))                                                                   return 'bearing_rod'
  if (n.includes('кольц') && n.includes('поршн'))                                             return 'ring_piston'
  if (n.includes('маслян') && n.includes('насос'))                                            return 'pump_oil'
  if (n.includes('водян') && n.includes('насос') || n.includes('помпа'))                     return 'pump_water'
  if (n.includes('термостат'))                                                                 return 'thermostat'
  if (n.includes('форсунк') || n.includes('инжектор') || n.includes('injector'))              return 'injector'

  if (n.includes('колодк'))                                                                    return 'brake_pad'
  if (n.includes('диск тормоз') || n.includes('тормозной диск'))                              return 'brake_disc'
  if (n.includes('барабан'))                                                                   return 'brake_drum'
  if (n.includes('суппорт'))                                                                   return 'brake_caliper'
  if (n.includes('тормозной шланг') || n.includes('тормозн') && n.includes('трубк'))         return 'brake_hose'
  if (n.includes('тормозной кран') || n.includes('кран') && n.includes('тормоз'))            return 'brake_valve'

  if (n.includes('амортизатор'))                                                               return 'shock_absorber'
  if (n.includes('рессора'))                                                                   return 'spring_leaf'
  if (n.includes('подшипник ступ') || n.includes('ступичный'))                                return 'bearing_wheel'
  if (n.includes('ступица') || n.includes('hub'))                                             return 'hub'
  if (n.includes('сайлентблок') || n.includes('втулк') && n.includes('рычаг'))               return 'bushing'
  if (n.includes('наконечник') || n.includes('тяга рул'))                                     return 'tie_rod'
  if (n.includes('шаровая') || n.includes('ball joint'))                                      return 'ball_joint'

  if (n.includes('диск сцеп'))                                                                 return 'clutch_disc'
  if (n.includes('корзина'))                                                                   return 'clutch_basket'
  if (n.includes('сцепл') || n.includes('clutch'))                                            return 'clutch_kit'
  if (n.includes('карданн') || n.includes('крестовин'))                                       return 'propshaft'
  if (n.includes('сальник') && (n.includes('коробк') || n.includes('кпп') || n.includes('редуктор'))) return 'gearbox_seal'

  if (n.includes('генератор'))                                                                 return 'alternator'
  if (n.includes('стартер'))                                                                   return 'starter'
  if (n.includes('датчик') || n.includes('sensor'))                                           return 'sensor'
  if (n.includes('реле') || n.includes('предохранитель'))                                     return 'relay'

  if (n.includes('насос рул') || n.includes('гидроусилитель'))                               return 'steering_pump'
  if (n.includes('рулев') && (n.includes('рейк') || n.includes('механизм')))                 return 'steering_rack'

  if (n.includes('щетка') || n.includes('дворник'))                                           return 'wiper_blade'
  if (n.includes('радиатор'))                                                                  return 'radiator'
  if (n.includes('ремень') || n.includes('belt'))                                             return 'belt'
  if (n.includes('патрубок') || n.includes('шланг') && n.includes('охлажд'))                 return 'hose_cooling'

  return ''
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const oem  = (searchParams.get('oem')  ?? '').trim()
  const name = (searchParams.get('name') ?? '').trim()

  const category = classify(name, oem)
  const imgs = category ? map[category] : null

  if (!imgs || imgs.length === 0) {
    return NextResponse.json({ url: null })
  }

  const url = pickImage(oem || name, imgs)
  return NextResponse.json({ url })
}
