"use client";

import type { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alert-modal";
import APIAlert from "@/components/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/image-upload";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

interface BillboardFormProps {
  initialData: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { storeId, billboardId } = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    setLoading(true);
    try {
      // let billboard;
      if (!initialData) {
        await axios.post(`/api/${storeId}/billboards`, data);
      } else {
        await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data);
      }
      // console.log(billboard.data);
      router.refresh();
      router.push(`/${storeId}/billboards`);
      toast.success(toastMsg);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
    // console.log(data);
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
      // console.log(del);
      router.refresh();
      router.push(`/${storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData
    ? "Edit your billboard"
    : "Create a new billboard";
  const toastMsg = initialData ? "Billboard updated." : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  return (
    <>
      <AlertModal
        open={open}
        loading={loading}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={loading}
                    onRemove={() => field.onChange("")}
                    onChange={(url) => field.onChange(url)}
                    values={field.value ? [field.value] : []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      <APIAlert
        title="TEST_TITLE"
        description={`${origin}/api/${storeId}/billboards/${billboardId}`}
        variant="public"
      />
    </>
  );
};

export default BillboardForm;
