# SSM Paramter Store caching with Lambda

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Steps

1. Create a `cdk.context.json` file in the root of this project with the regtion (optional).

```json
{
  "region": "us-east-1"
}
```

2. Run `yarn` (recommended) or `npm install`

3. Run `yarn deploy` to deploy the stack to your specified region. You can add a custom profile name if it is not `default`. You can learn about creating profiles using the aws-cli [here](https://docs.aws.amazon.com/cli/latest/reference/configure/#configure).

4. You can now test the Lambda from the console by creating a test event and notice Lambda use the execution context to cache Paramter Store values.

## Useful commands

- `yarn build` compile typescript to js
- `yarn watch` watch for changes and compile
- `yarn test` perform the jest unit tests
- `yarn cdk deploy` deploy this stack to your default AWS account/region
- `yarn cdk diff` compare deployed stack with current state
- `yarn cdk synth` emits the synthesized CloudFormation template
