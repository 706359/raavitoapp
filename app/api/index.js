import { axios_ } from '../../utils/utils';

export const registerUser = async (name, mobile, password) => {
  try {
    const res = await axios_.post('/users/register', {
      name,
      mobile,
      password,
    });
    return res.data;
  } catch (err) {
    console.error('Registration error:', err);
    return { message: err?.response?.data?.message || 'Network error' };
  }
};
