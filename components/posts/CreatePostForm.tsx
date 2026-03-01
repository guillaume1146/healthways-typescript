'use client'

import { useState } from 'react'
import { FaPaperPlane, FaTags } from 'react-icons/fa'

interface CreatePostFormProps {
  onPostCreated?: (post: Record<string, unknown>) => void
}

const CATEGORIES = [
  { value: '', label: 'Select a category' },
  { value: 'health_tips', label: 'Health Tips' },
  { value: 'article', label: 'Article' },
  { value: 'news', label: 'News' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'wellness', label: 'Wellness' },
]

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          category: category || null,
          tags,
        }),
      })

      const json = await res.json()

      if (json.success) {
        setContent('')
        setCategory('')
        setTagsInput('')
        setSuccess(true)
        onPostCreated?.(json.data)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(json.message || 'Failed to create post')
      }
    } catch (err) {
      console.error('Failed to create post:', err)
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create a Post</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share health tips, articles, or knowledge with the community..."
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={submitting}
        />

        {/* Category and Tags row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            disabled={submitting}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Tags input */}
          <div className="flex-1 relative">
            <FaTags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Success toast */}
        {success && (
          <p className="text-green-600 text-sm font-medium">Post published successfully!</p>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <FaPaperPlane className="text-xs" />
                Publish Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
