import { Field, FieldContent, FieldDescription, FieldLabel } from '@workspace/ui/components/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Switch } from '@workspace/ui/components/switch'

import type { OptionItem } from '@/types/option'

interface SelectFieldProps<TValue extends string> extends React.ComponentProps<typeof Field> {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  options: OptionItem<TValue>[]
  value: TValue
  onValueChange: (value: TValue) => void
}

export function SelectField<TValue extends string>({
  id,
  label,
  description,
  options,
  value,
  onValueChange,
  ...props
}: SelectFieldProps<TValue>): React.ReactNode {
  return (
    <Field {...props}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        items={options}
        value={value}
        onValueChange={(next) => {
          if (next !== null)
            onValueChange(next)
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

interface SwitchFieldProps extends React.ComponentProps<typeof Field> {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function SwitchField({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  ...props
}: SwitchFieldProps): React.ReactNode {
  return (
    <Field orientation="horizontal" {...props}>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </Field>
  )
}
