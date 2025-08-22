import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button Component', () => {
  const defaultProps = {
    children: 'Test Button',
    onClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders button with correct text', () => {
    render(<Button {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<Button {...defaultProps} />)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('applies default variant and size classes', () => {
    render(<Button {...defaultProps} />)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('bg-blue-600', 'px-4', 'py-2')
  })

  it('applies custom variant classes', () => {
    render(<Button {...defaultProps} variant="secondary" />)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('bg-gray-200', 'text-gray-700')
    expect(button).not.toHaveClass('bg-blue-600')
  })

  it('applies custom size classes', () => {
    render(<Button {...defaultProps} size="lg" />)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  it('applies fullWidth class when fullWidth is true', () => {
    render(<Button {...defaultProps} fullWidth />)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('w-full')
  })

  it('shows loading state when loading is true', () => {
    render(<Button {...defaultProps} loading />)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button {...defaultProps} className="custom-class" />)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('custom-class')
  })

  it('renders as different HTML element when as prop is provided', () => {
    render(<Button {...defaultProps} as="a" href="/test" />)
    const link = screen.getByRole('link')
    
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('applies disabled state correctly', () => {
    render(<Button {...defaultProps} disabled />)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('handles all variant types correctly', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning']
    
    variants.forEach(variant => {
      const { unmount } = render(
        <Button {...defaultProps} variant={variant as any} />
      )
      const button = screen.getByRole('button')
      
      expect(button).toBeInTheDocument()
      unmount()
    })
  })

  it('handles all size types correctly', () => {
    const sizes = ['sm', 'md', 'lg', 'xl']
    
    sizes.forEach(size => {
      const { unmount } = render(
        <Button {...defaultProps} size={size as any} />
      )
      const button = screen.getByRole('button')
      
      expect(button).toBeInTheDocument()
      unmount()
    })
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button {...defaultProps} ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('applies hover and focus states', () => {
    render(<Button {...defaultProps} />)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('hover:bg-blue-700', 'focus:outline-none', 'focus:ring-2')
  })

  it('shows loading text when loading and loadingText provided', () => {
    render(
      <Button {...defaultProps} loading loadingText="Cargando...">
        Original Text
      </Button>
    )
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
    expect(screen.queryByText('Original Text')).not.toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(
      <Button {...defaultProps} aria-label="Custom label" data-testid="custom-button" />
    )
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('aria-label', 'Custom label')
    expect(button).toHaveAttribute('data-testid', 'custom-button')
  })
})
