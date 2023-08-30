"use client";

import type { Color } from "@prisma/client";
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
// import APIAlert from "@/components/api-alert";
// import { useOrigin } from "@/hooks/use-origin";

const formSchema = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .regex(
      /^#([0-9a-fA-F]{3}){1,2}$/i,
      "Invalid color hex value ex: #00AAFF or #0AF"
    )
    .toUpperCase(),
});

interface ColorFormProps {
  initialData: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { storeId, colorId } = useParams();
  const router = useRouter();
  // const origin = useOrigin();

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    setLoading(true);
    try {
      if (!initialData) {
        await axios.post(`/api/${storeId}/colors`, data);
      } else {
        await axios.patch(`/api/${storeId}/colors/${colorId}`, data);
      }
      router.refresh();
      router.push(`/${storeId}/colors`);
      toast.success(toastMsg);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
      router.refresh();
      router.push(`/${storeId}/colors`);
      toast.success("Color deleted.");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit your color" : "Create a new color";
  const toastMsg = initialData ? "Color updated." : "Color created.";
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        className="w-fit"
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="p-4 rounded-full border"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
      {/* <Separator />
      <APIAlert
        title="TEST_TITLE"
        description={`${origin}/api/${storeId}/colors/${colorId}`}
        variant="public"
      /> */}
    </>
  );
};

export default ColorForm;
