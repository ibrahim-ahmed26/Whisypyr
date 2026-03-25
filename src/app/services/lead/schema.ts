import { z } from "zod";

export const leadServiceSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(10).default(1),
});
