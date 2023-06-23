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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getGarmentById, updateGarmentById } from 'apiSdk/garments';
import { Error } from 'components/error';
import { garmentValidationSchema } from 'validationSchema/garments';
import { GarmentInterface } from 'interfaces/garment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { TailorInterface } from 'interfaces/tailor';
import { getTailors } from 'apiSdk/tailors';

function GarmentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<GarmentInterface>(
    () => (id ? `/garments/${id}` : null),
    () => getGarmentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: GarmentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateGarmentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/garments');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<GarmentInterface>({
    initialValues: data,
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
            Edit Garment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'garment',
  operation: AccessOperationEnum.UPDATE,
})(GarmentEditPage);
