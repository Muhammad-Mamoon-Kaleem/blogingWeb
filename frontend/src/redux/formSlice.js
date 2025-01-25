import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSignup: false,
  forgetPassword: false,
  agreedToSendCode: false,
  formData: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  },
  errors: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    toggleForm(state) {
      state.isSignup = !state.isSignup;
      state.forgetPassword = false;
      state.formData = initialState.formData;
      state.errors = {};
    },
    toggleForgetPassword(state) {
      state.forgetPassword = !state.forgetPassword;
      state.isSignup = false;
      state.formData = initialState.formData;
      state.errors = {};
    },
    updateFormData(state, action) {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    setAgreedToSendCode(state, action) {
      state.agreedToSendCode = action.payload;
    },
    validateForm(state) {
      const errors = {};
      const { isSignup, forgetPassword, formData } = state;
      if (isSignup && !formData.name) {
        errors.name = 'Name is required';
      }
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      if ((isSignup || forgetPassword) && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if ((isSignup || forgetPassword) && !formData.confirmationCode) {
        errors.confirmationCode = 'Confirmation code is required';
      }
      state.errors = errors;
    },
  },
});

export const {
  toggleForm,
  toggleForgetPassword,
  updateFormData,
  setAgreedToSendCode,
  validateForm,
} = formSlice.actions;

export default formSlice.reducer;
