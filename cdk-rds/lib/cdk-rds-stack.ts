import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as nodeJsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambdaIntegration from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as path from 'node:path';

import {config} from 'dotenv';
import {resolve} from 'path';

config({path: resolve(__dirname, '../.env')});

const DEFAULT_ENV = {
  PG_USER: process.env.PG_USER || '',
  PG_PASS: process.env.PG_PASS || '',
  PG_DATABASE_NAME: process.env.PG_DATABASE_NAME || '',
  PG_HOST: process.env.PG_HOST || '',
  PG_PORT: process.env.PG_PORT || ''
};
export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sqlDatabaseLambdaIntegration = new nodeJsLambda.NodejsFunction(this, 'SQLDatabaseLambdaIntegration', {
      functionName: 'SQLDatabaseLambdaIntegration',
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../dist/lambda.js'),
      handler: 'handler',
      environment: DEFAULT_ENV,
      timeout: cdk.Duration.seconds(5),
      bundling: {
        externalModules: [
          'class-transformer',
          'class-validator',
          '@nestjs/websockets',
          '@nestjs/microservices',
        ]
      }
    });

    const httpApi = new  apiGateway.HttpApi(this, 'SQLDatabaseIntegrationAPI', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apiGateway.CorsHttpMethod.GET, apiGateway.CorsHttpMethod.POST],
        allowHeaders: ['*'],
        maxAge: cdk.Duration.days(10),
      }
    });

    httpApi.addRoutes({
      path: '/',
      methods: [apiGateway.HttpMethod.ANY],
      integration: new lambdaIntegration.HttpLambdaIntegration('SQLDatabaseLambdaRouteIntegration', sqlDatabaseLambdaIntegration),
    });
  }
}
