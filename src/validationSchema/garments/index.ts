import * as yup from 'yup';

export const garmentValidationSchema = yup.object().shape({
  type: yup.string().required(),
  tailor_id: yup.string().nullable().required(),
});
