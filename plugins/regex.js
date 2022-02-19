const regex = {
  not_empty (v) {
    return !!v
  },
  email (v) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
  },
  min_6_chars (v) {
    return v.length >= 6
  },
  min_4_chars (v) {
    return v.length >= 4
  },
  microsms_hash (v) {
    return /^[A-Za-z0-9$*@]+$/.test(v)
  },
  sms_text (v) {
    return /^[A-Z.]+$/.test(v)
  },
  ip (v) {
    return /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))*$/.test(v)
  },
  is_url (v) {
    let url
    try {
      url = new URL(v)
    } catch (_) {
      return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
  },
  digits (v) {
    return /^\d+$/.test(v)
  },
  dsc_webhook_url (v) {
    return /^https:\/\/discord(?:app)?\.com\/api\/webhooks\//.test(v)
  },
  is_natural_number (v) {
    v = v.toString()
    const v1 = Math.abs(v)
    const v2 = parseInt(v, 10)
    return !isNaN(v1) && v2 === v1 && v1.toString() === v
  },
  max_100 (v) {
    return v <= 100
  },
  normal_string (v) {
    return /^[A-Za-z0-9_]{4,}$/.test(v)
  },
  nick (v) {
    return /^[a-zA-Z0-9_]{2,16}$/.test(v)
  },
  voucher (v) {
    return /^[a-z0-9]{6,}$/.test(v)
  },
  sms_code (v) {
    return /^[A-Za-z0-9]{8}$/.test(v)
  }
}

export default ({ app }, inject) => {
  inject('regex', regex)
}
