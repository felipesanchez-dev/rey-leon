'use client';
import { useState } from 'react';
import { PiChecksBold, PiFilesBold, PiXBold } from 'react-icons/pi';
import { RgbaColorPicker } from 'react-colorful';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Input, Button, Tooltip, ActionIcon, Title, Checkbox } from 'rizzui';
import { useCopyToClipboard } from '@core/hooks/use-copy-to-clipboard';
import { useSession } from 'next-auth/react'; // Para obtener el token JWT
import {
  CreateRoleInput,
  createRoleSchema,
} from '@/validators/create-role.schema';
import { useModal } from '@/app/shared/modal-views/use-modal';

export default function CreateRole() {
  const { closeModal } = useModal();
  const { data: session } = useSession();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();

  // Estado para los permisos
  const [permissions, setPermissions] = useState({
    find: false,
    create: false,
    update: false,
    delete: false,
  });

  const handlePermissionChange = (permission: 'find' | 'create' | 'update' | 'delete') => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const onSubmit: SubmitHandler<CreateRoleInput> = async (data) => {
    setLoading(true);

    const body = {
      name: data.roleName,
      description: `Rol creado desde el frontend con color: rgba(${data.roleColor?.r ?? 0}, ${data.roleColor?.g ?? 0}, ${data.roleColor?.b ?? 0}, ${data.roleColor?.a ?? 0})`,
      permissions: {
        'api::noticia.noticia': {
          controllers: {
            noticia: {
              find: { enabled: permissions.find },
              create: { enabled: permissions.create },
              update: { enabled: permissions.update },
              delete: { enabled: permissions.delete },
            },
          },
        },
      },
    };

    try {
      const response = await fetch(
        'https://reyleonback.s.cloudesarrollosmoyan.com/api/users-permissions/roles',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any)?.jwt}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creando rol:', errorData);
        alert('Error al crear el rol 😢');
      } else {
        const result = await response.json();
        console.log('Rol creado exitosamente:', result);
        alert('Rol creado exitosamente ✅');
        setReset({
          roleName: '',
          roleColor: '',
        });
        closeModal();
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar al servidor 🚨');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (rgba: string) => {
    copyToClipboard(rgba);

    setIsCopied(() => true);
    setTimeout(() => {
      setIsCopied(() => false);
    }, 3000); // Recargar componente
  };

  return (
    <Form<CreateRoleInput>
      onSubmit={onSubmit}
      validationSchema={createRoleSchema}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, watch, formState: { errors } }) => {
        const getColor = watch('roleColor');
        const colorCode = `rgba(${getColor?.r ?? 0}, ${getColor?.g ?? 0}, ${
          getColor?.b ?? 0
        }, ${getColor?.a ?? 0})`;

        return (
          <>
            <div className="flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Crear Nuevo Rol
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>

            <Input
              label="Role Name"
              placeholder="Nombre del Rol"
              {...register('roleName')}
              error={errors.roleName?.message}
            />

            <Input
              label="Color del Rol"
              placeholder="Role Color"
              readOnly
              inputClassName="hover:border-muted"
              suffix={
                <Tooltip
                  size="sm"
                  content={isCopied ? 'Copied to Clipboard' : 'Click to Copy'}
                  placement="top"
                  className="z-[1000]"
                >
                  <ActionIcon
                    variant="text"
                    title="Click to Copy"
                    onClick={() => handleCopyToClipboard(colorCode)}
                    className="-mr-3"
                  >
                    {isCopied ? (
                      <PiChecksBold className="h-[18px] w-[18px]" />
                    ) : (
                      <PiFilesBold className="h-4 w-4" />
                    )}
                  </ActionIcon>
                </Tooltip>
              }
              value={colorCode}
            />

            <Controller
              control={control}
              name="roleColor"
              render={({ field: { onChange, value } }) => (
                <RgbaColorPicker color={value} onChange={onChange} />
              )}
            />

            <div className="mt-4">
              <Title as="h5">Permisos</Title>
              <div className="flex flex-col gap-2">
                <Checkbox
                  label="Gestión de Usuarios"
                  checked={permissions.find}
                  onChange={() => handlePermissionChange('find')}
                />
                <Checkbox
                  label="Gestión de Roles"
                  checked={permissions.create}
                  onChange={() => handlePermissionChange('create')}
                />
                <Checkbox
                  label="Gestión de Configuración"
                  checked={permissions.update}
                  onChange={() => handlePermissionChange('update')}
                />
                <Checkbox
                  label="Permitir eliminar"
                  checked={permissions.delete}
                  onChange={() => handlePermissionChange('delete')}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={closeModal}
                className="w-full @xl:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full @xl:w-auto"
              >
                Crear Rol
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
