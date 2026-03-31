import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus, ExternalLink, Trash2, GripVertical, Eye, EyeOff,
  Copy, LogOut, Settings, Link2, TrendingUp, Check, X,
  Edit3, BarChart2, Camera, User, Mail, Lock, MessageSquare,
} from 'lucide-react'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import toast from 'react-hot-toast'

// ── Settings Modal ──────────────────────────────────────────────────────────
function SettingsModal({ onClose }) {
  const { user, logout, updateUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [profileForm, setProfileForm] = useState({ displayName: user?.displayName || '', bio: user?.bio || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef(null)
  const backdropRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const fieldStyle = {
    background: '#2c2c28', border: '1.5px solid #3a3a34', borderRadius: 12,
    padding: '10px 14px', fontSize: 13, color: '#f0ece0', outline: 'none',
    width: '100%', fontFamily: '"Bricolage Grotesque", sans-serif', transition: 'border-color 0.15s',
  }
  const fieldFocus = (e) => { e.target.style.borderColor = '#e8604c'; e.target.style.boxShadow = '0 0 0 3px rgba(232,96,76,0.12)' }
  const fieldBlur  = (e) => { e.target.style.borderColor = '#3a3a34'; e.target.style.boxShadow = 'none' }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const d = await api.patch('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      updateUser(d.data.user)
      toast.success('Avatar updated')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    try { const d = await api.patch('/users/profile', profileForm); updateUser(d.data.user); toast.success('Saved'); onClose() }
    catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const savePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return }
    setSaving(true)
    try { await api.patch('/auth/update-password', pwForm); toast.success('Password updated'); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }
    catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div ref={backdropRef} onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>

      <div className="w-full max-w-md overflow-hidden rounded-2xl animate-scale-in border"
        style={{ background: '#1c1c1a', borderColor: '#3a3a34', animationFillMode: 'forwards' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#2c2c28' }}>
          <h2 className="font-display font-700 text-lg text-ivory">Settings</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: '#a8a498' }}
            onMouseEnter={e => e.currentTarget.style.background = '#2c2c28'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {['profile', 'password'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-xs font-600 capitalize transition-all"
              style={{
                background: tab === t ? '#f0ece0' : 'transparent',
                color: tab === t ? '#1c1c1a' : '#a8a498',
              }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="px-6 py-5 space-y-4">
            {/* Avatar row */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.displayName}
                    className="w-14 h-14 rounded-xl object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center font-display font-700 text-xl"
                    style={{ background: '#e8604c', color: '#fff' }}>
                    {user?.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                {/* Hidden file input */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all"
                  style={{ background: '#f0ece0' }}
                  title="Change avatar">
                  {uploadingAvatar
                    ? <span className="w-2.5 h-2.5 border rounded-full animate-spin block"
                        style={{ borderColor: 'rgba(28,28,26,0.2)', borderTopColor: '#1c1c1a' }} />
                    : <Camera size={9} style={{ color: '#1c1c1a' }} />
                  }
                </button>
              </div>
              <div>
                <p className="font-display font-600 text-sm text-ivory">{user?.displayName}</p>
                <p className="font-code text-xs" style={{ color: '#a8a498' }}>@{user?.username}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: '#a8a498' }}>Display name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6b6b5a' }}>
                  <User size={14} />
                </span>
                <input value={profileForm.displayName}
                  style={{ ...fieldStyle, paddingLeft: 40 }}
                  onFocus={fieldFocus} onBlur={fieldBlur}
                  onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: '#a8a498' }}>Bio</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 pointer-events-none" style={{ color: '#6b6b5a' }}>
                  <MessageSquare size={14} />
                </span>
                <textarea rows={3} value={profileForm.bio}
                  style={{ ...fieldStyle, paddingLeft: 40, resize: 'none' }}
                  onFocus={fieldFocus} onBlur={fieldBlur}
                  placeholder="Tell the world who you are..."
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} />
              </div>
            </div>

            <button onClick={saveProfile} disabled={saving}
              className="w-full py-2.5 rounded-xl font-display font-600 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: '#f0ece0', color: '#1c1c1a' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0ece0'; e.currentTarget.style.color = '#1c1c1a' }}>
              {saving ? <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(28,28,26,0.2)', borderTopColor: '#1c1c1a' }} /> : <Check size={13} />}
              Save changes
            </button>
          </div>
        )}

        {tab === 'password' && (
          <div className="px-6 py-5 space-y-4">
            {[
              { key: 'currentPassword', label: 'Current password' },
              { key: 'newPassword',     label: 'New password' },
              { key: 'confirmPassword', label: 'Confirm new password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: '#a8a498' }}>{label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6b6b5a' }}>
                    <Lock size={14} />
                  </span>
                  <input type="password" value={pwForm[key]} placeholder="••••••••"
                    style={{ ...fieldStyle, paddingLeft: 40 }} onFocus={fieldFocus} onBlur={fieldBlur}
                    onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })} />
                </div>
              </div>
            ))}
            <button onClick={savePassword} disabled={saving}
              className="w-full py-2.5 rounded-xl font-display font-600 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: '#f0ece0', color: '#1c1c1a' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0ece0'; e.currentTarget.style.color = '#1c1c1a' }}>
              {saving ? <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(28,28,26,0.2)', borderTopColor: '#1c1c1a' }} /> : <Check size={13} />}
              Update password
            </button>
          </div>
        )}

        <div className="border-t px-6 pb-4 pt-3" style={{ borderColor: '#2c2c28' }}>
          <button onClick={async () => { await logout(); toast.success('Logged out') }}
            className="w-full flex items-center justify-center gap-2 text-xs font-body py-2 transition-colors"
            style={{ color: '#3a3a34' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#3a3a34'}>
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Link Card ────────────────────────────────────────────────────────────────
function LinkCard({ link, onToggle, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link._id })
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ title: link.title, url: link.url })
  const [saving, setSaving] = useState(false)
  const [hovered, setHovered] = useState(false)

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 50 : undefined }

  const saveEdit = async () => {
    if (!editForm.title.trim() || !editForm.url.trim()) return
    setSaving(true)
    try { await onEdit(link._id, editForm); setEditing(false) }
    catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div ref={setNodeRef} style={{ ...style, background: hovered && !editing ? '#2c2c28' : '#242420', border: `1px solid ${isDragging ? '#e8604c' : '#3a3a34'}`, borderRadius: 12 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="group transition-all duration-150">

      {editing ? (
        <div className="p-4 space-y-2.5">
          <input value={editForm.title} autoFocus onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            placeholder="Link title"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-ivory placeholder-edge outline-none font-body"
            style={{ background: '#2c2c28', border: '1.5px solid #3a3a34' }}
            onFocus={e => e.target.style.borderColor = '#e8604c'}
            onBlur={e => e.target.style.borderColor = '#3a3a34'} />
          <input value={editForm.url} onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-xl px-3 py-2.5 text-sm placeholder-edge outline-none font-code"
            style={{ background: '#2c2c28', border: '1.5px solid #3a3a34', color: '#a8a498' }}
            onFocus={e => e.target.style.borderColor = '#e8604c'}
            onBlur={e => e.target.style.borderColor = '#3a3a34'} />
          <div className="flex gap-2 pt-1">
            <button onClick={saveEdit} disabled={saving}
              className="flex items-center gap-1.5 text-xs font-600 px-3.5 py-1.5 rounded-lg transition-all"
              style={{ background: '#f0ece0', color: '#1c1c1a' }}>
              {saving ? <span className="w-3 h-3 border rounded-full animate-spin" style={{ borderColor: 'transparent', borderTopColor: '#1c1c1a' }} /> : <Check size={11} />}
              Save
            </button>
            <button onClick={() => { setEditing(false); setEditForm({ title: link.title, url: link.url }) }}
              className="px-3.5 py-1.5 text-xs font-body rounded-lg transition-all"
              style={{ background: '#2c2c28', color: '#a8a498', border: '1px solid #3a3a34' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3.5">
          <button {...attributes} {...listeners}
            className="transition-colors cursor-grab active:cursor-grabbing shrink-0 touch-none"
            style={{ color: '#6b6b5a' }}
            onMouseEnter={e => e.currentTarget.style.color = '#a8a498'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b6b5a'}>
            <GripVertical size={15} />
          </button>

          <div className={`w-2 h-2 rounded-full shrink-0 transition-colors ${link.isActive ? 'active-dot' : ''}`}
            style={{ backgroundColor: link.isActive ? '#e8604c' : '#4a4a3e' }} />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-600 truncate transition-colors"
              style={{ color: link.isActive ? '#f0ece0' : '#6b6b5a', textDecoration: link.isActive ? 'none' : 'line-through' }}>
              {link.title}
            </p>
            <p className="text-xs font-code truncate mt-0.5" style={{ color: '#a8a498' }}>
              {link.url.replace(/^https?:\/\//, '')}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0" style={{ color: '#6b6b5a' }}>
            <TrendingUp size={10} />
            <span className="text-xs font-code">{link.clickCount}</span>
          </div>

          {/* Always-visible action icons */}
          <div className="flex items-center gap-0.5 shrink-0">
            {[
              { Icon: ExternalLink, action: () => window.open(link.url, '_blank'), hc: '#d4d0c0', base: '#8a8a72', title: 'Open' },
              { Icon: Edit3,        action: () => setEditing(true),                hc: '#e8604c', base: '#8a8a72', title: 'Edit' },
              { Icon: link.isActive ? EyeOff : Eye, action: () => onToggle(link._id, !link.isActive), hc: '#d4d0c0', base: '#8a8a72', title: link.isActive ? 'Hide' : 'Show' },
              { Icon: Trash2,       action: () => onDelete(link),              hc: '#f87171', base: '#8a8a72', title: 'Delete' },
            ].map(({ Icon, action, hc, base, title }, i) => (
              <button key={i} onClick={action} title={title}
                className="p-1.5 rounded-lg transition-all"
                style={{ color: base }}
                onMouseEnter={e => { e.currentTarget.style.color = hc; e.currentTarget.style.background = '#3a3a34' }}
                onMouseLeave={e => { e.currentTarget.style.color = base; e.currentTarget.style.background = 'transparent' }}>
                <Icon size={13} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Add Link Modal ────────────────────────────────────────────────────────────
function AddLinkModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', url: '' })
  const [loading, setLoading] = useState(false)
  const backdropRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Auto-prepend https:// if user typed a bare domain
    const url = /^https?:\/\//.test(form.url) ? form.url : `https://${form.url}`
    try { await onAdd({ ...form, url }); onClose() }
    catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const iStyle = { background: '#2c2c28', border: '1.5px solid #3a3a34', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#f0ece0', outline: 'none', width: '100%', fontFamily: '"Bricolage Grotesque", sans-serif', transition: 'border-color 0.15s, box-shadow 0.15s' }
  const iFocus = (e) => { e.target.style.borderColor = '#e8604c'; e.target.style.boxShadow = '0 0 0 3px rgba(232,96,76,0.12)' }
  const iBlur  = (e) => { e.target.style.borderColor = '#3a3a34'; e.target.style.boxShadow = 'none' }

  return (
    <div ref={backdropRef} onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden border animate-scale-in"
        style={{ background: '#1c1c1a', borderColor: '#3a3a34', animationFillMode: 'forwards' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#2c2c28' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(232,96,76,0.12)', border: '1px solid rgba(232,96,76,0.25)' }}>
              <Plus size={14} style={{ color: '#e8604c' }} />
            </div>
            <h2 className="font-display font-700 text-base text-ivory">Add a new link</h2>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ color: '#6b6b5a' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2c2c28'; e.currentTarget.style.color = '#a8a498' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b6b5a' }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-600 mb-2 uppercase tracking-widest" style={{ color: '#a8a498' }}>Title</label>
            <input required autoFocus value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. My Portfolio"
              style={iStyle} onFocus={iFocus} onBlur={iBlur} />
          </div>
          <div>
            <label className="block text-xs font-600 mb-2 uppercase tracking-widest" style={{ color: '#a8a498' }}>URL</label>
            <input required value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="github.com/you or https://..."
              style={{ ...iStyle, fontFamily: '"JetBrains Mono", monospace', color: '#d4d0c0' }}
              onFocus={iFocus} onBlur={iBlur} />
          </div>
          <div className="pt-1">
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-display font-600 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: '#f0ece0', color: '#1c1c1a' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.color = '#fff' } }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0ece0'; e.currentTarget.style.color = '#1c1c1a' }}>
              {loading
                ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(28,28,26,0.2)', borderTopColor: '#1c1c1a' }} />
                : <><Plus size={14} /> Add link</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({ link, onClose, onConfirm }) {
  const backdropRef = useRef(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div ref={backdropRef} onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}>

      <div className="w-full max-w-sm rounded-2xl overflow-hidden border animate-scale-in"
        style={{ background: '#1c1c1a', borderColor: '#3a3a34', animationFillMode: 'forwards' }}>

        {/* Icon header */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <Trash2 size={20} style={{ color: '#f87171' }} />
          </div>
          <h2 className="font-display font-700 text-lg text-ivory mb-2">Delete link?</h2>
          <p className="font-body text-sm leading-relaxed" style={{ color: '#6b6b5a' }}>
            <span className="font-600" style={{ color: '#a8a498' }}>"{link.title}"</span> will be permanently removed.
            This cannot be undone.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px mx-6" style={{ background: '#2c2c28' }} />

        {/* Actions */}
        <div className="flex gap-3 px-6 py-5">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-body font-500 text-sm transition-all border"
            style={{ borderColor: '#3a3a34', color: '#a8a498', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6b6b5a'; e.currentTarget.style.color = '#f0ece0' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3a34'; e.currentTarget.style.color = '#a8a498' }}>
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl font-display font-600 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{ background: '#f87171', color: '#fff' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ef4444' }}
            onMouseLeave={e => e.currentTarget.style.background = '#f87171'}>
            {loading
              ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
              : <><Trash2 size={13} /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  )
}


function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 border" style={{ background: '#242420', borderColor: '#3a3a34' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(232,96,76,0.12)', border: '1px solid rgba(232,96,76,0.2)' }}>
        <Icon size={13} style={{ color: '#e8604c' }} />
      </div>
      <div>
        <div className="font-display font-700 text-lg text-ivory leading-none">{value}</div>
        <div className="text-xs font-body mt-0.5" style={{ color: '#6b6b5a' }}>{label}</div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth()
  const [links, setLinks] = useState([])
  const [stats, setStats] = useState(null)
  const [loadingLinks, setLoadingLinks] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAddLink, setShowAddLink] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // link object to delete

  const profilePath = `/@${user?.username}`
  const profileUrl  = `${window.location.origin}${profilePath}`

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchLinks = useCallback(async () => {
    try { const d = await api.get('/links'); setLinks(d.data.links) }
    catch { toast.error('Failed to load links') }
    finally { setLoadingLinks(false) }
  }, [])

  const fetchStats = useCallback(async () => {
    try { const d = await api.get('/users/dashboard/stats'); setStats(d.data.stats) } catch {}
  }, [])

  useEffect(() => { fetchLinks(); fetchStats() }, [fetchLinks, fetchStats])

  const addLink    = async (f) => { const d = await api.post('/links', f); setLinks(p => [...p, d.data.link]); toast.success('Link added'); fetchStats() }
  const editLink   = async (id, u) => { const d = await api.patch(`/links/${id}`, u); setLinks(p => p.map(l => l._id === id ? d.data.link : l)); toast.success('Saved') }
  const toggleLink = async (id, isActive) => { const d = await api.patch(`/links/${id}`, { isActive }); setLinks(p => p.map(l => l._id === id ? d.data.link : l)) }
  const deleteLink = async (id) => {
    await api.delete(`/links/${id}`)
    setLinks(p => p.filter(l => l._id !== id))
    setDeleteTarget(null)
    toast.success('Link deleted')
    fetchStats()
  }
  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return
    const reordered = arrayMove(links, links.findIndex(l => l._id === active.id), links.findIndex(l => l._id === over.id))
    setLinks(reordered)
    try { await api.patch('/links/reorder', { links: reordered.map((l, i) => ({ id: l._id, order: i })) }) }
    catch { fetchLinks() }
  }
  const copyUrl = () => {
    if (copied) return
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-dvh" style={{ backgroundColor: '#1c1c1a' }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(28,28,26,0.9)', borderColor: '#2c2c28', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#e8604c' }} />
            </div>
            <span className="font-display font-700 text-ivory text-base">Lynktree</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyUrl}
              className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 border transition-all"
              style={{ background: '#242420', borderColor: '#3a3a34' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#e8604c'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#3a3a34'}>
              <span className="text-xs font-code" style={{ color: '#a8a498' }}>/@{user?.username}</span>
              {copied ? <Check size={11} style={{ color: '#e8604c' }} /> : <Copy size={11} style={{ color: '#6b6b5a' }} />}
            </button>
            <button onClick={() => setShowSettings(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              style={{ color: '#a8a498' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#242420'; e.currentTarget.style.color = '#e8604c' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a8a498' }}>
              <Settings size={15} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-7">

        {/* Profile header */}
        <div className="flex items-center justify-between mb-7 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3.5">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName}
                className="w-11 h-11 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-700 text-lg text-white shrink-0"
                style={{ background: '#e8604c' }}>
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h1 className="font-display font-700 text-xl text-ivory leading-tight">{user?.displayName}</h1>
              <Link to={profilePath} target="_blank"
                className="text-xs font-code flex items-center gap-1 transition-colors"
                style={{ color: '#6b6b5a' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8604c'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b6b5a'}>
                /@{user?.username} <ExternalLink size={9} />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats ? (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up delay-100" style={{ animationFillMode: 'forwards', opacity: 0 }}>
            <Stat icon={Link2}     value={stats.totalLinks}  label="Total links" />
            <Stat icon={Eye}       value={stats.activeLinks} label="Active" />
            <Stat icon={BarChart2} value={stats.totalClicks} label="Clicks" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-3.5 py-3 border animate-pulse"
                style={{ background: '#242420', borderColor: '#3a3a34' }}>
                <div className="w-7 h-7 rounded-lg shrink-0" style={{ background: '#3a3a34' }} />
                <div className="space-y-1.5">
                  <div className="h-4 w-8 rounded" style={{ background: '#3a3a34' }} />
                  <div className="h-2.5 w-14 rounded" style={{ background: '#2c2c28' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Links panel */}
        <div className="rounded-2xl overflow-hidden border animate-fade-up delay-200"
          style={{ background: '#242420', borderColor: '#3a3a34', animationFillMode: 'forwards', opacity: 0 }}>

          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: '#2c2c28' }}>
            <h2 className="font-body font-600 text-sm flex items-center gap-2" style={{ color: '#a8a498' }}>
              <Link2 size={13} style={{ color: '#6b6b5a' }} />
              Your links
              <span className="font-code text-xs font-400" style={{ color: '#6b6b5a' }}>({links.length})</span>
            </h2>
            <Link to={profilePath} target="_blank"
              className="text-xs font-body font-500 flex items-center gap-1 transition-colors"
              style={{ color: '#6b6b5a' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e8604c'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b6b5a'}>
              <ExternalLink size={10} /> Public page
            </Link>
          </div>

          <div className="p-3 space-y-2">
            {loadingLinks ? (
              <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-xl border animate-pulse"
                    style={{ background: '#242420', borderColor: '#3a3a34', opacity: 1 - (i-1) * 0.2 }}>
                    <div className="w-3.5 h-3.5 rounded" style={{ background: '#3a3a34' }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: '#3a3a34' }} />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 rounded" style={{ background: '#3a3a34', width: `${60 - i * 8}%` }} />
                      <div className="h-2.5 rounded" style={{ background: '#2c2c28', width: `${45 - i * 5}%` }} />
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(j => <div key={j} className="w-6 h-6 rounded-lg" style={{ background: '#2c2c28' }} />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : links.length === 0 ? (
              <div className="text-center py-12">
                <Link2 size={22} className="mx-auto mb-2" style={{ color: '#3a3a34' }} />
                <p className="text-sm font-body" style={{ color: '#6b6b5a' }}>No links yet — add your first one below</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={links.map(l => l._id)} strategy={verticalListSortingStrategy}>
                  {links.map(link => (
                    <LinkCard key={link._id} link={link} onToggle={toggleLink} onDelete={setDeleteTarget} onEdit={editLink} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            <div className="pt-1 pb-1">
              <button onClick={() => setShowAddLink(true)}
                className="w-full rounded-xl py-3 flex items-center justify-center gap-2 transition-all group font-display font-600 text-sm"
                style={{ background: '#2c2c28', border: '1px solid #3a3a34', color: '#a8a498' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.borderColor = '#e8604c'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2c2c28'; e.currentTarget.style.borderColor = '#3a3a34'; e.currentTarget.style.color = '#a8a498' }}>
                <Plus size={14} className="group-hover:rotate-90 transition-transform duration-200" />
                Add a link
              </button>
            </div>
          </div>

          {links.length > 0 && (
            <div className="px-5 pb-3.5 pt-2.5 flex items-center gap-1.5 border-t" style={{ borderColor: '#2c2c28', color: '#6b6b5a' }}>
              <GripVertical size={10} />
              <span className="text-xs font-body">Drag to reorder</span>
            </div>
          )}
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAddLink  && <AddLinkModal  onClose={() => setShowAddLink(false)} onAdd={async (form) => { await addLink(form); setShowAddLink(false) }} />}
      {deleteTarget && <DeleteModal   link={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteLink(deleteTarget._id)} />}
    </div>
  )
}
