import { join } from 'path'
import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as ln from '@aws-cdk/aws-lambda-nodejs'
import * as ssm from '@aws-cdk/aws-ssm'
import * as iam from '@aws-cdk/aws-iam'
import * as logs from '@aws-cdk/aws-logs'

const lambdaDir = join(__dirname, '..', 'lambda-fns')

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
      runtime: lambda.Runtime.NODEJS_12_X,
      memorySize: 512,
      handler: 'handler',
      entry: join(lambdaDir, 'src', 'index.ts'),
      depsLockFilePath: join(lambdaDir, 'yarn.lock'),
      nodeModules: ['ms'],
      sourceMap: true,
    })

    // Allow Lambda to fetch from Paramter Store
    handler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ssm:GetParametersByPath'],
        resources: [`arn:aws:ssm:${this.region}:*:parameter/dev*`],
      })
    )
  }
}
