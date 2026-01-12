"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReusableFormField } from "@/components/form/ReusableFormField"

const formSchema = z.object({
  name: z.string().min(1, {message: "名前を入力してください"}),
})

type FormValues = z.output<typeof formSchema>;

export default function ProfileForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  return (
    <div className='container mx-auto px-15 py-30'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>青年等就農計画認定申請書（基本情報）</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <ReusableFormField control={form.control} name="name" label="名前" />
            </CardContent>
          </Card>

          
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
