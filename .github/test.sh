#!/bin/bash
set -ex -o pipefail
yarn test --coverage --maxWorkers=2
