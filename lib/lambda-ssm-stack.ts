import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as logs from '@aws-cdk/aws-logs'

const lambdaPrefix = 'dist'

export class LambdaSsmStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Lambda function to test with
    new lambda.Function(this, 'simpleFn', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda-fns/assets/assets.zip'),
      handler: `${lambdaPrefix}/index.handler`,
      memorySize: 512,
      logRetention: logs.RetentionDays.ONE_WEEK,
    })
  }
}
