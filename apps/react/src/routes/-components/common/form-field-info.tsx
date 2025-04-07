import type { AnyFieldApi as AnyFieldAPI } from '@tanstack/react-form'

export default function FormFieldInfo({ field }: { field: AnyFieldAPI }) {
  return (
    <div className="mt-2">
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="text-red-500">{field.state.meta.errors.map(e => e.message).join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </div>
  )
}
