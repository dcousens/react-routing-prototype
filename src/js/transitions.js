// FIXME: module name irrelevant
let transitionMap = {
  'none': 'none',
  'fade': 'fade',
  'fade-contract': 'fade-expand',
  'show-from-left': 'reveal-from-left',
  'show-from-right': 'reveal-from-right',
  'show-from-top': 'reveal-from-top',
  'show-from-bottom': 'reveal-from-bottom'
}
let exportedMap = {}

// reverse associate all keys
for (let key in transitionMap) {
  let reverseKey = 'view-transition-' + transitionMap[key]
  let actualKey = 'view-transition-' + key

  exportedMap[actualKey] = reverseKey
  exportedMap[reverseKey] = actualKey
}

module.exports = exportedMap
