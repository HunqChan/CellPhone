import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, Trash2, Star } from 'lucide-react'
import { addressApi } from '../../api/addressApi'
import { locationApi } from '../../api/locationApi'
import { useAuthStore, selectUser } from '../../store/authStore'
import { toast } from '../../store/toastStore'
import Modal from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'

const EMPTY_FORM = {
  provinceId: '',
  wardId: '',
  detailAddress: '',
  isDefault: false,
}

export default function AddressesPage() {
  const user = useAuthStore(selectUser)
  const [addresses, setAddresses] = useState([])
  const [provinces, setProvinces] = useState([])
  const [wards, setWards] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      addressApi.getByUser(user.id),
      locationApi.getProvinces(),
    ])
      .then(([aRes, pRes]) => {
        setAddresses(aRes.data || [])
        setProvinces(pRes.data || [])
      })
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (!form.provinceId) { setWards([]); return }
    locationApi.getWardsByProvince(form.provinceId).then((r) => setWards(r.data || []))
  }, [form.provinceId])

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setModalOpen(true) }
  const openEdit = (addr) => {
    setForm({
      provinceId: addr.province?.id || '',
      wardId: addr.ward?.id || '',
      detailAddress: addr.detailAddress || '',
      isDefault: addr.isDefault || false,
      userId: user.id,
    })
    setEditingId(addr.id)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.provinceId || !form.wardId || !form.detailAddress) {
      toast.warning('Vui lòng điền đầy đủ thông tin')
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, userId: user.id }
      let res
      if (editingId) {
        res = await addressApi.update(editingId, payload)
        setAddresses((prev) => prev.map((a) => (a.id === editingId ? res.data : a)))
        toast.success('Cập nhật địa chỉ thành công')
      } else {
        res = await addressApi.add(payload)
        setAddresses((prev) => [...prev, res.data])
        toast.success('Thêm địa chỉ thành công')
      }
      setModalOpen(false)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa địa chỉ này?')) return
    try {
      await addressApi.delete(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      toast.success('Đã xóa địa chỉ')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleSetDefault = async (id) => {
    try {
      const res = await addressApi.setDefault(id, user.id)
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      )
      toast.success('Đã đặt làm địa chỉ mặc định')
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (loading) return <div className="page-wrapper"><PageSpinner /></div>

  return (
    <div className="page-wrapper">
      <div className="container page-content" style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>Địa chỉ của tôi</h1>
          <button className="btn btn-primary" onClick={openAdd} id="add-address-btn">
            <Plus size={16} />
            Thêm địa chỉ
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><MapPin size={36} /></div>
            <p className="empty-state-title">Chưa có địa chỉ nào</p>
            <button className="btn btn-primary" onClick={openAdd}>
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="card"
                style={{
                  padding: 'var(--space-xl)',
                  borderColor: addr.isDefault ? 'rgba(99,102,241,0.4)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                    <MapPin size={20} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{addr.detailAddress}</span>
                        {addr.isDefault && (
                          <span className="badge badge-primary">
                            <Star size={10} style={{ marginRight: 3 }} />
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {addr.ward?.name && `${addr.ward.name}, `}{addr.province?.name}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    {!addr.isDefault && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSetDefault(addr.id)}
                        title="Đặt làm mặc định"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(addr)}>
                      Sửa
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(addr.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Add/Edit */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="addr-province">Tỉnh / Thành phố</label>
              <select
                id="addr-province"
                className="form-select"
                value={form.provinceId}
                onChange={(e) => setForm((f) => ({ ...f, provinceId: e.target.value, wardId: '' }))}
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="addr-ward">Phường / Xã</label>
              <select
                id="addr-ward"
                className="form-select"
                value={form.wardId}
                onChange={(e) => setForm((f) => ({ ...f, wardId: e.target.value }))}
                disabled={!form.provinceId}
              >
                <option value="">-- Chọn phường/xã --</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="addr-detail">Địa chỉ chi tiết</label>
              <input
                id="addr-detail"
                type="text"
                className="form-input"
                placeholder="Số nhà, tên đường..."
                value={form.detailAddress}
                onChange={(e) => setForm((f) => ({ ...f, detailAddress: e.target.value }))}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                style={{ accentColor: 'var(--brand-primary)', width: 16, height: 16 }}
              />
              Đặt làm địa chỉ mặc định
            </label>

            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                id="save-address-btn"
              >
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm địa chỉ'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
