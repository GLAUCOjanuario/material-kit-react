'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Componentes do Material UI
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Ícones (phosphor-icons)
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';

// ----------------------------------------------------------------------------
// 1. Schema de validação (Zod)
const schema = zod.object({
  username: zod.string().min(1, { message: 'Usuário obrigatório' }),
  password: zod.string().min(1, { message: 'Senha obrigatória' })
});

// Tipagem derivada do schema
type Values = zod.infer<typeof schema>;

// Valores iniciais (opcional)
const defaultValues: Values = {
  username: '',
  password: ''
};

// ----------------------------------------------------------------------------
// 2. Componente de Login
export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  // Hook do react-hook-form
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema)
  });

  // Função chamada ao enviar o formulário
  const onSubmit = React.useCallback(
    async (values: Values) => {
      setIsPending(true);

      try {
        // Chamada ao seu endpoint Django Ninja
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: values.username,
            password: values.password
          })
        });

        if (!response.ok) {
          throw new Error('Credenciais inválidas');
        }

        // Exemplo: se o backend retorna { "token": "JWT_xxx" }
        const data = await response.json();

        // Armazene o token localmente (caso use JWT)
        localStorage.setItem('token', data.token);

        // Redirecione para uma rota protegida (ex. /dashboard)
        router.push('/dashboard');
      } catch (error) {
        // Exibir mensagem de erro no formulário
        setError('root', { type: 'server', message: (error as Error).message });
        setIsPending(false);
      }
    },
    [router, setError]
  );

  // ----------------------------------------------------------------------------
  // 3. Renderização do formulário
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign In</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Campo username */}
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <FormControl error={Boolean(errors.username)}>
                <InputLabel>Usuário</InputLabel>
                <OutlinedInput {...field} label="Usuário" type="text" />
                {errors.username && <FormHelperText>{errors.username.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Campo password */}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Senha</InputLabel>
                <OutlinedInput
                  {...field}
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Exibir erro geral (root) */}
          {errors.root && (
            <Alert color="error">
              {errors.root.message}
            </Alert>
          )}

          {/* Botão de submit */}
          <Button disabled={isPending} type="submit" variant="contained">
            Entrar
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
