import { prisma } from '@/lib/db'
import { UpdateTodoRequest } from '@/lib/types'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return Response.json(
        { error: 'Invalid todo ID' }, 
        { status: 400 }
      )
    }

    const body: UpdateTodoRequest = await request.json()
    
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(body.text !== undefined && { text: body.text.trim() }),
        ...(body.completed !== undefined && { completed: body.completed })
      }
    })
    
    return Response.json(todo)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return Response.json(
        { error: 'Todo not found' }, 
        { status: 404 }
      )
    }
    return Response.json(
      { error: 'Failed to update todo' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return Response.json(
        { error: 'Invalid todo ID' }, 
        { status: 400 }
      )
    }

    await prisma.todo.delete({
      where: { id }
    })
    
    return Response.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return Response.json(
        { error: 'Todo not found' }, 
        { status: 404 }
      )
    }
    return Response.json(
      { error: 'Failed to delete todo' }, 
      { status: 500 }
    )
  }
}