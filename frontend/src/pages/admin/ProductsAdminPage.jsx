import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import { toast } from '../../store/toastStore'
import { formatCurrency, getMinPrice, getProductImage } from '../../utils/formatters'
import Modal from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'

const EMPTY_FORM = { name: '', description: '', image: '', brand: '', categoryId: '' }

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = async (p = 0, s = '') => {
    setLoading(true)
    try {
      const res = await productApi.filter({ search: s || undefined, page: p, size: 10, sortBy: 'id', sortDir: 'desc' })
      setProducts(res.data?.content || [])
      setTotalPages(res.data?.totalPages || 1)
    } catch {
      toast.error('Lỗi khi tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])
  useEffect(() => { categoryApi.getAll().then((r) => setCategories(r.data || [])) }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    fetchProducts(0, e.target.value)
    setPage(0)
  }

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setModalOpen(true) }
  const openEdit = (p) => {
    setForm({
      name: p.name || '',
      description: p.description || '',
      image: p.image || '',
      brand: p.brand || '',
      categoryId: p.category?.id || '',
    })
    setEditingId(p.id)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.brand) { toast.warning('Tên và hãng là bắt buộc'); return }
    setSaving(true)
    try {
      if (editingId) {
        await productApi.update(editingId, form)
        toast.success('Cập nhật sản phẩm thành công')
      } else {
        await productApi.create(form)
        toast.success('Tạo sản phẩm thành công')
      }
      setModalOpen(false)
      fetchProducts(page, search)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return
    try {
      await productApi.delete(id)
      toast.success('Đã xóa sản phẩm')
      fetchProducts(page, search)
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản lý sản phẩm</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Thêm, sửa, xóa sản phẩm</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="admin-add-product">
          <Plus size={16} />
          Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 'var(--space-lg)', maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          id="admin-product-search"
          type="text"
          className="form-input"
          placeholder="Tìm kiếm sản phẩm..."
          style={{ paddingLeft: 40 }}
          value={search}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <PageSpinner />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sản phẩm</th>
                  <th>Hãng</th>
                  <th>Danh mục</th>
                  <th>Giá từ</th>
                  <th>Biến thể</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-2xl)' }}>
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--text-muted)' }}>#{p.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={getProductImage(p.image)}
                            alt={p.name}
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)' }}
                            onError={(e) => { e.target.src = 'https://placehold.co/40x40/1a1a2e/818cf8?text=📱' }}
                          />
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">{p.brand}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {p.category?.name || '—'}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>
                        {getMinPrice(p.variants) != null ? formatCurrency(getMinPrice(p.variants)) : '—'}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {p.variants?.length || 0}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(p)} title="Sửa">
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(p.id)} title="Xóa">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 0} onClick={() => { setPage(p => p-1); fetchProducts(page-1, search) }}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => { setPage(i); fetchProducts(i, search) }}>{i+1}</button>
              ))}
              <button className="page-btn" disabled={page >= totalPages-1} onClick={() => { setPage(p => p+1); fetchProducts(page+1, search) }}>›</button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-name">Tên sản phẩm *</label>
            <input id="prod-name" type="text" className="form-input" placeholder="iPhone 16 Pro Max" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-brand">Hãng *</label>
            <input id="prod-brand" type="text" className="form-input" placeholder="Apple" value={form.brand} onChange={(e) => setForm(f => ({ ...f, brand: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-category">Danh mục</label>
            <select id="prod-category" className="form-select" value={form.categoryId} onChange={(e) => setForm(f => ({ ...f, categoryId: Number(e.target.value) || '' }))}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-image">URL hình ảnh</label>
            <input id="prod-image" type="url" className="form-input" placeholder="https://..." value={form.image} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-desc">Mô tả</label>
            <textarea id="prod-desc" className="form-input" rows={4} placeholder="Mô tả sản phẩm..." value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="save-product-btn">
              {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo sản phẩm'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
