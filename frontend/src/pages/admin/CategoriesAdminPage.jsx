import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { categoryApi } from '../../api/categoryApi'
import { toast } from '../../store/toastStore'
import Modal from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)

  const fetch = () => {
    categoryApi.getAll()
      .then((r) => setCategories(r.data || []))
      .finally(() => setLoading(false))
  }
  useEffect(fetch, [])

  const openAdd = () => { setForm({ name: '', description: '' }); setEditingId(null); setModalOpen(true) }
  const openEdit = (c) => { setForm({ name: c.name || '', description: c.description || '' }); setEditingId(c.id); setModalOpen(true) }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.warning('Tên danh mục là bắt buộc'); return }
    setSaving(true)
    try {
      if (editingId) {
        await categoryApi.update(editingId, form)
        toast.success('Cập nhật danh mục thành công')
      } else {
        await categoryApi.create(form)
        toast.success('Tạo danh mục thành công')
      }
      setModalOpen(false)
      fetch()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa danh mục này?')) return
    try {
      await categoryApi.delete(id)
      toast.success('Đã xóa danh mục')
      fetch()
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản lý danh mục</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{categories.length} danh mục</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="admin-add-category">
          <Plus size={16} />
          Thêm danh mục
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 'var(--space-lg)',
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="card"
            style={{ padding: 'var(--space-xl)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📦</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{cat.name}</h3>
                {cat.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {cat.description}
                  </p>
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                  ID: #{cat.id}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(cat)}>
                  <Pencil size={14} />
                </button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(cat.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="cat-name">Tên danh mục *</label>
            <input id="cat-name" type="text" className="form-input" placeholder="Điện thoại" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cat-desc">Mô tả</label>
            <input id="cat-desc" type="text" className="form-input" placeholder="Mô tả ngắn..." value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="save-category-btn">
              {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo danh mục'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
