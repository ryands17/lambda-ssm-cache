#!/bin/bash
set -ex -o pipefail

(cd lambda-fns && yarn package)
yarn test --coverage --maxWorkers=2
