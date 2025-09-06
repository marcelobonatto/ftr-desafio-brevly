import { type ChangeEventHandler, type FocusEvent, type FocusEventHandler } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputWithLabelProps {
    id: string
    label: string
    type: 'url' | 'text'
    placeholder: string
    pattern?: string

    onValueChange: (value: string) => void
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void
}

export function InputWithLabel({ id, label, type, placeholder, pattern, onValueChange, onBlur }: InputWithLabelProps) {
    const change: ChangeEventHandler<HTMLInputElement> = (event) => {
        onValueChange(event.target.value)
    }

    const blur: FocusEventHandler<HTMLInputElement> = (event) => {
        if (onBlur !== undefined) onBlur(event)
    }

    return (
        <div className="flex flex-col gap-2 focus-within:text-blue-800 transition-colors duration-200">
            <Label htmlFor={id} className="text-xs leading-4 uppercase font-normal">{label}</Label>
            <Input type={type} id={id} className="focus-visible:border-blue-800 focus-visible:ring-2 focus-visible:ring-ring invalid:border-pink-700 invalid:ring-2 invalid:ring-ring"
                   placeholder={placeholder} onChange={change} onBlur={blur} pattern={pattern} />
        </div>
    )
}