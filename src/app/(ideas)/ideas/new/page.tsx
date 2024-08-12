"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createIdea } from "@/lib/pocketbase";
import { getCurrentUser } from "@/lib/auth";

interface IdeaFormInputs {
  title: string;
  description: string;
  category: string;
  status: "New" | "In Progress" | "Completed";
}

export default function CreateIdea() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdeaFormInputs>();
  const [status, setStatus] = useState<"New" | "In Progress" | "Completed">(
    "New"
  );
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: IdeaFormInputs) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const newIdea = {
        ...data,
        status,
        user: currentUser.id,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };
      await createIdea(newIdea);
      toast({
        title: "Idea created",
        description: "Your new idea has been successfully created.",
      });
      router.push("/ideas");
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to create idea. Please try again.",
        variant: "destructive",
      });
      console.error(e);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Idea</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register("category", { required: "Category is required" })}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "New" | "In Progress" | "Completed") =>
                setStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardFooter className="flex justify-end pt-6">
            <Button type="submit">Create Idea</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
