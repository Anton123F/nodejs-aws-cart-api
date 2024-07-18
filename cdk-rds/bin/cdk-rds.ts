#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-rds-stack';

const app = new cdk.App();
new CdkStack(app, 'CdkRdsStack');