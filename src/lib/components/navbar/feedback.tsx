/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "../ui/button";
import { useUserContext } from "@/lib/contexts/UserProvider";
import type { ReactElement } from "react";
import { toast } from "../ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  feedback: z.string().min(10, {
    message: "Please enter at least 10 characters."
  })
});

export const Feedback = (): ReactElement => {
  const { user } = useUserContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: (user && user !== "loading") ? user.user_metadata.email : "",
      feedback: ""
    }
  });

  const onSubmit = async(data: z.infer<typeof formSchema>): Promise<void> => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        toast({ title: "Feedback sent", description: "Thank you for your feedback!" });
      } else {
        toast({ title: "Something went wrong", description: "Please try again later." });
      }
    } catch (err) {
      toast({ title: "Something went wrong", description: "Please try again later." });
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button variant={"outline"}>
            Feedback
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise a feedback</DialogTitle>
            <DialogDescription>
                We are always looking for ways to improve our product. Please let us know if you have any suggestions.
                Don&apos;t hesitate to reach out to us if you have any questions.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@example.com"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please enter at least 10 characters, so we can better understand your feedback and suggestions."
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant={"default"} size={"sm"} type="submit" className="mt-2">
                  Send feedback
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};