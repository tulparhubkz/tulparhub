// Maps product name keywords → Unsplash photo ID
// All IDs confirmed from Unsplash search results
const U = 'https://images.unsplash.com/photo-'
const OPTS = '?w=600&q=80&auto=format&fit=crop'

const PHOTOS: Record<string, string> = {
  // Oil filters — yellow pleated filter
  filter_oil:   '1523559094051-53bac879eb80',
  // Air / fuel filters — mechanic workshop close-up
  filter_air:   '1637640125496-31852f042a60',
  filter_fuel:  '1604434171479-4bfa093e5a82',
  // Brake pads
  brake_pad:    'ii4XEyJEm_I',
  // Brake disc / rotor
  brake_disc:   'al01Ad0f_KI',
  // Gaskets / head gasket
  gasket:       '1614447428943-52ec0bdbc7aa',
  // Seals (сальники)
  seal:         '1770705950498-d373e33ecb1a',
  // Bearings
  bearing:      '1657045045459-501e0336f270',
  // Clutch (disc, basket)
  clutch:       '1530124566582-a618bc2615dc',
  // Shock absorbers
  shock:        '1663642775693-a1a2a07ba971',
  // Radiators / cooling
  radiator:     '1619642751034-765dfdf7c58e',
  // Engine internals (pistons, liners, inserts)
  engine:       '1635691033744-a1a2a07ba971',
  // Tools / workshop / generic mechanical
  default:      '1570129476815-ba368ac77013',
}

export function getPartImage(name: string): string {
  const n = name.toLowerCase()

  if (n.includes('фильтр масл') || n.includes('filter oil') || n.includes('oil filter')) return U + PHOTOS.filter_oil + OPTS
  if (n.includes('фильтр возд') || n.includes('air filter'))                               return U + PHOTOS.filter_air + OPTS
  if (n.includes('фильтр топл') || n.includes('fuel filter'))                              return U + PHOTOS.filter_fuel + OPTS
  if (n.includes('колодк') || n.includes('brake pad'))                                     return U + PHOTOS.brake_pad + OPTS
  if (n.includes('диск тормоз') || n.includes('brake disc') || n.includes('brake rotor')) return U + PHOTOS.brake_disc + OPTS
  if (n.includes('прокладка') || n.includes('набор прокл') || n.includes('gasket'))       return U + PHOTOS.gasket + OPTS
  if (n.includes('сальник') || n.includes('seal'))                                         return U + PHOTOS.seal + OPTS
  if (n.includes('подшипник') || n.includes('bearing'))                                    return U + PHOTOS.bearing + OPTS
  if (n.includes('сцепл') || n.includes('корзина') || n.includes('clutch'))                return U + PHOTOS.clutch + OPTS
  if (n.includes('амортизатор') || n.includes('shock'))                                    return U + PHOTOS.shock + OPTS
  if (n.includes('радиатор') || n.includes('radiator'))                                    return U + PHOTOS.radiator + OPTS
  if (n.includes('поршень') || n.includes('вкладыш') || n.includes('гильз') || n.includes('кольц')) return U + PHOTOS.engine + OPTS

  return U + PHOTOS.default + OPTS
}
