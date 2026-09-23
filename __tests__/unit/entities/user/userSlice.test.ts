import { userReducer, setUser } from '@/entities/user/model/userSlice';
import { selectCurrentUser } from '@/entities/user/model/selectors';
import type { User, UserState } from '@/entities/user/model/types';

const INITIAL_STATE: UserState = { currentUser: null };

const MOCK_USER: User = {
  id: 'user-001',
  username: 'johndoe',
  email: 'john@example.com',
  name: 'John Doe',
};

describe('userSlice — reducers', () => {
  it('returns the initial state for unknown actions', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toEqual(INITIAL_STATE);
  });

  it('setUser — stores a user in state', () => {
    const state = userReducer(INITIAL_STATE, setUser(MOCK_USER));
    expect(state.currentUser).toEqual(MOCK_USER);
  });

  it('setUser — accepts null to clear user', () => {
    const withUser: UserState = { currentUser: MOCK_USER };
    const state = userReducer(withUser, setUser(null));
    expect(state.currentUser).toBeNull();
  });

  it('session/clearSession extraReducer — resets currentUser to null', () => {
    const withUser: UserState = { currentUser: MOCK_USER };
    const state = userReducer(withUser, { type: 'session/clearSession' });
    expect(state.currentUser).toBeNull();
  });
});

describe('userSlice — selectors', () => {
  it('selectCurrentUser returns null from initial state', () => {
    expect(selectCurrentUser({ user: INITIAL_STATE })).toBeNull();
  });

  it('selectCurrentUser returns the stored user', () => {
    const state = { user: { currentUser: MOCK_USER } };
    expect(selectCurrentUser(state)).toEqual(MOCK_USER);
  });
});
