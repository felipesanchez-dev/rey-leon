'use client';
import { useState } from 'react';
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

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      setError(null);
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (!result?.ok) {
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









import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/env.mjs';
import { pagesOptions } from './pages-options';

export const authOptions: NextAuthOptions = {
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: token.user as typeof session.user,
        jwt: token.jwt as string,
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.idToken = user.id;
        if ('jwt' in user && typeof user.jwt === 'string') {
          token.jwt = user.jwt;
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error('Faltan las credenciales');
          }

          const temporaryToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQ0ODMxNDAxLCJleHAiOjE3NDc0MjM0MDF9.K9Uv8jzk5VGC4U8UG8qldKiNWgHMbf57zD2W8it_HGw'; // Cambia esto por un token seguro

          const res = await fetch(
            'https://reyleonback.s.cloudesarrollosmoyan.com/api/auth/local',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${temporaryToken}`,
              },
              body: JSON.stringify({
                identifier: credentials.identifier,
                password: credentials.password,
              }),
            }
          );

          if (!res.ok) {
            console.error('Error en la autenticación:', await res.text());
            throw new Error('Credenciales inválidas');
          }

          const data = (await res.json()) as { jwt?: string; user?: any };

          if (data?.jwt && data?.user) {
            return {
              id: data.user.id,
              name: data.user.username || data.user.name,
              email: data.user.email,
              jwt: data.jwt,
              ...data.user,
            };
          }

          throw new Error('Respuesta inválida de la API');
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
