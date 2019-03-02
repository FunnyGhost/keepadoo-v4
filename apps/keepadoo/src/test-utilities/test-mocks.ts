/* istanbul ignore next */
export const routerMock = {
  url: 'i-am-batman',
  navigateByUrl: jest.fn(),
  navigate: jest.fn()
};

/* istanbul ignore next */
export const sessionQueryMock = {
  isLoggedIn: jest.fn()
};

/* istanbul ignore next */
export const sessionStoreMock = {
  update: jest.fn(),
  login: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn()
};

/* istanbul ignore next */
export const authServiceMock = {
  signIn: jest.fn(),
  signOut: jest.fn()
};
