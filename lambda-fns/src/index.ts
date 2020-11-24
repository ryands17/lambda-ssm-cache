import { Context } from 'aws-lambda'
import { config, loadParameters } from './config'

export const handler = async (event: any, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false
  await loadParameters()
  return {
    value: config['/dev/key1'],
    success: true,
  }
}
