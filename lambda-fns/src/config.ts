import { SSM } from 'aws-sdk'
import ms from 'ms'

const ssm = new SSM()
export let config = {} as Record<string, string | undefined>
let expiryDate: Date

export const loadParameters = async ({
  expiryTime: cacheDuration = '1h',
}: {
  expiryTime?: string
} = {}) => {
  if (!expiryDate) {
    expiryDate = new Date(Date.now() + ms(cacheDuration))
  }
  if (isConfigNotEmpty() && !hasCacheExpired()) return

  console.log('[Cost]: API called')
  config = {}
  const { Parameters = [] } = await ssm
    .getParametersByPath({
      Path: '/dev',
    })
    .promise()

  for (let param of Parameters) {
    if (param.Name) config[param.Name] = param.Value
  }
}

const hasCacheExpired = () => new Date() > expiryDate

const isConfigNotEmpty = () => Object.keys(config).length
