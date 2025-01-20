// tests/helpers/reporter.js
class CustomReporter {
  jasmineStarted(suiteInfo) {
    console.log('Running suite with ' + suiteInfo.totalSpecsDefined + ' specs');
  }

  suiteStarted(result) {
    console.log('\n' + result.description);
  }

  specStarted(result) {
    process.stdout.write(result.description + ': ');
  }

  specDone(result) {
    if (result.status === 'passed') {
      process.stdout.write('✓\n');
    } else if (result.status === 'failed') {
      process.stdout.write('✗\n');
      console.log('\nFailures:');
      result.failedExpectations.forEach(function(failed) {
        console.log('\t' + failed.message);
        console.log('\t' + failed.stack);
      });
    }
  }

  suiteDone(result) {
    if (result.failedExpectations.length > 0) {
      console.log('\nSuite Failed:');
      result.failedExpectations.forEach(function(failed) {
        console.log('\t' + failed.message);
        console.log('\t' + failed.stack);
      });
    }
  }

  jasmineDone(result) {
    if (result.overallStatus === 'passed') {
      console.log('\nAll specs passed!');
    } else {
      console.log('\nFailed specs!');
    }
    if (result.failedExpectations.length > 0) {
      console.log('Global failures:');
      result.failedExpectations.forEach(function(failed) {
        console.log('\t' + failed.message);
        console.log('\t' + failed.stack);
      });
    }
  }
}

export default CustomReporter;