import { Context } from 'aws-lambda'
import { config, loadParameters } from './config'

export const handler = async (event: any, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false
  // await loadParameters()
  throw Error('error occured!')
  return {
    value: config.values['/dev/key1'],
    success: true,
  }
}
