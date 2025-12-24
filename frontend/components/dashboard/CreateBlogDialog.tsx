// // "use client";

// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Button } from "@/components/ui/button";
// // import { useState } from "react";
// // import api from "@/lib/api";
// // import { useToast } from "@/components/ui/use-toast";

// // export default function CreateBlogDialog({ children }: { children: React.ReactNode }) {
// //   const { toast } = useToast();
// //   const [open, setOpen] = useState(false);
// //   const [form, setForm] = useState({
// //     title: "",
// //     content: "",
// //     image: "",
// //   });

// //   const handleCreate = async () => {
// //     try {
// //       await api.post("/blogs", form);

// //       toast({
// //         title: "Blog Created 🎉",
// //         description: "Your blog has been published successfully.",
// //       });

// //       setForm({ title: "", content: "", image: "" });
// //       setOpen(false);
// //     } catch (err: any) {
// //       toast({
// //         title: "Error",
// //         description: err.response?.data?.error || "Could not create blog.",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={setOpen}>
// //       <DialogTrigger asChild>{children}</DialogTrigger>

// //       <DialogContent>
// //         <DialogHeader>
// //           <DialogTitle>Create a New Blog</DialogTitle>
// //         </DialogHeader>

// //         <div className="space-y-4">
// //           <Input
// //             placeholder="Blog Title"
// //             value={form.title}
// //             onChange={(e) => setForm({ ...form, title: e.target.value })}
// //           />

// //           <Textarea
// //             placeholder="Content..."
// //             className="h-32"
// //             value={form.content}
// //             onChange={(e) => setForm({ ...form, content: e.target.value })}
// //           />

// //           <Input
// //             placeholder="Image URL (optional)"
// //             value={form.image}
// //             onChange={(e) => setForm({ ...form, image: e.target.value })}
// //           />

// //           <Button className="w-full" onClick={handleCreate}>
// //             Create Blog
// //           </Button>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import api from "@/lib/api";
// import { useToast } from "@/components/ui/use-toast";

// type BlogForm = {
//   _id?: string;
//   title: string;
//   content: string;
//   image?: string;
// };

// type Props = {
//   children: React.ReactNode;
//   mode?: "create" | "edit";
//   blog?: BlogForm;
//   onSuccess?: () => void;
// };

