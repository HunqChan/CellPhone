import { useState, useCallback } from 'react'
import {
  Search, PackagePlus, PackageMinus, CheckCircle2,
  X, ChevronRight, Box, AlertTriangle
} from 'lucide-react'
import { productApi } from '../../api/productApi'
import { inventoryApi } from '../../api/inventoryApi'
import { attributeApi } from '../../api/attributeApi'
import { toast } from '../../store/toastStore'
import { formatCurrency } from '../../utils/formatters'

// ─── Debounce helper ────────────────────────────────────────
function useDebounce(fn, delay = 400) {
  const timer = useState(null)[0]
  return useCallback((...args) => {
    if (timer) clearTimeout(timer)
    const t = setTimeout(() => fn(...args), delay)
    return t
  }, [])
}

// ─── Variant tag label ───────────────────────────────────────
function variantLabel(variant) {
  const attrs = (variant.attributes || []).map((a) => a.value).join(' / ')
  return attrs || `Variant #${variant.id}`
}

export default function InventoryAdminPage() {
  const [mode, setMode] = useState('import') // 'import' | 'export'

  // Product search state
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Selected product & variant
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)

  // Form values
  const [quantity, setQuantity] = useState('')
  const [importPrice, setImportPrice] = useState('')
  const [note, setNote] = useState('')

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  // ── Search products by name ──────────────────────────────
  const doSearch = async (text) => {
    if (!text.trim()) { setSearchResults([]); setShowDropdown(false); return }
    setSearching(true)
    try {
      const res = await productApi.search(text)
      setSearchResults(res.data || [])
      setShowDropdown(true)
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchText(val)
    if (val.trim()) {
      setTimeout(() => doSearch(val), 400)
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }
  }

  const selectProduct = (product) => {
    setSelectedProduct(product)
    setSelectedVariant(null)
    setSearchText(product.name)
    setShowDropdown(false)
    setLastResult(null)
  }

  const clearProduct = () => {
    setSelectedProduct(null)
    setSelectedVariant(null)
    setSearchText('')
    setLastResult(null)
  }

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedVariant) { toast.warning('Vui lòng chọn biến thể sản phẩm'); return }
    if (!quantity || parseInt(quantity) <= 0) { toast.warning('Số lượng phải lớn hơn 0'); return }
    if (mode === 'import' && importPrice && parseFloat(importPrice) <= 0) {
      toast.warning('Giá nhập phải lớn hơn 0')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        productVariantId: selectedVariant.id,
        quantity: parseInt(quantity),
        ...(mode === 'import' && importPrice ? { importPrice: parseFloat(importPrice) } : {}),
      }

      const res = mode === 'import'
        ? await inventoryApi.importStock(payload)
        : await inventoryApi.exportStock(payload)

      setLastResult(res.data)
      toast.success(
        mode === 'import'
          ? `Nhập kho thành công! Tồn kho mới: ${res.data?.quantityInStock}`
          : `Xuất kho thành công! Tồn kho còn: ${res.data?.quantityInStock}`
      )
      // Reset form
      setQuantity('')
      setImportPrice('')
      setNote('')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const totalCost =
    mode === 'import' && quantity && importPrice
      ? parseInt(quantity) * parseFloat(importPrice)
      : null

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản lý kho hàng</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Nhập hoặc xuất kho theo lô hàng, tìm sản phẩm bằng tên
        </p>
      </div>

      {/* ── Mode tabs ── */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 4,
          marginBottom: 'var(--space-xl)',
          gap: 4,
        }}
      >
        {[
          { key: 'import', icon: PackagePlus, label: 'Nhập kho', color: 'var(--success)' },
          { key: 'export', icon: PackageMinus, label: 'Xuất kho (điều chỉnh)', color: 'var(--error)' },
        ].map(({ key, icon: Icon, label, color }) => (
          <button
            key={key}
            id={`tab-${key}`}
            onClick={() => { setMode(key); setLastResult(null) }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: mode === key ? 'var(--bg-card)' : 'transparent',
              color: mode === key ? color : 'var(--text-secondary)',
              border: mode === key ? `1px solid ${color}30` : '1px solid transparent',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Main card ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--bg-glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
        }}
      >
        {/* STEP 1 — Tìm sản phẩm */}
        <div>
          <StepLabel number={1} label="Tìm sản phẩm theo tên" />
          <div style={{ position: 'relative', marginTop: 'var(--space-sm)' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                id="inv-product-search"
                type="text"
                className="form-input"
                style={{ paddingLeft: 40, paddingRight: selectedProduct ? 40 : 16 }}
                placeholder="Nhập tên sản phẩm... (VD: iPhone, Samsung Galaxy...)"
                value={searchText}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                autoComplete="off"
              />
              {selectedProduct && (
                <button
                  onClick={clearProduct}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Dropdown results */}
            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  marginTop: 4,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--bg-glass-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  maxHeight: 300,
                  overflowY: 'auto',
                }}
              >
                {searching ? (
                  <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                    Đang tìm kiếm...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                    Không tìm thấy sản phẩm
                  </div>
                ) : (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectProduct(p)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        textAlign: 'left',
                        transition: 'background var(--transition-fast)',
                        borderBottom: '1px solid var(--bg-glass-border)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: 'var(--bg-card)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                          flexShrink: 0,
                        }}
                      >
                        📱
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.brand} · {(p.variants || []).length} biến thể
                        </p>
                      </div>
                      <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected product badge */}
          {selectedProduct && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 16px',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <CheckCircle2 size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {selectedProduct.name}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                — {selectedProduct.brand}
              </span>
            </div>
          )}
        </div>

        {/* STEP 2 — Chọn biến thể */}
        {selectedProduct && (
          <div>
            <StepLabel number={2} label="Chọn biến thể" />
            {(selectedProduct.variants || []).length === 0 ? (
              <div
                style={{
                  marginTop: 8,
                  padding: '12px 16px',
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  color: 'var(--warning)',
                }}
              >
                <AlertTriangle size={16} />
                Sản phẩm này chưa có biến thể nào
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {(selectedProduct.variants || []).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${selectedVariant?.id === v.id ? 'var(--brand-primary)' : 'var(--bg-glass-border)'}`,
                      background: selectedVariant?.id === v.id ? 'rgba(99,102,241,0.15)' : 'var(--bg-surface)',
                      color: selectedVariant?.id === v.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <span>{variantLabel(v)}</span>
                    <span style={{ marginLeft: 6, opacity: 0.7, fontWeight: 400 }}>
                      · {formatCurrency(v.price)} · Tồn: {v.quantityInStock}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Nhập thông tin lô */}
        {selectedVariant && (
          <div>
            <StepLabel number={3} label={mode === 'import' ? 'Thông tin lô nhập hàng' : 'Thông tin xuất kho'} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: mode === 'import' ? '1fr 1fr' : '1fr',
                gap: 'var(--space-md)',
                marginTop: 'var(--space-sm)',
              }}
            >
              {/* Số lượng */}
              <div className="form-group">
                <label className="form-label" htmlFor="inv-qty">
                  Số lượng {mode === 'import' ? 'nhập' : 'xuất'} *
                </label>
                <input
                  id="inv-qty"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Nhập số lượng..."
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* Giá nhập — chỉ khi import */}
              {mode === 'import' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="inv-price">
                    Giá nhập / đơn vị (VND)
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>
                      (tùy chọn)
                    </span>
                  </label>
                  <input
                    id="inv-price"
                    type="number"
                    min="0"
                    step="1000"
                    className="form-input"
                    placeholder="VD: 15000000"
                    value={importPrice}
                    onChange={(e) => setImportPrice(e.target.value)}
                  />
                </div>
              )}

              {/* Ghi chú */}
              <div className="form-group" style={{ gridColumn: mode === 'import' ? '1 / -1' : '1' }}>
                <label className="form-label" htmlFor="inv-note">
                  Ghi chú
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>(tùy chọn)</span>
                </label>
                <input
                  id="inv-note"
                  type="text"
                  className="form-input"
                  placeholder="Lý do nhập/xuất, tên nhà cung cấp..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            {/* Tóm tắt lô hàng */}
            <div
              style={{
                marginTop: 'var(--space-md)',
                padding: 'var(--space-md)',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--bg-glass-border)',
              }}
            >
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 10 }}>
                Tóm tắt {mode === 'import' ? 'lô nhập' : 'lô xuất'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <SummaryRow label="Sản phẩm" value={selectedProduct.name} />
                <SummaryRow label="Biến thể" value={variantLabel(selectedVariant)} />
                <SummaryRow label="Tồn kho hiện tại" value={`${selectedVariant.quantityInStock} sản phẩm`} />
                <SummaryRow
                  label="Sau khi xử lý"
                  value={
                    quantity
                      ? `${
                          mode === 'import'
                            ? selectedVariant.quantityInStock + parseInt(quantity || 0)
                            : Math.max(0, selectedVariant.quantityInStock - parseInt(quantity || 0))
                        } sản phẩm`
                      : '—'
                  }
                  highlight
                />
                {mode === 'import' && importPrice && quantity && (
                  <>
                    <div style={{ borderTop: '1px solid var(--bg-glass-border)', margin: '4px 0' }} />
                    <SummaryRow label="Giá nhập / đơn vị" value={formatCurrency(parseFloat(importPrice))} />
                    <SummaryRow
                      label="Tổng giá trị lô hàng"
                      value={formatCurrency(totalCost)}
                      highlight
                    />
                  </>
                )}
              </div>
            </div>

            {/* Submit button */}
            <button
              id="inv-submit-btn"
              className={`btn ${mode === 'import' ? 'btn-primary' : 'btn-danger'}`}
              style={{ width: '100%', marginTop: 'var(--space-md)', padding: '14px' }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Đang xử lý...' : mode === 'import' ? '✓ Xác nhận nhập kho' : '✓ Xác nhận xuất kho'}
            </button>
          </div>
        )}

        {/* Result banner */}
        {lastResult && (
          <div
            style={{
              padding: 'var(--space-lg)',
              background: mode === 'import' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${mode === 'import' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle2 size={18} color={mode === 'import' ? 'var(--success)' : 'var(--error)'} />
              <p style={{ fontWeight: 700, color: mode === 'import' ? 'var(--success)' : 'var(--error)' }}>
                {mode === 'import' ? 'Nhập kho thành công!' : 'Xuất kho thành công!'}
              </p>
            </div>
            <SummaryRow label="Tồn kho sau cập nhật" value={`${lastResult.quantityInStock} sản phẩm`} highlight />
            <SummaryRow label="Giá bán hiện tại" value={formatCurrency(lastResult.price)} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Helper Components ──────────────────────────────────────

function StepLabel({ number, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'var(--brand-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{label}</span>
    </div>
  )
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: highlight ? 700 : 500, color: highlight ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
        {value}
      </span>
    </div>
  )
}
