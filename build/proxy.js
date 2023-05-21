const regExps = (value, reg) => {
  return value.replace(new RegExp(reg, 'g'), '')
}

export function createProxy (list = []) {
  const ret = {}
  for (const [prefix, target] of list) {
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      rewrite: (path) => regExps(path, prefix)
    }
  }
  return ret
}
