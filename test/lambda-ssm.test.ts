import {
  deepObjectLike,
  expect as expectCDK,
  haveResourceLike,
} from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { Code, CodeConfig } from '@aws-cdk/aws-lambda'
import { LambdaSsmStack } from '../lib/lambda-ssm-stack'

let fromAssetMock: jest.SpyInstance

beforeAll(() => {
  fromAssetMock = jest.spyOn(Code, 'fromAsset').mockReturnValue({
    isInline: false,
    bind: (): CodeConfig => {
      return {
        s3Location: {
          bucketName: 'my-bucket',
          objectKey: 'my-key',
        },
      }
    },
    bindToResource: () => {
      return
    },
  } as any)
})

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
      Code: {},
      Handler: 'index.handler',
      Role: {},
      Environment: {
        Variables: {
          NODE_OPTIONS: '--enable-source-maps',
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
      },
      Runtime: 'nodejs14.x',
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

afterAll(() => {
  fromAssetMock?.mockRestore()
})
