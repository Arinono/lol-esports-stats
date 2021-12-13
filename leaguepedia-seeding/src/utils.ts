export const nullCheck = <T extends Record<string, any>>(data: T) => {
  const newData: Record<string, any> = {}
  for (const [k, v] of Object.entries(data)) {
    if (v !== '' && v != null) {
      newData[k] = v
    }
  }
  return newData
}
