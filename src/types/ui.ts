import type React from 'react';

// UI Component Props
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'duckdark' | 'navy' | 'tertiary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps {
  id?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
  label?: string
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export interface ModalProps {
  isOpen: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'info' | 'warning' | 'danger'
  isLoading?: boolean // Added isLoading prop
}
