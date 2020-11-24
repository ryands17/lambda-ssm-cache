#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaSsmStack } from '../lib/lambda-ssm-stack';

const app = new cdk.App();
new LambdaSsmStack(app, 'LambdaSsmStack');
