import { Context } from 'aws-lambda'
import { SSM } from 'aws-sdk'

const ssm = new SSM()
let cache = {} as any

const getParameters = async () => {
  if (Object.keys(cache).length) return

  console.log('[Cost]: API called')
  const { Parameters } = await ssm
    .getParametersByPath({
      Path: '/dev',
    })
    .promise()

  for (let param of Parameters || []) {
    if (param.Name) cache[param.Name] = param.Value
  }
}

export const handler = async (event: any, context: Context) => {
  await getParameters()
  console.log(JSON.stringify(cache))
  context.callbackWaitsForEmptyEventLoop = false
  return {
    id: uuidv4(),
    success: true,
  }
}

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = (Math.random() * 16) | 0
    let v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
