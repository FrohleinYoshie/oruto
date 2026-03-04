"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function PostApp(formData?: FormData) {
    return { error: null };
}
