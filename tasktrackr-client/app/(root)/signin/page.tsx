'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import useSnackbar from '@/hooks/useSnackbar.hook'
import useAxios from '@/hooks/useAxios.hook'
import { LOGIN_URL } from '@/lib/constants/api.constant'
import { useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '@/store/slices/authSlice'
import { RootState } from '@/store'

interface ILoginPayload {
    email: string;
    password: string;
}

export default function SignInPage() {
    const { isLoggedIn, role } = useSelector((state: RootState) => state.authUser)
    const router = useRouter()
    const dispatch = useDispatch();
    const [loginRes, isLogging, loginRequest] = useAxios<ILoginPayload, null>(LOGIN_URL, "POST");

    useSnackbar(loginRes?.message, loginRes?.success ? "success" : "error");

    const formik = useFormik<ILoginPayload>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
        }),
        onSubmit: async (values) => {
            await loginRequest(values);
        },
    })

    useEffect(() => {
        if (loginRes?.success) {
            router.replace('/');
            const { role }: any = loginRes?.data
            dispatch(setAuth({ role }));
        }

    }, [loginRes])

    useEffect(() => {
        if (isLoggedIn) {
            router.replace('/');
        }
    }, [isLoggedIn])

    return (
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-sm shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...formik.getFieldProps('email')}
                                className={cn(
                                    formik.touched.email && formik.errors.email && 'border-red-500'
                                )}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...formik.getFieldProps('password')}
                                className={cn(
                                    formik.touched.password && formik.errors.password && 'border-red-500'
                                )}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLogging}
                        >
                            {isLogging ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                    {/* Footer */}
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Don’t have an account?{' '}
                        <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
