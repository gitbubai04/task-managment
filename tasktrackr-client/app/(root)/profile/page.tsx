"use client";
import useAxios from "@/hooks/useAxios.hook";
import { IUserProfile } from "@/interface";
import { ADMIN_PROFILE_CHANGE_URL, ADMIN_PROFILE_URL, USER_PROFILE_CHANGE_URL, USER_PROFILE_URL } from "@/lib/constants/api.constant";
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import SignInPage from "../signin/page";
import useSnackbar from "@/hooks/useSnackbar.hook";

function Profile() {
    const { isLoggedIn, role } = useSelector((state: RootState) => state?.authUser || {});
    const fileRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = React.useState<IUserProfile | null>(null);
    const [profileRes, , profileRequest] = useAxios<IUserProfile, null>(role === "admin" ? ADMIN_PROFILE_URL : USER_PROFILE_URL, "GET");
    const [changeProfileRes, , changeProfileRequest] = useAxios<FormData, null>(role === "admin" ? ADMIN_PROFILE_CHANGE_URL : USER_PROFILE_CHANGE_URL, "PATCH");
    const [preview, setPreview] = useState<string>("");
    useSnackbar(changeProfileRes?.message, changeProfileRes?.success ? "success" : "error");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
            const formData = new FormData();
            formData.append("image", file);
            changeProfileRequest(formData);
        }
    };

    React.useEffect(() => {
        if (profileRes?.success && profileRes?.data) {
            setUser(profileRes?.data);
        }
    }, [profileRes]);

    React.useEffect(() => {
        profileRequest();
    }, []);

    if (!isLoggedIn) {
        return <SignInPage />;
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-4">
            <Card className="shadow-lg">
                <CardHeader className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="w-20 h-20">
                            <AvatarImage
                                src={preview || user?.image || "/default-avatar.png"}
                                alt={user?.name}
                            />
                            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-0 right-0 rounded-full h-6 w-6"
                            onClick={() => fileRef.current?.click()}
                        >
                            <Camera className="w-2 h-2" />
                        </Button>
                        <Input
                            type="file"
                            ref={fileRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <CardTitle className="text-xl">{user?.name}</CardTitle>
                        <p className="text-sm text-muted-foreground text-center">{user?.profession}</p>
                        <div className="flex justify-center mt-1">
                            <Badge variant="outline" className="mt-1 capitalize">
                                {user?.role}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                    <div>
                        <span className="font-medium">Email: </span>
                        {user?.email}
                    </div>
                    <div>
                        <span className="font-medium">Phone: </span>
                        {user?.phone}
                    </div>
                    <div>
                        <span className="font-medium">Gender: </span>
                        {user?.gender}
                    </div>
                    <div>
                        <span className="font-medium">Address: </span>
                        {user?.address}
                    </div>
                    <div>
                        <span className="font-medium">Date of Birth: </span>
                        {user?.dateOfBirth || "Not set"}
                    </div>
                    <div>
                        <span className="font-medium">Created At: </span>
                        {moment(user?.createdAt).format("MMMM Do YYYY, h:mm A")}
                    </div>
                    <div>
                        <span className="font-medium">Last Login: </span>
                        {moment(user?.last_login).fromNow()} (
                        {moment(user?.last_login).format("MMMM Do YYYY, h:mm A")})
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;
