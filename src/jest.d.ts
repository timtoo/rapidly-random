// see https://github.com/testing-library/react-testing-library/issues/36

declare namespace jest {
    interface Matchers<R> {
      toEqualWithMessage(recieved: any, target: any, message: string): CustomMatcherResult;
    }
  }