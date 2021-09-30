import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as ln from '@aws-cdk/aws-lambda-nodejs'
import * as ssm from '@aws-cdk/aws-ssm'
import * as iam from '@aws-cdk/aws-iam'
import * as logs from '@aws-cdk/aws-logs'

export class LambdaSsmStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Random Parameter Store variable
    new ssm.StringParameter(this, 'dev-key1', {
      parameterName: '/dev/key1',
      stringValue: 'value1',
    })

    // Lambda function to test with
    const handler = new ln.NodejsFunction(this, 'fetchParams', {
      logRetention: logs.RetentionDays.ONE_WEEK,
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 512,
      handler: 'handler',
      entry: './lambda-fns/index.ts',
      architectures: [lambda.Architecture.ARM_64],
      environment: { NODE_OPTIONS: '--enable-source-maps' },
      bundling: { sourceMap: true },
    })

    // Allow Lambda to fetch from Paramter Store
    handler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ssm:GetParametersByPath'],
        resources: [`arn:aws:ssm:${this.region}:*:parameter/dev*`],
      })
    )
  }
}
