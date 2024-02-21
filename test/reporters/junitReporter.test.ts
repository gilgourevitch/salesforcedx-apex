/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { expect } from 'chai';
import { JUnitReporter } from '../../src';
import { getTestData } from './testResults';

const {
  testResults,
  junitResult,
  junitSuccess,
  junitCodeCov,
  junitDetailedCodeCov,
  junitMissingVal,
  successResult
} = getTestData();

describe('JUnit Reporter Tests', () => {
  const reporter = new JUnitReporter();

  it('should format test results with failures', () => {
    const result = reporter.format(testResults);
    expect(result).to.not.be.empty;
    expect(result).to.eql(junitResult);
    expect(result).to.contain('</failure>');
  });

  it('should format tests with 0 failures', async () => {
    const result = reporter.format(successResult);
    expect(result).to.not.be.empty;
    expect(result).to.eql(junitSuccess);
    expect(result).to.not.contain('</failure>');
  });

  it('should format test results with undefined or empty values', () => {
    successResult.summary.testRunId = '';
    successResult.summary.userId = undefined;

    const result = reporter.format(successResult);
    expect(result).to.not.be.empty;
    expect(result).to.eql(junitMissingVal);
    expect(result).to.not.contain('testRunId');
    expect(result).to.not.contain('userId');
  });

  it('should format test results with code coverage', () => {
    successResult.codecoverage = [
      {
        apexId: '001917xACG',
        name: 'ApexTestClass',
        type: 'ApexClass',
        numLinesCovered: 8,
        numLinesUncovered: 2,
        percentage: '12.5%',
        coveredLines: [1, 2, 3, 4, 5, 6, 7, 8],
        uncoveredLines: [9, 10]
      }
    ];
    successResult.summary.orgWideCoverage = '85%';
    const result = reporter.format(successResult);
    expect(result).to.not.be.empty;
    expect(result).to.eql(junitCodeCov);
    expect(result).to.contain('orgWideCoverage');
  });

  it('should format test results with detailed code coverage', () => {
    successResult.tests[0].perClassCoverage = [
      {
        apexClassOrTriggerName: 'ApexClass',
        apexClassOrTriggerId: '001917xACG',
        apexTestClassId: '001917xACG',
        apexTestMethodName: 'testMethod',
        numLinesCovered: 8,
        numLinesUncovered: 2,
        percentage: '12.5%',
        coverage: {
          coveredLines: [1, 2, 3, 4, 5, 6, 7, 8],
          uncoveredLines: [9, 10]
        }
      }
    ];
    successResult.summary.orgWideCoverage = '85%';
    const result = reporter.format(successResult);
    expect(result).to.not.be.empty;
    expect(result).to.eql(junitDetailedCodeCov);
    expect(result).to.contain('numLinesCovered');
    expect(result).to.contain('numLinesUncovered');
    expect(result).to.contain('percentage');
    expect(result).to.contain('coveredLines');
    expect(result).to.contain('uncoveredLines');
  });
});
