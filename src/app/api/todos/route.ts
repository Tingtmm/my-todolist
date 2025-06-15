import { prisma } from '@/lib/db'
import { CreateTodoRequest } from '@/lib/types'

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return Response.json(todos)
  } catch {
    return Response.json(
      { error: 'Failed to fetch todos' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { text }: CreateTodoRequest = await request.json()
    
    if (!text || text.trim() === '') {
      return Response.json(
        { error: 'Text is required' }, 
        { status: 400 }
      )
    }

    const todo = await prisma.todo.create({
      data: { text: text.trim() }
    })
    
    return Response.json(todo, { status: 201 })
  } catch {
    return Response.json(
      { error: 'Failed to create todo' }, 
      { status: 500 }
    )
  }
}