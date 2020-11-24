import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as ssm from '@aws-cdk/aws-ssm'
import * as iam from '@aws-cdk/aws-iam'
import * as logs from '@aws-cdk/aws-logs'

const lambdaPrefix = 'dist'

export class LambdaSsmStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Random Parameter Store variables
    new ssm.StringParameter(this, 'dev-key1', {
      parameterName: '/dev/key1',
      stringValue: 'value1',
    })

    // Lambda function to test with
    const handler = new lambda.Function(this, 'fetchParams', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda-fns/assets/assets.zip'),
      handler: `${lambdaPrefix}/index.handler`,
      memorySize: 512,
      logRetention: logs.RetentionDays.ONE_WEEK,
    })

    handler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ssm:GetParametersByPath'],
        resources: [`arn:aws:ssm:${this.region}:*:parameter/dev*`],
      })
    )
  }
}
