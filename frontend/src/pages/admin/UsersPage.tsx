import { useEffect, useState, type FormEvent } from 'react'
import { PortalModal } from '../../components/admin/PortalModal'
import {
  createUser,
  fetchUsers,
  updateUser,
  type CreateUserInput,
  type PortalUser,
  type UpdateUserInput,
} from '../../api/portal'
import { useAuth } from '../../providers/AuthProvider'

const emptyCreate: CreateUserInput = {
  name: '',
  email: '',
  password: '',
  role: 'staff',
}

type EditForm = {
  name: string
  email: string
  password: string
  role: 'admin' | 'staff'
  isActive: boolean
}

export function UsersPage() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<PortalUser[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateUserInput>(emptyCreate)

  const [editUser, setEditUser] = useState<PortalUser | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)

  async function load() {
    setLoading(true)
    try {
      setUsers(await fetchUsers())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function openCreate() {
    setCreateForm(emptyCreate)
    setError('')
    setCreateOpen(true)
  }

  function openEdit(user: PortalUser) {
    setEditUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role === 'admin' ? 'admin' : 'staff',
      isActive: user.isActive,
    })
    setError('')
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createUser(createForm)
      setCreateOpen(false)
      setCreateForm(emptyCreate)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create user')
    } finally {
      setSaving(false)
    }
  }

  async function onEdit(e: FormEvent) {
    e.preventDefault()
    if (!editUser || !editForm) return
    setSaving(true)
    setError('')
    try {
      const patch: UpdateUserInput = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
        isActive: editForm.isActive,
      }
      if (editForm.password.trim()) {
        patch.password = editForm.password
      }
      await updateUser(editUser.id, patch)
      setEditUser(null)
      setEditForm(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="ss-portal-header">
        <div>
          <p className="ss-eyebrow">Users</p>
          <h1 className="ss-display ss-display-md">User management</h1>
        </div>
        <button type="button" className="ss-btn ss-btn-primary" onClick={openCreate}>
          Add User
        </button>
      </div>

      {error && !createOpen && !editUser ? <p className="ss-portal-status is-error">{error}</p> : null}

      <div className="ss-portal-panel">
        <p className="ss-eyebrow">Directory</p>
        <h2 className="ss-display ss-display-md">All users</h2>
        {loading ? (
          <p className="ss-muted-note mt-3 mb-0">Loading…</p>
        ) : (
          <div className="ss-portal-table-wrap">
            <table className="ss-portal-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`ss-portal-badge ${user.isActive ? 'is-on' : 'is-off'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="ss-btn ss-btn-ghost" onClick={() => openEdit(user)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PortalModal
        open={createOpen}
        eyebrow="Users"
        title="Create account"
        onClose={() => {
          if (!saving) setCreateOpen(false)
        }}
      >
        <form className="ss-form mt-3" onSubmit={onCreate}>
          <div className="ss-form-grid ss-form-grid-2">
            <div>
              <label className="form-label" htmlFor="create-name">
                Name
              </label>
              <input
                id="create-name"
                className="form-control"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="create-email">
                Email
              </label>
              <input
                id="create-email"
                type="email"
                className="form-control"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="create-password">
                Password
              </label>
              <input
                id="create-password"
                type="password"
                className="form-control"
                minLength={8}
                required
                value={createForm.password}
                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="create-role">
                Role
              </label>
              <select
                id="create-role"
                className="form-select"
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, role: e.target.value as CreateUserInput['role'] }))
                }
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          {error && createOpen ? <p className="ss-portal-status is-error">{error}</p> : null}
          <div className="ss-cta-row mt-3">
            <button className="ss-btn ss-btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Add User'}
            </button>
            <button
              className="ss-btn ss-btn-ghost"
              type="button"
              disabled={saving}
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </PortalModal>

      <PortalModal
        open={Boolean(editUser && editForm)}
        eyebrow="Users"
        title="Edit account"
        onClose={() => {
          if (!saving) {
            setEditUser(null)
            setEditForm(null)
          }
        }}
      >
        {editForm ? (
          <form className="ss-form mt-3" onSubmit={onEdit}>
            <div className="ss-form-grid ss-form-grid-2">
              <div>
                <label className="form-label" htmlFor="edit-name">
                  Name
                </label>
                <input
                  id="edit-name"
                  className="form-control"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => (f ? { ...f, name: e.target.value } : f))}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="edit-email">
                  Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  className="form-control"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => (f ? { ...f, email: e.target.value } : f))}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="edit-password">
                  New password
                </label>
                <input
                  id="edit-password"
                  type="password"
                  className="form-control"
                  minLength={8}
                  value={editForm.password}
                  onChange={(e) => setEditForm((f) => (f ? { ...f, password: e.target.value } : f))}
                  placeholder="Leave blank to keep"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="edit-role">
                  Role
                </label>
                <select
                  id="edit-role"
                  className="form-select"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm((f) =>
                      f ? { ...f, role: e.target.value as EditForm['role'] } : f,
                    )
                  }
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="edit-status">
                  Status
                </label>
                <select
                  id="edit-status"
                  className="form-select"
                  value={editForm.isActive ? 'active' : 'inactive'}
                  disabled={editUser?.id === me?.id}
                  onChange={(e) =>
                    setEditForm((f) => (f ? { ...f, isActive: e.target.value === 'active' } : f))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            {error && editUser ? <p className="ss-portal-status is-error">{error}</p> : null}
            <div className="ss-cta-row mt-3">
              <button className="ss-btn ss-btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                className="ss-btn ss-btn-ghost"
                type="button"
                disabled={saving}
                onClick={() => {
                  setEditUser(null)
                  setEditForm(null)
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </PortalModal>
    </>
  )
}
