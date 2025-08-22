import type { Meta, StoryObj } from '@storybook/react'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de botón reutilizable con múltiples variantes, tamaños y estados.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning'],
      description: 'Variante visual del botón',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del botón',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carga del botón',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado deshabilitado del botón',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Botón de ancho completo',
    },
    as: {
      control: { type: 'select' },
      options: ['button', 'a', 'span'],
      description: 'Elemento HTML a renderizar',
    },
    onClick: {
      action: 'clicked',
      description: 'Función llamada al hacer clic',
    },
  },
  args: {
    children: 'Botón',
    onClick: () => console.log('Botón clickeado'),
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Story básico
export const Default: Story = {
  args: {},
}

// Story con variante primaria
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Botón Primario',
  },
}

// Story con variante secundaria
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Botón Secundario',
  },
}

// Story con variante de éxito
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Botón de Éxito',
  },
}

// Story con variante de peligro
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Botón de Peligro',
  },
}

// Story con variante de advertencia
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Botón de Advertencia',
  },
}

// Story con tamaño pequeño
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Botón Pequeño',
  },
}

// Story con tamaño mediano
export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Botón Mediano',
  },
}

// Story con tamaño grande
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Botón Grande',
  },
}

// Story con tamaño extra grande
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Botón Extra Grande',
  },
}

// Story con estado de carga
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Cargando...',
  },
}

// Story con estado deshabilitado
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Botón Deshabilitado',
  },
}

// Story con ancho completo
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Botón de Ancho Completo',
  },
  parameters: {
    layout: 'padded',
  },
}

// Story como enlace
export const AsLink: Story = {
  args: {
    as: 'a',
    href: 'https://example.com',
    children: 'Enlace como Botón',
  },
}

// Story con texto de carga personalizado
export const CustomLoadingText: Story = {
  args: {
    loading: true,
    loadingText: 'Procesando...',
    children: 'Enviar Formulario',
  },
}

// Story con clase personalizada
export const CustomClassName: Story = {
  args: {
    className: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    children: 'Botón Personalizado',
  },
}

// Story con icono
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Agregar Item
      </>
    ),
  },
}

// Story con múltiples variantes
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="warning">Warning</Button>
      </div>
      <div className="flex space-x-2">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

// Story con estados interactivos
export const Interactive: Story = {
  args: {
    children: 'Botón Interactivo',
  },
  parameters: {
    docs: {
      description: {
        story: 'Este botón muestra diferentes estados al interactuar con él.',
      },
    },
  },
}

// Story con accesibilidad
export const Accessibility: Story = {
  args: {
    children: 'Botón Accesible',
    'aria-label': 'Botón para realizar acción importante',
    'aria-describedby': 'button-description',
  },
  render: (args) => (
    <div>
      <Button {...args} />
      <p id="button-description" className="text-sm text-gray-600 mt-2">
        Descripción del botón para lectores de pantalla.
      </p>
    </div>
  ),
}
