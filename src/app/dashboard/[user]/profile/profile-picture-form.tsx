"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getInitials } from "@/lib/utils"
import { uploadProfilePicture } from "@/lib/api"
import type { User } from "@/lib/types"
import { Camera, Upload, X } from "lucide-react"

interface ProfilePictureFormProps {
  user: User
}

export function ProfilePictureForm({ user }: ProfilePictureFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return

    setIsUploading(true)

    try {
      const file = fileInputRef.current.files[0]
      await uploadProfilePicture(file)

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      })

      // Reset the file input and preview
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setPreviewImage(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem uploading your profile picture. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.profilePicture || undefined} alt={user.firstName} />
            <AvatarFallback className="text-2xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">Current Picture</p>
        </div>

        {previewImage && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-primary">
              <Image src={previewImage || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            </div>
            <p className="text-sm text-muted-foreground">Preview</p>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Upload New Picture</h3>
              <p className="text-sm text-muted-foreground">
                Upload a new profile picture. The image should be square and at least 200x200 pixels.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Camera className="h-4 w-4" />
                Select Image
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              {previewImage && (
                <>
                  <Button type="button" onClick={handleUpload} disabled={isUploading} className="gap-2">
                    <Upload className="h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Supported formats: JPEG, PNG, GIF</p>
              <p>Maximum file size: 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

