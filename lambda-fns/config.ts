import { SSM } from 'aws-sdk'
import ms from 'ms'

type Config = {
  values: Record<string, string | undefined>
  expiryDate?: Date
}

const ssm = new SSM()
export let config: Config = { values: {} }

export const loadParameters = async ({
  expiryTime: cacheDuration = '1h',
}: {
  expiryTime?: string
} = {}) => {
  if (!config.expiryDate) {
    config.expiryDate = new Date(Date.now() + ms(cacheDuration))
  }
  if (isConfigNotEmpty() && !hasCacheExpired()) return

  console.log('[Cost]: API called')
  config.values = {}
  const { Parameters = [] } = await ssm
    .getParametersByPath({
      Path: '/dev',
    })
    .promise()

  for (let param of Parameters) {
    if (param.Name) config.values[param.Name] = param.Value
  }
}

const hasCacheExpired = () =>
  config.expiryDate && new Date() > config.expiryDate

const isConfigNotEmpty = () => Object.keys(config.values).length