// export default function CreateBlogDialog({
//   children,
//   mode = "create",
//   blog,
//   onSuccess,
// }: Props) {
//   const { toast } = useToast();
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState<BlogForm>({
//     title: "",
//     content: "",
//     image: "",
//   });

//   // ✅ Prefill form when editing
//   useEffect(() => {
//     if (mode === "edit" && blog && open) {
//       setForm({
//         title: blog.title,
//         content: blog.content,
//         image: blog.image || "",
//         _id: blog._id,
//       });
//     }

//     if (mode === "create" && open) {
//       setForm({ title: "", content: "", image: "" });
//     }
//   }, [mode, blog, open]);

//   const handleSubmit = async () => {
//     if (!form.title || !form.content) {
//       toast({
//         title: "Missing fields",
//         description: "Title and content are required.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setLoading(true);

//       if (mode === "create") {
//         await api.post("/blogs", form);
//         toast({
//           title: "Blog Created 🎉",
//           description: "Your blog has been published successfully.",
//         });
//       } else {
//         await api.put(`/blogs/${form._id}`, form);
//         toast({
//           title: "Blog Updated ✨",
//           description: "Your changes have been saved.",
//         });
//       }

//       setOpen(false);
//       onSuccess?.();
//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description:
//           err.response?.data?.error || "Something went wrong.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>{children}</DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "create" ? "Create New Blog" : "Edit Blog"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <Input
//             placeholder="Blog title"
//             value={form.title}
//             onChange={(e) =>
//               setForm({ ...form, title: e.target.value })
//             }
//           />

//           <Textarea
//             placeholder="Write your content..."
//             className="h-40"
//             value={form.content}
//             onChange={(e) =>
//               setForm({ ...form, content: e.target.value })
//             }
//           />

//           <Input
//             placeholder="Image URL (optional)"
//             value={form.image}
//             onChange={(e) =>
//               setForm({ ...form, image: e.target.value })
//             }
//           />

//           <Button
//             className="w-full"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading
//               ? "Saving..."
//               : mode === "create"
//               ? "Create Blog"
//               : "Save Changes"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import api from "@/lib/api";
// import { useToast } from "@/components/ui/use-toast";

// type Props = {
//   children: React.ReactNode;
//   mode?: "create" | "edit";
//   blog?: any;
//   onClose?: () => void;
// };

// export default function CreateBlogDialog({
//   children,
//   mode = "create",
//   blog,
//   onClose,
// }: Props) {
//   const { toast } = useToast();
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     image: "",
//   });

//   // ✅ Prefill form in edit mode
//   useEffect(() => {
//     if (mode === "edit" && blog) {
//       setForm({
//         title: blog.title || "",
//         content: blog.content || "",
//         image: blog.image || "",
//       });
//       setOpen(true);
//     }
//   }, [mode, blog]);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       if (mode === "edit") {
//         await api.put(`/blogs/${blog._id}`, form);
//         toast({
//           title: "Blog Updated ✅",
//           description: "Your blog has been updated successfully.",
//         });
//       } else {
//         await api.post("/blogs", form);
//         toast({
//           title: "Blog Created 🎉",
//           description: "Your blog has been published successfully.",
//         });
//       }

//       setForm({ title: "", content: "", image: "" });
//       setOpen(false);
//       onClose?.();
//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description:
//           err.response?.data?.error ||
//           `Could not ${mode === "edit" ? "update" : "create"} blog.`,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(o) => {
//         setOpen(o);
//         if (!o) onClose?.();
//       }}
//     >
//       <DialogTrigger asChild>{children}</DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "edit" ? "Edit Blog" : "Create a New Blog"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <Input
//             placeholder="Blog Title"
//             value={form.title}
//             onChange={(e) =>
//               setForm({ ...form, title: e.target.value })
//             }
//           />

//           <Textarea
//             placeholder="Content..."
//             className="h-32"
//             value={form.content}
//             onChange={(e) =>
//               setForm({ ...form, content: e.target.value })
//             }
//           />

//           <Input
//             placeholder="Image URL (optional)"
//             value={form.image}
//             onChange={(e) =>
//               setForm({ ...form, image: e.target.value })
//             }
//           />

//           <Button
//             className="w-full"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading
//               ? "Saving..."
//               : mode === "edit"
//               ? "Update Blog"
//               : "Create Blog"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  children: React.ReactNode;
  mode?: "create" | "edit";
  blog?: any;
  onClose?: () => void;
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export default function CreateBlogDialog({
  children,
  mode = "create",
  blog,
  onClose,
}: Props) {
  const { toast } = useToast();
  const titleRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  /* ---------------- Autofocus + Prefill ---------------- */
  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (mode === "edit" && blog) {
      setForm({
        title: blog.title || "",
        content: blog.content || "",
        image: blog.image || "",
      });
      setOpen(true);
    }
  }, [mode, blog]);

  /* ---------------- Image Validation ---------------- */
  const handleImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Only image files are allowed.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "Image too large",
        description: "Max image size is 2MB.",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    setForm({ ...form, image: URL.createObjectURL(file) });
  };

  /* ---------------- Upload Image ---------------- */
  const uploadImage = async () => {
    if (!imageFile) return form.image;

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        title: form.title,
        content: form.content, // markdown
        image: imageUrl,
      };

      if (mode === "edit") {
        await api.put(`/blogs/${blog._id}`, payload);
        toast({
          title: "Blog Updated ✅",
          description: "Your blog has been updated successfully.",
        });
      } else {
        await api.post("/blogs", payload);
        toast({
          title: "Blog Created 🎉",
          description: "Your blog has been published successfully.",
        });
      }

      setForm({ title: "", content: "", image: "" });
      setImageFile(null);
      setOpen(false);
      onClose?.();
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.error ||
          `Could not ${mode === "edit" ? "update" : "create"} blog.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) onClose?.();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Blog" : "Create a New Blog"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <Input
            ref={titleRef}
            placeholder="Blog Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          {/* Markdown Content */}
          <Textarea
            placeholder="Write your blog in Markdown..."
            className="h-40 font-mono"
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
          />

          {/* Drag & Drop Image */}
          <div
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleImage(file);
            }}
            onClick={() =>
              document.getElementById("blog-image-input")?.click()
            }
          >
            <input
              id="blog-image-input"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImage(file);
              }}
            />

            {form.image ? (
              <img
                src={form.image}
                alt="Preview"
                className="h-40 w-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-sm text-gray-500">
                Drag & drop image here or click to upload (max 2MB)
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : mode === "edit"
              ? "Update Blog"
              : "Create Blog"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
