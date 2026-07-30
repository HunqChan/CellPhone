import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Tag } from 'lucide-react'
import { attributeApi } from '../../api/attributeApi'
import { toast } from '../../store/toastStore'
import Modal from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'

export default function AttributesAdminPage() {
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  // Attribute modal
  const [attrModal, setAttrModal] = useState({ open: false, id: null, name: '' })
  // Value modal
  const [valModal, setValModal] = useState({ open: false, attributeId: null, valueId: null, value: '' })
  const [saving, setSaving] = useState(false)

  const fetch = () => {
    attributeApi.getAll()
      .then((r) => setAttributes(r.data || []))
      .finally(() => setLoading(false))
  }
  useEffect(fetch, [])

  // ── Attribute CRUD ──
  const openAddAttr = () => setAttrModal({ open: true, id: null, name: '' })
  const openEditAttr = (attr) => setAttrModal({ open: true, id: attr.id, name: attr.name })

  const saveAttr = async () => {
    if (!attrModal.name.trim()) { toast.warning('Tên thuộc tính là bắt buộc'); return }
    setSaving(true)
    try {
      if (attrModal.id) {
        await attributeApi.update(attrModal.id, { name: attrModal.name })
        toast.success('Cập nhật thuộc tính thành công')
      } else {
        await attributeApi.create({ name: attrModal.name })
        toast.success('Tạo thuộc tính thành công')
      }
      setAttrModal({ open: false, id: null, name: '' })
      fetch()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteAttr = async (id) => {
    if (!confirm('Xóa thuộc tính này sẽ xóa tất cả giá trị của nó. Tiếp tục?')) return
    try {
      await attributeApi.delete(id)
      toast.success('Đã xóa thuộc tính')
      fetch()
    } catch (e) {
      toast.error(e.message)
    }
  }

  // ── Attribute Value CRUD ──
  const openAddVal = (attributeId) => setValModal({ open: true, attributeId, valueId: null, value: '' })
  const openEditVal = (attributeId, val) =>
    setValModal({ open: true, attributeId, valueId: val.id, value: val.value })

  const saveVal = async () => {
    if (!valModal.value.trim()) { toast.warning('Giá trị không được để trống'); return }
    setSaving(true)
    try {
      if (valModal.valueId) {
        await attributeApi.updateValue(valModal.valueId, { value: valModal.value })
        toast.success('Cập nhật giá trị thành công')
      } else {
        await attributeApi.addValue(valModal.attributeId, { value: valModal.value })
        toast.success('Thêm giá trị thành công')
      }
      setValModal({ open: false, attributeId: null, valueId: null, value: '' })
      fetch()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteVal = async (attributeId, valueId) => {
    if (!confirm('Xóa giá trị này?')) return
    try {
      await attributeApi.deleteValue(attributeId, valueId)
      toast.success('Đã xóa giá trị')
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản lý thuộc tính</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Thuộc tính dùng để tạo biến thể sản phẩm (màu sắc, dung lượng, RAM...)
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddAttr} id="admin-add-attr">
          <Plus size={16} />
          Thêm thuộc tính
        </button>
      </div>

      {attributes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Tag size={36} /></div>
          <p className="empty-state-title">Chưa có thuộc tính nào</p>
          <button className="btn btn-primary" onClick={openAddAttr}>Thêm thuộc tính đầu tiên</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {attributes.map((attr) => (
            <div
              key={attr.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-glass-border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              {/* Attribute Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-lg) var(--space-xl)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                }}
                onClick={() => setExpandedId(expandedId === attr.id ? null : attr.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: 'rgba(99,102,241,0.15)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Tag size={16} color="var(--brand-primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{attr.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {(attr.values || []).length} giá trị
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm btn-icon"
                    onClick={(e) => { e.stopPropagation(); openEditAttr(attr) }}
                    title="Sửa thuộc tính"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-icon"
                    onClick={(e) => { e.stopPropagation(); deleteAttr(attr.id) }}
                    title="Xóa thuộc tính"
                  >
                    <Trash2 size={14} />
                  </button>
                  {expandedId === attr.id ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Attribute Values (expanded) */}
              {expandedId === attr.id && (
                <div
                  style={{
                    borderTop: '1px solid var(--bg-glass-border)',
                    padding: 'var(--space-lg) var(--space-xl)',
                    background: 'var(--bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                      Giá trị thuộc tính
                    </p>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openAddVal(attr.id)}
                    >
                      <Plus size={13} />
                      Thêm giá trị
                    </button>
                  </div>

                  {(attr.values || []).length === 0 ? (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Chưa có giá trị nào</p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                      {attr.values.map((val) => (
                        <div
                          key={val.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--bg-glass-border)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.875rem',
                          }}
                        >
                          <span>{val.value}</span>
                          <button
                            onClick={() => openEditVal(attr.id, val)}
                            style={{ color: 'var(--text-accent)', lineHeight: 1 }}
                            title="Sửa"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            onClick={() => deleteVal(attr.id, val.id)}
                            style={{ color: 'var(--error)', lineHeight: 1 }}
                            title="Xóa"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Attribute Modal */}
      <Modal
        isOpen={attrModal.open}
        onClose={() => setAttrModal({ open: false, id: null, name: '' })}
        title={attrModal.id ? 'Sửa thuộc tính' : 'Thêm thuộc tính mới'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="attr-name">Tên thuộc tính *</label>
            <input
              id="attr-name"
              type="text"
              className="form-input"
              placeholder="Màu sắc, Dung lượng, RAM..."
              value={attrModal.name}
              onChange={(e) => setAttrModal((m) => ({ ...m, name: e.target.value }))}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setAttrModal({ open: false, id: null, name: '' })}>Hủy</button>
            <button className="btn btn-primary" onClick={saveAttr} disabled={saving} id="save-attr-btn">
              {saving ? 'Đang lưu...' : attrModal.id ? 'Cập nhật' : 'Tạo thuộc tính'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Value Modal */}
      <Modal
        isOpen={valModal.open}
        onClose={() => setValModal({ open: false, attributeId: null, valueId: null, value: '' })}
        title={valModal.valueId ? 'Sửa giá trị' : 'Thêm giá trị mới'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="val-value">Giá trị *</label>
            <input
              id="val-value"
              type="text"
              className="form-input"
              placeholder="Đen, 128GB, 8GB..."
              value={valModal.value}
              onChange={(e) => setValModal((m) => ({ ...m, value: e.target.value }))}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setValModal({ open: false, attributeId: null, valueId: null, value: '' })}>Hủy</button>
            <button className="btn btn-primary" onClick={saveVal} disabled={saving} id="save-val-btn">
              {saving ? 'Đang lưu...' : valModal.valueId ? 'Cập nhật' : 'Thêm giá trị'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
