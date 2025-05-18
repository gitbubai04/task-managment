'use client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import useAxios from '@/hooks/useAxios.hook'
import { REGISTER_URL } from '@/lib/constants/api.constant'
import useSnackbar, { AXIOS_TIME } from '@/hooks/useSnackbar.hook'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface ISignUpPayload {
    name: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    profession: string;
    password: string;
}

export default function SignUpPage() {
    const { isLoggedIn, role } = useSelector((state: RootState) => state.authUser)
    const router = useRouter()
    const [registerRes, isSubmitting, registerRequest] = useAxios<ISignUpPayload, null>(REGISTER_URL, "POST");
    useSnackbar(registerRes?.message, registerRes?.success ? "success" : "error");

    const formik = useFormik<ISignUpPayload>({
        initialValues: {
            name: '',
            gender: '',
            email: '',
            phone: '',
            address: '',
            profession: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            gender: Yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender').required('Gender is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').required('Phone is required'),
            address: Yup.string().required('Address is required'),
            profession: Yup.string().oneOf(["developer", "designer", "manager", "tester", "other"], 'Invalid profession').required('profession is required'),
            password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
        }),
        onSubmit: async (values) => {
            await registerRequest(values);
        },
    })

    useEffect(() => {
        if (registerRes?.success) setTimeout(() => router.replace('/signin'), AXIOS_TIME);
    }, [registerRes])

    if (isLoggedIn) router.replace('/');

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/** Name */}
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                {...formik.getFieldProps('name')}
                                className={cn(formik.touched.name && formik.errors.name && 'border-red-500')}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
                            )}
                        </div>

                        {/** Gender */}
                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            <select
                                id="gender"
                                {...formik.getFieldProps('gender')}
                                className={cn(
                                    'w-full border rounded-md p-2',
                                    formik.touched.gender && formik.errors.gender && 'border-red-500'
                                )}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {formik.touched.gender && formik.errors.gender && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.gender}</p>
                            )}
                        </div>

                        {/** Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...formik.getFieldProps('email')}
                                className={cn(formik.touched.email && formik.errors.email && 'border-red-500')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                            )}
                        </div>

                        {/** Phone */}
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                {...formik.getFieldProps('phone')}
                                className={cn(formik.touched.phone && formik.errors.phone && 'border-red-500')}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.phone}</p>
                            )}
                        </div>

                        {/** Address */}
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                {...formik.getFieldProps('address')}
                                className={cn(formik.touched.address && formik.errors.address && 'border-red-500')}
                            />
                            {formik.touched.address && formik.errors.address && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.address}</p>
                            )}
                        </div>

                        {/** Profession */}
                        <div>
                            <Label htmlFor="profession">Profession</Label>
                            <select
                                id="profession"
                                {...formik.getFieldProps('profession')}
                                className={cn(
                                    'w-full border rounded-md p-2',
                                    formik.touched.profession && formik.errors.profession && 'border-red-500'
                                )}
                            >
                                <option value="">Select profession</option>
                                <option value="developer">Developer</option>
                                <option value="designer">Designer</option>
                                <option value="manager">Manager</option>
                                <option value="tester">Tester</option>
                                <option value="other">Other</option>
                            </select>
                            {formik.touched.profession && formik.errors.profession && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.profession}</p>
                            )}
                        </div>

                        {/** Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...formik.getFieldProps('password')}
                                className={cn(formik.touched.password && formik.errors.password && 'border-red-500')}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {formik.isSubmitting ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
