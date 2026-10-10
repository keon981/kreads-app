import { Field, FieldContent, FieldDescription, FieldLabel } from '@workspace/ui/components/field'
import { Switch } from '@workspace/ui/components/switch'

interface SwitchFieldProps
  extends React.ComponentProps<typeof Field>,
  Pick<React.ComponentProps<typeof Switch>, 'name' | 'checked' | 'defaultChecked' | 'onCheckedChange' | 'disabled'> {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
}

export function SwitchField({
  id,
  label,
  description,
  name,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...props
}: SwitchFieldProps): React.ReactNode {
  return (
    <Field orientation="horizontal" data-disabled={disabled} {...props}>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <Switch
        id={id}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </Field>
  )
}
