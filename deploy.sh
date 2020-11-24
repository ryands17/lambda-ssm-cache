#!/bin/bash
(cd lambda-fns && yarn package)
yarn cdk deploy
