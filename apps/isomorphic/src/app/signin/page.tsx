import AuthWrapperTwo from '@/app/shared/auth-layout/auth-wrapper-two';
import SignInForm from './sign-in-form';
import { metaObject } from '@/config/site.config';


export const metadata = {
  ...metaObject('Iniciar sesión'),
};

export default function SignIn() {
  return (
    <AuthWrapperTwo title="Iniciar sesión" isSignIn isSocialLoginActive={true}>
      <SignInForm />
    </AuthWrapperTwo>
  );
}
