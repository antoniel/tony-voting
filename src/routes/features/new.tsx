import { Button } from '@/components/ui/button'
import { Card, CardPanel } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { showToast } from '@/lib/toast'
import { useCreateFeature } from '@/hooks'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/features/new')({
  component: NewFeature
})

function NewFeature() {
  const navigate = useNavigate()
  const createFeature = useCreateFeature()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})

  const MAX_TITLE_LENGTH = 255

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less`
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      showToast('error', 'Validation Error', 'Please fix the errors before submitting')
      return
    }

    createFeature.mutate(
      { title: title.trim(), description: description.trim(), authorName: authorName.trim() || undefined },
      {
        onSuccess: () => {
          showToast('success', 'Feature Submitted', 'Your feature request has been submitted successfully!')
          navigate({ to: '/' })
        },
        onError: (error: any) => {
          const errorMessage = error?.message || 'Failed to submit feature. Please try again.'
          showToast('error', 'Submission Failed', errorMessage)
        }
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950">
      <main className="max-w-3xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-slate-400 hover:text-white"
          onClick={() => navigate({ to: '/' })}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Features
        </Button>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardPanel className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Suggest a New Feature</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Field>
                <div className="flex items-center justify-between mb-2">
                  <Label>Title</Label>
                  <span className={`text-xs ${title.length > MAX_TITLE_LENGTH ? 'text-red-400' : 'text-slate-400'}`}>
                    {title.length}/{MAX_TITLE_LENGTH}
                  </span>
                </div>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (errors.title) {
                      setErrors({ ...errors, title: undefined })
                    }
                  }}
                  placeholder="Enter feature title"
                  required
                  maxLength={MAX_TITLE_LENGTH}
                  className={`bg-slate-800 border-slate-700 text-white ${errors.title ? 'border-red-500' : ''}`}
                  aria-invalid={!!errors.title}
                />
                {errors.title && <p className="text-sm text-red-400 mt-1">{errors.title}</p>}
              </Field>

              <Field>
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (errors.description) {
                      setErrors({ ...errors, description: undefined })
                    }
                  }}
                  placeholder="Describe your feature request in detail..."
                  required
                  rows={8}
                  className={`bg-slate-800 border-slate-700 text-white ${errors.description ? 'border-red-500' : ''}`}
                  aria-invalid={!!errors.description}
                />
                {errors.description && <p className="text-sm text-red-400 mt-1">{errors.description}</p>}
              </Field>

              <Field>
                <Label>Your Name (Optional)</Label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </Field>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/50"
                  disabled={createFeature.isPending}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {createFeature.isPending ? 'Submitting...' : 'Submit Feature'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate({ to: '/' })}
                  className="border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardPanel>
        </Card>
      </main>
    </div>
  )
}

