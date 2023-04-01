// 封装获取本地token的模块

// 存储数据
export const mySetItem = (key, value) => {
  // 如果值类型为对象,则需要将对象转化为JSON格式字符串
  if (typeof value === 'object') value = JSON.stringify(value)
  window.localStorage.setItem(key, value)
}

// 读取数据
export const myGetItem = key => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

// 删除数据
export const myDeleteItem = key => {
  return window.localStorage.removeItem(key)
}
