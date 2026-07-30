import { useState, useEffect } from 'react'
import {
  Plus, Pencil, Trash2, Search, Package,
  ChevronDown, ChevronUp, Layers, Tag, X
} from 'lucide-react'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import { attributeApi } from '../../api/attributeApi'
import { toast } from '../../store/toastStore'
import { formatCurrency, getMinPrice, getProductImage } from '../../utils/formatters'
import Modal from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'

const EMPTY_PROD = { name: '', description: '', image: '', brand: '', categoryId: '' }
const EMPTY_VAR  = { price: '', quantityInStock: '', attributeValueIds: [] }

export default function ProductsAdminPage() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Product modal
  const [prodModal, setProdModal]   = useState(false)
  const [editingId, setEditingId]   = useState(null)
  const [prodForm, setProdForm]     = useState(EMPTY_PROD)
  const [savingProd, setSavingProd] = useState(false)

  // Expanded row (variant panel)
  const [expandedId, setExpandedId] = useState(null)

  // Variant modal
  const [varModal, setVarModal]     = useState({ open: false, productId: null, variantId: null })
  const [varForm, setVarForm]       = useState(EMPTY_VAR)
  const [savingVar, setSavingVar]   = useState(false)

  // ── Fetch ────────────────────────────────────────────────
  const fetchProducts = async (p = 0, s = '') => {
    setLoading(true)
    try {
      const res = await productApi.filter({
        search: s || undefined, page: p, size: 10, sortBy: 'id', sortDir: 'desc',
      })
      setProducts(res.data?.content || [])
      setTotalPages(res.data?.totalPages || 1)
    } catch { toast.error('Lỗi khi tải sản phẩm') }
    finally   { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])
  useEffect(() => { categoryApi.getAll().then((r) => setCategories(r.data || [])) }, [])
  useEffect(() => { attributeApi.getAll().then((r) => setAttributes(r.data || [])) }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(0)
    fetchProducts(0, e.target.value)
  }

  // ── Product CRUD ──────────────────────────────────────────
  const openAddProd  = () => { setProdForm(EMPTY_PROD); setEditingId(null); setProdModal(true) }
  const openEditProd = (p) => {
    setProdForm({ name: p.name||'', description: p.description||'', image: p.image||'', brand: p.brand||'', categoryId: p.category?.id||'' })
    setEditingId(p.id)
    setProdModal(true)
  }

  const handleSaveProd = async () => {
    if (!prodForm.name || !prodForm.brand) { toast.warning('Tên và hãng là bắt buộc'); return }
    setSavingProd(true)
    try {
      if (editingId) {
        await productApi.update(editingId, prodForm)
        toast.success('Cập nhật sản phẩm thành công')
      } else {
        await productApi.create(prodForm)
        toast.success('Tạo sản phẩm thành công')
      }
      setProdModal(false)
      fetchProducts(page, search)
    } catch (e) { toast.error(e.message) }
    finally      { setSavingProd(false) }
  }

  const handleDeleteProd = async (id) => {
    if (!confirm('Xóa sản phẩm này sẽ xóa toàn bộ biến thể. Tiếp tục?')) return
    try {
      await productApi.delete(id)
      toast.success('Đã xóa sản phẩm')
      fetchProducts(page, search)
    } catch (e) { toast.error(e.message) }
  }

  // ── Variant CRUD ──────────────────────────────────────────
  const openAddVar = (productId) => {
    setVarForm(EMPTY_VAR)
    setVarModal({ open: true, productId, variantId: null })
  }
  const openEditVar = (productId, variant) => {
    setVarForm({
      price: variant.price || '',
      quantityInStock: variant.quantityInStock || '',
      attributeValueIds: (variant.attributes || []).map((a) => a.id),
    })
    setVarModal({ open: true, productId, variantId: variant.id })
  }

  const handleSaveVar = async () => {
    if (!varForm.price || parseFloat(varForm.price) <= 0) { toast.warning('Giá phải lớn hơn 0'); return }
    if (!varForm.quantityInStock || parseInt(varForm.quantityInStock) < 0) { toast.warning('Số lượng không hợp lệ'); return }
    setSavingVar(true)
    try {
      const payload = {
        price: parseFloat(varForm.price),
        quantityInStock: parseInt(varForm.quantityInStock),
        attributeValueIds: varForm.attributeValueIds.length ? varForm.attributeValueIds : undefined,
      }
      if (varModal.variantId) {
        await productApi.updateVariant(varModal.variantId, payload)
        toast.success('Cập nhật biến thể thành công')
      } else {
        await productApi.addVariant(varModal.productId, payload)
        toast.success('Thêm biến thể thành công')
      }
      setVarModal({ open: false, productId: null, variantId: null })
      fetchProducts(page, search)
    } catch (e) { toast.error(e.message) }
    finally      { setSavingVar(false) }
  }

  const handleDeleteVar = async (variantId) => {
    if (!confirm('Xóa biến thể này?')) return
    try {
      await productApi.deleteVariant(variantId)
      toast.success('Đã xóa biến thể')
      fetchProducts(page, search)
    } catch (e) { toast.error(e.message) }
  }

  const toggleAttrValue = (valueId) => {
    setVarForm((f) => ({
      ...f,
      attributeValueIds: f.attributeValueIds.includes(valueId)
        ? f.attributeValueIds.filter((id) => id !== valueId)
        : [...f.attributeValueIds, valueId],
    }))
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản lý sản phẩm</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Thêm, sửa, xóa sản phẩm — click vào hàng để quản lý biến thể
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddProd} id="admin-add-product">
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

      {loading ? <PageSpinner /> : (
        <>
          {/* Table */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--bg-glass-border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}
          >
            {products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Package size={36} /></div>
                <p className="empty-state-title">Chưa có sản phẩm nào</p>
                <button className="btn btn-primary" onClick={openAddProd}>Thêm sản phẩm đầu tiên</button>
              </div>
            ) : (
              products.map((p) => (
                <div key={p.id} style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                  {/* Product row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 2fr 1fr 1fr 120px 80px 110px',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px var(--space-lg)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Quản lý biến thể"
                    >
                      {expandedId === p.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Product info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={getProductImage(p.image)}
                        alt={p.name}
                        style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', flexShrink: 0 }}
                        onError={(e) => { e.target.src = 'https://placehold.co/38x38/1a1a2e/818cf8?text=📱' }}
                      />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{p.id}</p>
                      </div>
                    </div>

                    <span className="badge badge-primary" style={{ justifySelf: 'start' }}>{p.brand}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{p.category?.name || '—'}</span>
                    <span style={{ fontWeight: 600, color: 'var(--brand-primary)', fontSize: '0.9rem' }}>
                      {getMinPrice(p.variants) != null ? formatCurrency(getMinPrice(p.variants)) : '—'}
                    </span>

                    {/* Variant count chip */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Layers size={13} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {(p.variants || []).length} biến thể
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEditProd(p)} title="Sửa sản phẩm">
                        <Pencil size={13} />
                      </button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDeleteProd(p.id)} title="Xóa sản phẩm">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Variant panel */}
                  {expandedId === p.id && (
                    <div
                      style={{
                        background: 'var(--bg-surface)',
                        borderTop: '1px solid var(--bg-glass-border)',
                        padding: 'var(--space-lg) var(--space-xl)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                          Biến thể sản phẩm
                        </p>
                        <button className="btn btn-outline btn-sm" onClick={() => openAddVar(p.id)}>
                          <Plus size={13} /> Thêm biến thể
                        </button>
                      </div>

                      {(p.variants || []).length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          Chưa có biến thể nào. Nhấn "Thêm biến thể" để bắt đầu.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(p.variants || []).map((v) => (
                            <div
                              key={v.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 16px',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--bg-glass-border)',
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                {/* Attribute tags */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                                  {(v.attributes || []).length > 0 ? (
                                    v.attributes.map((a) => (
                                      <span
                                        key={a.id}
                                        style={{
                                          fontSize: '0.75rem',
                                          padding: '2px 8px',
                                          background: 'rgba(99,102,241,0.15)',
                                          color: 'var(--brand-primary)',
                                          borderRadius: 'var(--radius-full)',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {a.value}
                                      </span>
                                    ))
                                  ) : (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                      Variant #{v.id}
                                    </span>
                                  )}
                                </div>
                                <div style={{ display: 'flex', gap: 16, fontSize: '0.875rem' }}>
                                  <span>
                                    Giá bán: <strong style={{ color: 'var(--brand-primary)' }}>{formatCurrency(v.price)}</strong>
                                  </span>
                                  <span style={{ color: 'var(--text-secondary)' }}>
                                    Tồn kho: <strong>{v.quantityInStock}</strong>
                                  </span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  className="btn btn-secondary btn-sm btn-icon"
                                  onClick={() => openEditVar(p.id, v)}
                                  title="Sửa biến thể"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  className="btn btn-danger btn-sm btn-icon"
                                  onClick={() => handleDeleteVar(v.id)}
                                  title="Xóa biến thể"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 0} onClick={() => { const p2 = page-1; setPage(p2); fetchProducts(p2, search) }}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => { setPage(i); fetchProducts(i, search) }}>{i+1}</button>
              ))}
              <button className="page-btn" disabled={page >= totalPages-1} onClick={() => { const p2 = page+1; setPage(p2); fetchProducts(p2, search) }}>›</button>
            </div>
          )}
        </>
      )}

      {/* ── Product Modal ── */}
      <Modal isOpen={prodModal} onClose={() => setProdModal(false)} title={editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-name">Tên sản phẩm *</label>
              <input id="prod-name" type="text" className="form-input" placeholder="iPhone 16 Pro Max" value={prodForm.name} onChange={(e) => setProdForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-brand">Hãng *</label>
              <input id="prod-brand" type="text" className="form-input" placeholder="Apple" value={prodForm.brand} onChange={(e) => setProdForm(f => ({ ...f, brand: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-category">Danh mục</label>
            <select id="prod-category" className="form-select" value={prodForm.categoryId} onChange={(e) => setProdForm(f => ({ ...f, categoryId: Number(e.target.value) || '' }))}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-image">URL hình ảnh</label>
            <input id="prod-image" type="url" className="form-input" placeholder="https://..." value={prodForm.image} onChange={(e) => setProdForm(f => ({ ...f, image: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-desc">Mô tả</label>
            <textarea id="prod-desc" className="form-input" rows={3} placeholder="Mô tả sản phẩm..." value={prodForm.description} onChange={(e) => setProdForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setProdModal(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSaveProd} disabled={savingProd} id="save-product-btn">
              {savingProd ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo sản phẩm'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Variant Modal ── */}
      <Modal
        isOpen={varModal.open}
        onClose={() => setVarModal({ open: false, productId: null, variantId: null })}
        title={varModal.variantId ? 'Sửa biến thể' : 'Thêm biến thể mới'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="var-price">Giá bán (VND) *</label>
              <input
                id="var-price"
                type="number"
                min="0"
                step="1000"
                className="form-input"
                placeholder="VD: 29990000"
                value={varForm.price}
                onChange={(e) => setVarForm(f => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="var-qty">Tồn kho ban đầu *</label>
              <input
                id="var-qty"
                type="number"
                min="0"
                className="form-input"
                placeholder="VD: 50"
                value={varForm.quantityInStock}
                onChange={(e) => setVarForm(f => ({ ...f, quantityInStock: e.target.value }))}
              />
            </div>
          </div>

          {/* Attribute value picker */}
          <div>
            <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>
              Thuộc tính biến thể
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>(chọn giá trị)</span>
            </label>
            {attributes.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Chưa có thuộc tính nào. Thêm tại trang Thuộc tính.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {attributes.map((attr) => (
                  <div key={attr.id}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {attr.name}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(attr.values || []).map((val) => {
                        const selected = varForm.attributeValueIds.includes(val.id)
                        return (
                          <button
                            key={val.id}
                            type="button"
                            onClick={() => toggleAttrValue(val.id)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 'var(--radius-full)',
                              border: `1px solid ${selected ? 'var(--brand-primary)' : 'var(--bg-glass-border)'}`,
                              background: selected ? 'rgba(99,102,241,0.15)' : 'var(--bg-surface)',
                              color: selected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                              fontSize: '0.8rem',
                              fontWeight: selected ? 700 : 400,
                              transition: 'all var(--transition-fast)',
                            }}
                          >
                            {val.value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected attributes preview */}
          {varForm.attributeValueIds.length > 0 && (
            <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Đã chọn: {attributes
                .flatMap((a) => a.values || [])
                .filter((v) => varForm.attributeValueIds.includes(v.id))
                .map((v) => v.value)
                .join(' · ')}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setVarModal({ open: false, productId: null, variantId: null })}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSaveVar} disabled={savingVar} id="save-variant-btn">
              {savingVar ? 'Đang lưu...' : varModal.variantId ? 'Cập nhật biến thể' : 'Thêm biến thể'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
