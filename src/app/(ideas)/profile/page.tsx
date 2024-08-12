"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUser, updateUser, uploadAvatar } from "@/lib/pocketbase";
import { useToast } from "@/components/ui/use-toast";

interface ProfileFormInputs {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormInputs>();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUser(user);
      setValue("name", user.name);
      setValue("email", user.email);
      setAvatarUrl(
        user.avatar
          ? `http://127.0.0.1:8090/api/files/users/${user.id}/${user.avatar}`
          : ""
      );
    }
  }, [setValue]);

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      await updateUser(user.id, data);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (e) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const updatedUser = await uploadAvatar(user.id, file);
        setAvatarUrl(
          `http://127.0.0.1:8090/api/files/users/${updatedUser.id}/${updatedUser.avatar}`
        );
        toast({
          title: "Avatar updated",
          description: "Your avatar has been successfully updated.",
        });
      } catch (e) {
        toast({
          title: "Upload failed",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>
          Manage your account details and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarUrl} alt="User avatar" />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
                <span className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md">
                  Change Avatar
                </span>
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>
          <CardFooter className="flex justify-end pt-6">
            <Button type="submit">Update Profile</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
