export const error = (status: number, message: string): Response =>
  new Response(message, {
    status,
  })
