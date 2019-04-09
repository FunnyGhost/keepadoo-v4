/* istanbul ignore next */
export const routerMock = {
  url: 'i-am-batman',
  navigateByUrl: jest.fn(),
  navigate: jest.fn()
};

/* istanbul ignore next */
export const sessionQueryMock = {
  isLoggedIn: jest.fn(),
  redirectUrl: jest.fn(),
  userId: jest.fn()
};

/* istanbul ignore next */
export const sessionStoreMock = {
  update: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn()
};

/* istanbul ignore next */
export const authServiceMock = {
  signIn: jest.fn(),
  signOut: jest.fn()
};

/* istanbul ignore next */
export const moviesListsStoreMock = {
  set: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  setActive: jest.fn(),
  removeActive: jest.fn()
};

/* istanbul ignore next */
export const moviesListsQueryMock = {
  selectAll: jest.fn()
};

/* istanbul ignore next */
export const moviesStoreMock = {
  set: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
};

/* istanbul ignore next */
export const moviesQueryMock = {};
