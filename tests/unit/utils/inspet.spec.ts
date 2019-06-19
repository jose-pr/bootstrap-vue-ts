import { isString, isNumber } from '@/utils'

test('IsNumber for string number', () => {
  expect(isNumber('1')).toBe(false)
})
test('IsNumber for number', () => {
  expect(isNumber(10)).toBe(true)
})
