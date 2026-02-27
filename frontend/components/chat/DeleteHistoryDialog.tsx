"use client"

import { AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteHistoryDialogProps {
  isOpen: boolean
  isSubmitting: boolean
  errorMessage?: string
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteHistoryDialog({
  isOpen,
  isSubmitting,
  errorMessage,
  onCancel,
  onConfirm,
}: DeleteHistoryDialogProps) {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onCancel()
      }}
    >
      <AlertDialogContent
        onEscapeKeyDown={onCancel}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
          }
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Excluir histórico
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é irreversível. O item de histórico será excluído e não
            poderá ser recuperado.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage ? (
          <div
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Excluindo..." : "Excluir"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
