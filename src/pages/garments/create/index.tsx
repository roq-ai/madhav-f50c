import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createGarment } from 'apiSdk/garments';
import { Error } from 'components/error';
import { garmentValidationSchema } from 'validationSchema/garments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { TailorInterface } from 'interfaces/tailor';
import { getTailors } from 'apiSdk/tailors';
import { GarmentInterface } from 'interfaces/garment';

function GarmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: GarmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createGarment(values);
      resetForm();
      router.push('/garments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<GarmentInterface>({
    initialValues: {
      type: '',
      tailor_id: (router.query.tailor_id as string) ?? null,
    },
    validationSchema: garmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Garment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="type" mb="4" isInvalid={!!formik.errors?.type}>
            <FormLabel>Type</FormLabel>
            <Input type="text" name="type" value={formik.values?.type} onChange={formik.handleChange} />
            {formik.errors.type && <FormErrorMessage>{formik.errors?.type}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<TailorInterface>
            formik={formik}
            name={'tailor_id'}
            label={'Select Tailor'}
            placeholder={'Select Tailor'}
            fetcher={getTailors}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'garment',
  operation: AccessOperationEnum.CREATE,
})(GarmentCreatePage);
