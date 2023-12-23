"use client";
// Form
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import UploadItem from "../upload-item";

const formSchema = z.object({
  imageUrl: z
    .string()
    .min(3, { message: "Image Url should have at least 3 characters" }),
  name: z
    .string()
    .min(3, { message: "Server name should contain at least 3 characters." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateServer() {
  const [mounted, setHasMounted] = React.useState(false);
  //
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!mounted) return null;

  // Handler
  async function onSubmit(values: FormSchemaType) {
    try {
      const server = await axios.post(`/api/server/create`, values);

      form.reset();
      router.refresh();
      window.location.assign(`/server/${server.data.server.id}`);
    } catch (err) {
      console.log(err);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Dialog open>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your server a personality with the name and an icon. You can
            always change it later.
          </DialogDescription>

          {/* Upload Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Server image upload */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UploadItem endpoint={"imageUploader"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Server name form */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Server name..."
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
