'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { loginSchema, LoginSchema } from '@/validators/login.schema';

const initialValues: LoginSchema = {
  identifier: '',
  password: '',
  rememberMe: true,
};

export default function SignInForm() {
  const [reset, setReset] = useState({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      setError(null);
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/');
      } else {
        setError(result?.error || 'Error desconocido al iniciar sesión');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      console.error('Error en el inicio de sesión:', err);
    }
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label="Email"
              placeholder="Ingrese su email"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('identifier')}
              error={errors.identifier?.message}
            />
            <Password
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-2">
              <Checkbox
                {...register('rememberMe')}
                label="Recordar"
                className="[&>label>span]:font-medium"
              />
            </div>
            <Button className="w-full" type="submit" size="lg">
              <span>Iniciar sesión</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>

            {error && (
              <div className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}
      </Form>
    </>
  );
}