import { getTimeStamp, getTimeTag } from '../src/helpers/formatDate.js'
const { writeTextFileSync } = Deno

// write file
// deno run --allow-write is required
export function writeJson(data, pathSubfix) {
  try {
    const timestamp = getTimeStamp()
    const today = getTimeTag('today', timestamp)
    const yesterday = getTimeTag('yesterday', timestamp)
    const filePath = pathSubfix ? `src/data/${today}-${pathSubfix}.json` : `src/data/${today}.json`
    console.log('write to', filePath)
    writeTextFileSync(filePath, JSON.stringify(data))

    const dataPath = `src/data/data.js`
    const content = `// DONT CHANGE! this file is auto generated by scripts/fetch_data.js
import todayData from './${today}.json'
import yesterdayData from './${yesterday}.json'
export const timestamp = '${timestamp}'
export const today = todayData
export const yesterday = yesterdayData
export default todayData
`
    writeTextFileSync(dataPath, content)
    return "Written to " + dataPath

  } catch (e) {
    console.error(e.message)
  }
}