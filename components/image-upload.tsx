import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        await onUpload(file)
      } catch (error) {
        console.error("Error uploading file:", error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="image-upload" />
      <label htmlFor="image-upload">
        <Button as="span" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
      </label>
    </div>
  )
}

export default ImageUpload

