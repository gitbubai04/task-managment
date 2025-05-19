"use client";
import { use, useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { IUser } from "@/interface";
import { CHANGE_USER_STATUS_BY_ID_URL, DELETE_USER_BY_ID_URL, GET_USERS_URL } from "@/lib/constants/api.constant";
import useAxios from "@/hooks/useAxios.hook";
import { Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import useSnackbar from "@/hooks/useSnackbar.hook";

interface UserTableProps {
    users: IUser[];
    totalUser: number;
}

export default function UserTable() {
    const [usersData, setUsersData] = useState<UserTableProps>({
        users: [],
        totalUser: 0,
    });
    const [deleteUser, setDeleteUser] = useState<string | null>(null);
    const {
        users,
        totalUser,
    } = usersData;
    const [selectedUserId, setSelectedUserId] = useState<{ id: string; status: boolean }>({
        id: "",
        status: false
    });
    const [usersRes, isUsersResLoading, usersResRequest] = useAxios<IUser[], null>(GET_USERS_URL, "GET");
    const [deleteRes, isDeleteResLoading, deleteResRequest] = useAxios<null, null>(DELETE_USER_BY_ID_URL + deleteUser, "DELETE");
    const [statusRes, , statusResRequest] = useAxios<{ is_active: boolean }, null>(CHANGE_USER_STATUS_BY_ID_URL + selectedUserId?.id, "PATCH");

    useSnackbar(deleteRes?.message, deleteRes?.success ? "success" : "error");
    useSnackbar(statusRes?.message, statusRes?.success ? "success" : "error");

    useEffect(() => {
        if (usersRes?.success && usersRes?.data) {
            setUsersData(usersRes.data);
        }
    }, [usersRes]);

    useEffect(() => {
        usersResRequest();
    }, []);

    useEffect(() => {
        if (deleteRes?.success || statusRes?.success) {
            usersResRequest();
            setDeleteUser(null);
            setSelectedUserId({ id: "", status: false });
        }
    }, [deleteRes?.success, statusRes?.success]);

    useEffect(() => {
        if (deleteUser) {
            deleteResRequest();
        }
    }, [deleteUser]);

    useEffect(() => {
        if (selectedUserId.id) {
            statusResRequest({ is_active: selectedUserId.status });
        }
    }, [selectedUserId]);

    return (
        <div className="rounded-lg border">
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">Users ({totalUser})</h2>
                {/* search */}
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isUsersResLoading ? (
                        [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={6} className="py-6 text-center">
                                    <Loader2 className="animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : Array.isArray(users) && users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 rounded-full">
                                        <AvatarImage src={user.image} />
                                        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell className="capitalize">{user.role}</TableCell>
                                <TableCell>
                                    <Switch
                                        disabled={user.role === "admin"}
                                        checked={user.is_active}
                                        className={cn(
                                            "data-[state=checked]:bg-green-600",
                                            "data-[state=unchecked]:bg-gray-400"
                                        )}
                                        onClick={() => {
                                            setSelectedUserId({
                                                id: user._id,
                                                status: !user.is_active
                                            });
                                        }}
                                    />
                                </TableCell>
                                {user.role === "admin" ? <TableCell className="text-right">-----</TableCell> : (
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <p className="text-sm">Are you sure you want to delete <strong>{user.name}</strong>?</p>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => setDeleteUser(user._id)} disabled={isDeleteResLoading}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))

                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                                No data available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
