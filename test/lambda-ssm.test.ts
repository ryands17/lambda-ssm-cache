import {
  deepObjectLike,
  expect as expectCDK,
  haveResourceLike,
} from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { LambdaSsmStack } from '../lib/lambda-ssm-stack'

test('The SSM Parameter with the correct values', () => {
  const stack = createStack()
  expectCDK(stack).to(
    haveResourceLike('AWS::SSM::Parameter', {
      Type: 'String',
      Value: 'value1',
      Name: '/dev/key1',
    })
  )
})

test('The Lambda function with the correct parameters and log retention', () => {
  const stack = createStack()
  expectCDK(stack).to(
    haveResourceLike('AWS::Lambda::Function', {
      Code: {
        S3Bucket: {},
      },
      Handler: 'dist/index.handler',
      Role: {},
      Runtime: 'nodejs12.x',
      MemorySize: 512,
    })
  )

  expectCDK(stack).to(haveResourceLike('Custom::LogRetention'))
})

test('The IAM Role and Policy for Lambda access to Parameter Store', () => {
  const stack = createStack()
  expectCDK(stack).to(haveResourceLike('AWS::IAM::Role'))

  expectCDK(stack).to(
    haveResourceLike(
      'AWS::IAM::Policy',
      deepObjectLike({
        PolicyDocument: {
          Statement: [
            {
              Action: 'ssm:GetParametersByPath',
              Effect: 'Allow',
              Resource: {},
            },
          ],
        },
      })
    )
  )
})

const createStack = () => {
  const app = new cdk.App()
  const stack = new LambdaSsmStack(app, 'SSMLambdaStack')
  return stack
}
