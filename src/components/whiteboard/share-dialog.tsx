"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  whiteboardId: string
}

export function ShareDialog({ open, onOpenChange, whiteboardId }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [permission, setPermission] = useState("view")

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/whiteboard/${whiteboardId}`
      : `/whiteboard/${whiteboardId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share whiteboard</DialogTitle>
          <DialogDescription>Anyone with the link can access this whiteboard</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-y-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={shareUrl} readOnly className="h-9" />
          </div>
          <Button type="button" size="sm" className="px-3 ml-2" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Label htmlFor="permission">Permission</Label>
          <Select value={permission} onValueChange={setPermission}>
            <SelectTrigger id="permission">
              <SelectValue placeholder="Select permission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="view">Can view</SelectItem>
              <SelectItem value="edit">Can edit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4">
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

