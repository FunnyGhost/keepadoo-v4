/* istanbul ignore next */
export const routerMock = {
  navigateByUrl: jest.fn(),
  navigate: jest.fn()
};

/* istanbul ignore next */
export const sessionQueryMock = {
  isLoggedIn: jest.fn()
};

/* istanbul ignore next */
export const sessionStoreMock = {
  login: jest.fn()
};

/* istanbul ignore next */
export const authServiceMock = {
  signIn: jest.fn(),
  signOut: jest.fn()
};
