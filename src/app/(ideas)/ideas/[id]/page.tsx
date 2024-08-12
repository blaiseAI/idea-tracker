"use client";

import { useState, useEffect } from "react";
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
import { getIdea, updateIdea, deleteIdea, Idea } from "@/lib/pocketbase";

interface IdeaFormInputs {
  title: string;
  description: string;
  category: string;
  status: "New" | "In Progress" | "Completed";
}

export default function IdeaDetails({ params }: { params: { id: string } }) {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IdeaFormInputs>();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const fetchedIdea = await getIdea(params.id);
        setIdea(fetchedIdea);
        reset(fetchedIdea);
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to fetch idea. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchIdea();
  }, [params.id, reset, toast]);

  const onSubmit = async (data: IdeaFormInputs) => {
    try {
      await updateIdea(params.id, data);
      setIdea({ ...idea, ...data } as Idea);
      setIsEditing(false);
      toast({
        title: "Idea updated",
        description: "Your idea has been successfully updated.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to update idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      try {
        await deleteIdea(params.id);
        toast({
          title: "Idea deleted",
          description: "Your idea has been successfully deleted.",
        });
        router.push("/ideas");
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to delete idea. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (!idea) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Idea" : "Idea Details"}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
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
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={idea.status}
                onValueChange={(value: "New" | "In Progress" | "Completed") =>
                  setValue("status", value)
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
            <CardFooter className="flex justify-between pt-6">
              <Button type="submit">Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </CardFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <p>{idea.title}</p>
            </div>
            <div>
              <Label>Description</Label>
              <p>{idea.description}</p>
            </div>
            <div>
              <Label>Category</Label>
              <p>{idea.category}</p>
            </div>
            <div>
              <Label>Status</Label>
              <p>{idea.status}</p>
            </div>
            <CardFooter className="flex justify-between pt-6">
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </CardFooter>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
