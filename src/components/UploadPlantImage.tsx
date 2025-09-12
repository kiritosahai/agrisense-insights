import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

interface Props {
  fieldId: Id<"fields">;
}

export default function UploadPlantImage({ fieldId }: Props) {
  const getUploadUrl = useAction(api.uploads.getUploadUrl);
  const savePlantImage = useMutation(api.plantImages.savePlantImage);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async () => {
    try {
      if (!file) {
        toast.error("Please select an image file");
        return;
      }
      setIsUploading(true);

      const { uploadUrl } = await getUploadUrl();

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: await file.arrayBuffer(),
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await res.json();

      await savePlantImage({
        storageId,
        fieldId,
        title: title || undefined,
        notes: notes || undefined,
      });

      toast.success("Image uploaded");
      setFile(null);
      setTitle("");
      setNotes("");
    } catch (e) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5" />
          Upload Plant Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <Input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button className="w-full" onClick={onUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </CardContent>
    </Card>
  );
}
