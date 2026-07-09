'use client'

// Kazakhstan phone input. Country code +7 is fixed and shown as a static prefix;
// the user only types the 10 national digits, which we format live as
// (7XX) XXX-XX-XX. We store raw digits and never emit trailing separators, so
// backspace always deletes a real digit (no "stuck on a bracket" feeling).

function format(digits: string): string {
  const d = digits.slice(0, 10)
  let out = ''
  for (let i = 0; i < d.length; i++) {
    if (i === 0) out += '('
    else if (i === 3) out += ') '
    else if (i === 6) out += '-'
    else if (i === 8) out += '-'
    out += d[i]
  }
  return out
}

export function PhoneInput({
  value,
  onChange,
  invalid = false,
}: {
  value: string // raw national digits (up to 10)
  onChange: (digits: string) => void
  invalid?: boolean
}) {
  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.replace(/\D/g, '')
    // Pasted with a country code (8XXXXXXXXXX or 7XXXXXXXXXX) → keep last 10.
    if (raw.length > 10) raw = raw.slice(-10)
    onChange(raw)
  }

  return (
    <div className={'suw-phone' + (invalid ? ' err' : '')}>
      <span className="suw-phone-cc">+7</span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={format(value)}
        onChange={handle}
        placeholder="(700) 000-00-00"
        aria-label="Телефон"
      />
    </div>
  )
}
